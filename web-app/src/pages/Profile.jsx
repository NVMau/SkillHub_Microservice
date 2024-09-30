import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Avatar,
} from "@mui/material";
import {
  getMyProfile,
  updateUserProfile,
  updateAvatar,
} from "../services/userService";
import Scene from "./Scene";
import LineItem from "../components/LineItem";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null); // Xem trước avatar mới
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState("info");
  const [snackBarMessage, setSnackBarMessage] = useState("");

  // Hàm đóng Snackbar
  const handleCloseSnackBar = () => setSnackBarOpen(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    setPreviewAvatar(URL.createObjectURL(file));
  };

  // Hàm lấy thông tin profile hiện tại
  const getProfile = async () => {
    try {
      const response = await getMyProfile();
      setProfile(response.data);
    } catch (error) {
      setSnackSeverity("error");
      setSnackBarMessage("Lỗi khi lấy thông tin người dùng");
      setSnackBarOpen(true);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // Hàm cập nhật thông tin profile
  const handleUpdateProfile = async () => {
    try {
      // Cập nhật thông tin người dùng
      await updateUserProfile(profile);
      // Nếu có ảnh mới, cập nhật avatar
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        await updateAvatar(profile.profileId, formData);
      }
      setSnackSeverity("success");
      setSnackBarMessage("Cập nhật thành công");
      setEditMode(false);
      getProfile(); // Load lại thông tin mới
    } catch (error) {
      setSnackSeverity("error");
      setSnackBarMessage("Lỗi khi cập nhật thông tin");
    } finally {
      setSnackBarOpen(true);
    }
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          height: "100vh", // Đảm bảo chiều cao 100% viewport
          width: "100%", // Đảm bảo chiều rộng 100% viewport
        }}
      >
        <Card
          sx={{
            minWidth: 350,
            maxWidth: 450,
            boxShadow: 3,
            borderRadius: 2,
            justifyContent: "center",
            padding: 4,
            width: "100%", // Chiếm toàn bộ chiều rộng

            display: "flex",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "100%",
              gap: "10px",
              textAlign: "center", // Canh giữa nội dung bên trong
            }}
          >
            <Typography variant="h5" textAlign={"center"}>
              Thông tin cá nhân
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center", // Canh giữa theo chiều ngang
                alignItems: "center", // Canh giữa theo chiều dọc
                width: "100%",
              }}
            >
              <Avatar
                src={profile.avatarUrl}
                sx={{ width: 100, height: 100, marginBottom: "20px" }}
              />
            </Box>

            <Box sx={{ width: "100%", marginBottom: "20px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "left", // Căn cách giữa tiêu đề và dữ liệu
                  marginBottom: "10px",
                }}
              >
                <Typography fontWeight="bold">Username: </Typography>
                <Typography paddingLeft={"10px"}>{profile.username}</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "left", // Căn cách giữa tiêu đề và dữ liệu
                  marginBottom: "10px",
                }}
              >
                <Typography fontWeight="bold">Email: </Typography>
                <Typography paddingLeft={"10px"}>{profile.email}</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "left", // Căn cách giữa tiêu đề và dữ liệu
                  marginBottom: "10px",
                }}
              >
                <Typography fontWeight="bold">Profile Id: </Typography>
                <Typography paddingLeft={"10px"}>
                  {profile.profileId}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "left", // Căn cách giữa tiêu đề và dữ liệu
                  marginBottom: "10px",
                }}
              >
                <Typography fontWeight="bold">First Name: </Typography>
                <Typography paddingLeft={"10px"}>
                  {profile.firstName}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "left", // Căn cách giữa tiêu đề và dữ liệu
                  marginBottom: "10px",
                }}
              >
                <Typography fontWeight="bold">Last Name:</Typography>
                <Typography paddingLeft={"10px"}>{profile.lastName}</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "left", // Căn cách giữa tiêu đề và dữ liệu
                  marginBottom: "10px",
                }}
              >
                <Typography fontWeight="bold">Date of birth:</Typography>
                <Typography paddingLeft={"10px"}>{profile.dob}</Typography>
              </Box>
            </Box>

            {/* Nút chỉnh sửa thông tin đặt sang bên phải */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end", // Đặt nút sang bên phải
                width: "100%",
              }}
            >
              <Button variant="contained" onClick={() => setEditMode(true)}>
                Chỉnh sửa thông tin
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* Form chỉnh sửa thông tin */}
      <Dialog open={editMode} onClose={() => setEditMode(false)}>
        <DialogTitle>Chỉnh sửa thông tin cá nhân</DialogTitle>
        <DialogContent>
          <Box paddingTop={2}>
            <TextField
              label="First Name"
              fullWidth
              value={profile.firstName || ""}
              onChange={(e) =>
                setProfile({ ...profile, firstName: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              label="Last Name"
              fullWidth
              value={profile.lastName || ""}
              onChange={(e) =>
                setProfile({ ...profile, lastName: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              fullWidth
              value={profile.email || ""}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              sx={{ mb: 2 }}
            />

            <TextField
              label="Date of Birth"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }} // Đảm bảo nhãn không bị đẩy đi
              value={profile.dob || ""}
              onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
              sx={{ mb: 2 }}
            />
          </Box>

          <Button variant="contained" component="label">
            Thay đổi avatar
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {previewAvatar && (
            <Box mt={2}>
              <Typography>Avatar Preview:</Typography>
              <Avatar src={previewAvatar} sx={{ width: 100, height: 100 }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditMode(false)}
            variant="contained"
            color="error"
          >
            Hủy
          </Button>
          <Button onClick={handleUpdateProfile} variant="contained">
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>
    </Scene>
  );
}
