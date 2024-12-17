import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import {
  getAllPosts,
  getCommentsByPostId,
  addComment,
  addInteraction,
  createPost,
  deletePost,
} from "../services/blogService";
import Scene from "./Scene";
import { useProfile } from "../context/ProfileContext";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // Bài viết đang xem chi tiết
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState(""); // Bình luận mới cho bình luận cha
  const [newReplyComment, setNewReplyComment] = useState(""); // Bình luận mới cho phần trả lời
  const [replyCommentId, setReplyCommentId] = useState(null); // ID của comment đang được reply
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState("info");
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Trạng thái cho hộp thoại xóa
  const [detailDialogOpen, setDetailDialogOpen] = useState(false); // Trạng thái cho hộp thoại chi tiết bài viết
  const { profile, fetchProfile } = useProfile();
  const [postToDelete, setPostToDelete] = useState(null); // Bài viết được chọn để xóa

  // Trạng thái cho tạo bài viết
  const [createPostDialogOpen, setCreatePostDialogOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Mở form tạo bài viết
  const handleOpenCreatePostDialog = () => {
    setCreatePostDialogOpen(true);
  };

  // Đóng form tạo bài viết
  const handleCloseCreatePostDialog = () => {
    setCreatePostDialogOpen(false);
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostImage(null);
    setPreviewImage(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setNewPostImage(selectedFile);
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewImage(objectUrl);
    }
  };

  // Mở hộp thoại xác nhận xóa
  const handleOpenDeleteDialog = (post) => {
    setPostToDelete(post); // Lưu bài viết được chọn để xóa
    setDeleteDialogOpen(true);   // Mở hộp thoại xóa
  };

  // Thực hiện việc xóa bài viết
  const handleDeletePost = async () => {
    try {
      await deletePost(postToDelete.postId); // Gọi API để xóa bài viết
      setSnackBarMessage("Xóa bài viết thành công!");
      setSnackSeverity("success");
      setSnackBarOpen(true);

      // Xóa bài viết khỏi giao diện sau khi xóa thành công
      setPosts(posts.filter((post) => post.postId !== postToDelete.postId));
    } catch (error) {
      setSnackBarMessage("Lỗi khi xóa bài viết!");
      setSnackSeverity("error");
      setSnackBarOpen(true);
    } finally {
      handleCloseDeleteDialog(); // Đóng hộp thoại xóa
    }
  };

  // Kiểm tra xem user hiện tại có quyền xóa bài viết không (là chủ bài viết hoặc là admin)
  const canDeletePost = (post) => {
    return profile?.profileId === post.authorId || profile?.roles.includes("ROLE_ADMIN");
  };

  // Đóng hộp thoại xóa
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null); // Reset bài viết được chọn
  };

  const handleCreatePost = async () => {
    const formData = new FormData();
    formData.append("title", newPostTitle);
    formData.append("content", newPostContent);
    formData.append("authorId", profile.profileId);
    formData.append("image", newPostImage);

    try {
      await createPost(formData);
      setSnackBarMessage("Bài viết đã được tạo thành công!");
      setSnackSeverity("success");
      setSnackBarOpen(true);
      fetchPosts(); // Tải lại danh sách bài viết sau khi tạo
      handleCloseCreatePostDialog(); // Đóng form sau khi tạo thành công
    } catch (error) {
      setSnackBarMessage("Lỗi khi tạo bài viết!");
      setSnackSeverity("error");
      setSnackBarOpen(true);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Lấy tất cả bài viết khi trang được load
  const fetchPosts = async () => {
    try {
      const response = await getAllPosts();
      setPosts(response.data);
    } catch (error) {
      setSnackBarMessage("Error fetching posts");
      setSnackSeverity("error");
      setSnackBarOpen(true);
    }
  };

  // Lấy bình luận cho mỗi bài viết khi nhấn "View More"
  const fetchComments = async (postId) => {
    try {
      const response = await getCommentsByPostId(postId);
      const groupedComments = groupCommentsByParent(response.data); // Group comments by parent-child relationship
      setComments((prev) => ({
        ...prev,
        [postId]: groupedComments,
      }));
    } catch (error) {
      setSnackBarMessage("Error fetching comments");
      setSnackSeverity("error");
      setSnackBarOpen(true);
    }
  };

  // Group comments by parent-child relationship
  const groupCommentsByParent = (comments) => {
    const commentMap = {};
    const grouped = [];

    comments.forEach((comment) => {
      commentMap[comment.commentId] = comment; // Map comment by ID
      comment.replies = []; // Initialize replies array
    });

    comments.forEach((comment) => {
      if (comment.commentParent) {
        // If it's a reply, attach it to the parent comment
        commentMap[comment.commentParent].replies.push(comment);
      } else {
        // If it's a parent comment, add it to the grouped list
        grouped.push(comment);
      }
    });

    return grouped;
  };

  const handleAddComment = async (postId, parentCommentId = null) => {
    const commentContent = parentCommentId ? newReplyComment : newComment; // Chọn nội dung bình luận phù hợp

    if (!commentContent) return;
    try {
      await addComment({
        postId,
        authorId: profile.profileId, // Thay thế bằng ID người dùng hiện tại
        content: commentContent,
        commentParent: parentCommentId, // Đặt parentCommentId nếu đang trả lời bình luận
      });

      // Reset giá trị sau khi gửi bình luận
      if (parentCommentId) {
        setNewReplyComment(""); // Reset bình luận trả lời
        setReplyCommentId(null); // Reset reply comment ID
      } else {
        setNewComment(""); // Reset bình luận cha
      }

      fetchComments(postId); // Tải lại danh sách bình luận
    } catch (error) {
      setSnackBarMessage("Error adding comment");
      setSnackSeverity("error");
      setSnackBarOpen(true);
    }
  };

  // Thêm Like hoặc Dislike
  const handleLikeDislike = async (postId, interactionType) => {
    try {
      await addInteraction({
        postId,
        interactionType,
        userId: profile.profileId, // Thay bằng ID người dùng hiện tại
      });
      setSnackBarMessage(
        `${interactionType === "like" ? "Liked" : "Disliked"} successfully!`
      );
      setSnackSeverity("success");
      setSnackBarOpen(true);
    } catch (error) {
      setSnackBarMessage("Error submitting interaction");
      setSnackSeverity("error");
      setSnackBarOpen(true);
    }
  };

  // Hiển thị chi tiết bài viết khi nhấn vào "View More" và mở Dialog chi tiết
  const handleViewMore = (post) => {
    setSelectedPost(post); // Lưu bài viết đang được chọn
    setDetailDialogOpen(true); // Mở Dialog chi tiết
    fetchComments(post.postId); // Lấy danh sách bình luận
  };

  // Đóng Dialog chi tiết bài viết
  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedPost(null);
  };

  // Đóng Snackbar
  const handleCloseSnackBar = () => setSnackBarOpen(false);

  // Chọn bình luận để trả lời
  const handleReply = (commentId) => {
    setReplyCommentId(commentId); // Chọn bình luận cha để reply
  };

  // Recursive component to render comments and their replies
  const renderComments = (comments) => {
    return comments.map((comment) => (
      <Box
        key={comment.commentId}
        sx={{
          paddingLeft: comment.commentParent ? "20px" : "0",

          marginTop: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: "5px",
            borderBottom: "2px solid #e0e0e0",
          }}
        >
          <img
            src={comment.authorAvatar || "https://via.placeholder.com/40"} // Đường dẫn tới avatar
            alt={comment.authorName}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              marginRight: "10px",
            }} // Style cho avatar
          />
          <Typography sx={{ fontWeight: 520 }} variant="body1">
            {comment.authorName}:
          </Typography>
          <Typography paddingLeft={"10px"} variant="body2">
            {comment.content}
          </Typography>{" "}
          {/* Hiển thị tên người dùng */}
        </Box>
        <Button
          variant="text"
          size="small"
          onClick={() => handleReply(comment.commentId)}
        >
          Trả lời
        </Button>
        {comment.replies && renderComments(comment.replies)}{" "}
        {/* Recursively render child comments */}
        {replyCommentId === comment.commentId && (
          <Box
            flexDirection={"column"}
            display={"flex"}
            sx={{ marginTop: "10px" }}
          >
            <TextField
              label="Nhập bình luận của bạn"
              fullWidth
              multiline
              value={newReplyComment} // Sử dụng newReplyComment cho phần trả lời
              onChange={(e) => setNewReplyComment(e.target.value)}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "4px",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  width: "auto", // Sử dụng auto để kích thước tự động theo nội dung
                  padding: "6px 16px", // Điều chỉnh padding để nút có chiều rộng hợp lý
                  whiteSpace: "nowrap", // Đảm bảo nội dung không bị xuống dòng
                }}
                onClick={() =>
                  handleAddComment(selectedPost.postId, comment.commentId)
                }
              >
                Bình luận
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    ));
  };

  return (
    <Scene>
      <Snackbar
        open={snackBarOpen}
        onClose={handleCloseSnackBar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={snackSeverity}
          variant="filled"
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>

      <Box sx={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Các bài đăng mới nhất
        </Typography>

        <Grid
          container
          spacing={3}
          sx={{ display: "flex", alignItems: "stretch" }}
        >
          {posts.map((post, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "100%",
                }}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={post.imageUrl || "https://via.placeholder.com/600"}
                  alt={post.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {post.content.substring(0, 100)}...
                    {/* Hiển thị 100 ký tự đầu tiên */}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <Button size="small" onClick={() => handleViewMore(post)}>
                    Xem Thêm
                  </Button>
                  {/* Nút Xóa Bài Viết */}
                  {canDeletePost(post) && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleOpenDeleteDialog(post)}
                    >
                      Xóa
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}

          {/* Dialog để hiển thị chi tiết bài viết */}
          {selectedPost && (
            <Dialog
              open={detailDialogOpen} // Dùng detailDialogOpen cho hộp thoại chi tiết
              onClose={handleCloseDetailDialog}
              fullWidth
              maxWidth="md"
            >
              <DialogTitle variant="h4">{selectedPost.title}</DialogTitle>
              <DialogContent>
                <CardMedia
                  component="img"
                  height="300"
                  image={
                    selectedPost.imageUrl || "https://via.placeholder.com/400"
                  }
                  alt={selectedPost.title}
                />
                <Typography variant="body1" color="textSecondary">
                  {selectedPost.content}
                </Typography>

                {/* Hiển thị bình luận */}
                <Box sx={{ marginTop: "20px" }}>
                  <Typography variant="h6">Comments</Typography>
                  {comments[selectedPost.postId] &&
                    renderComments(comments[selectedPost.postId])}
                </Box>

                {/* Form thêm bình luận cho bài viết (không phải reply) */}
                <Box
                  flexDirection={"column"}
                  display={"flex"}
                  sx={{ marginTop: "10px" }}
                >
                  <TextField
                    label="Nhập bình luận của bạn"
                    fullWidth
                    multiline
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "4px",
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        width: "auto", // Sử dụng auto để kích thước tự động theo nội dung
                        padding: "6px 16px", // Điều chỉnh padding để nút có chiều rộng hợp lý
                        whiteSpace: "nowrap", // Đảm bảo nội dung không bị xuống dòng
                      }}
                      onClick={() => handleAddComment(selectedPost.postId)}
                    >
                      BÌNH LUẬN
                    </Button>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDetailDialog}>Close</Button>
              </DialogActions>
            </Dialog>
          )}
        </Grid>

        {/* Nút Tạo Bài Viết */}
        <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "left" }}>
          <Button variant="contained" onClick={handleOpenCreatePostDialog}>
            Tạo Bài Viết
          </Button>
        </Box>

        {/* Dialog Tạo Bài Viết */}
        <Dialog
          open={createPostDialogOpen}
          onClose={handleCloseCreatePostDialog}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle variant="h4">Tạo Bài Viết Mới</DialogTitle>
          <DialogContent>
            <TextField
              label="Tiêu đề bài viết"
              fullWidth
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Nội dung bài viết"
              fullWidth
              multiline
              rows={4}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              margin="normal"
            />
            <Button variant="contained" component="label">
              Tải ảnh bài viết
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {previewImage && (
              <Box
                component="img"
                src={previewImage}
                alt="Preview"
                sx={{ width: "100%", height: "auto", marginTop: "20px" }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCreatePostDialog}>Hủy</Button>
            <Button onClick={handleCreatePost} variant="contained">
              Tạo bài viết
            </Button>
          </DialogActions>
        </Dialog>

        {/* Hộp thoại xác nhận xóa */}
        <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Xác nhận xóa bài viết</DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn xóa bài viết "{postToDelete?.title}" không?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
            <Button onClick={handleDeletePost} color="error">
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Scene>
  );
}
