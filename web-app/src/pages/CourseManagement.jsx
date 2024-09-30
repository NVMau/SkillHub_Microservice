import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  IconButton,
  InputLabel,
  Snackbar,
  FormControl,
  Select,
  Alert,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Scene from "./Scene"; // Dùng Scene để bọc nội dung
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getTeachers,
} from "../services/courseService"; // Các API thao tác với backend

export default function CourseManagement() {
  const [courses, setCourses] = useState([]); // Danh sách khóa học
  const [openAddDialog, setOpenAddDialog] = useState(false); // Để mở hoặc đóng dialog thêm khóa học
  const [openEditDialog, setOpenEditDialog] = useState(false); // Để mở dialog sửa khóa học

  const [previewImage, setPreviewImage] = useState(null); // Để hiển thị ảnh xem trước
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");
  const [teacherId, setTeacherId] = useState(""); // Lưu profileId thay vì userId
  const [file, setFile] = useState(null);
  const [teachers, setTeachers] = useState([]); // Lưu danh sách giáo viên

  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState("info");
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const handleCloseSnackBar = () => {
    setSnackBarOpen(false);
  };

  const [editCourse, setEditCourse] = useState({
    name: "",
    description: "",
    price: "",
  }); // Thông tin khóa học để sửa

  // Hàm lấy danh sách khóa học từ API
  const fetchCourses = async () => {
    try {
      const response = await getAllCourses();
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses", error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await getTeachers(); // Sử dụng service để lấy danh sách giáo viên
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);
  // Hàm mở dialog sửa khóa học và gán thông tin vào form
  const handleEditCourseOpen = (course) => {
    setEditCourse(course); // Gán thông tin khóa học vào form để sửa
    setOpenEditDialog(true);
  };

  // Hàm cập nhật khóa học
  const handleUpdateCourse = async () => {
    try {
      console.log(editCourse);
      await updateCourse(editCourse);

      fetchCourses(); // Load lại danh sách sau khi cập nhật
      setOpenEditDialog(false); // Đóng dialog sửa khóa học
      setEditCourse({ name: "", description: "", price: "" }); // Reset form
    } catch (error) {
      console.error("Error updating course", error);
    }
  };

  // Hàm xóa khóa học
  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteCourse(courseId);
      fetchCourses(); // Load lại danh sách sau khi xóa
    } catch (error) {
      console.error("Error deleting course", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("tags", tags.split(","));
    formData.append("teacherId", teacherId);
    formData.append("file", file);

    try {
      await createCourse(formData);
      setSnackSeverity("success");
      setSnackBarMessage("Course created successfully!");
      setSnackBarOpen(true);

      // Refresh lại danh sách khóa học sau khi tạo thành công
      fetchCourses();

      // Đóng dialog và reset các trường
      setOpenAddDialog(false);
      setName("");
      setDescription("");
      setPrice("");
      setTags("");
      setTeacherId("");
      setFile(null);
      setPreviewImage(null);
    } catch (error) {
      setSnackSeverity("error");
      setSnackBarMessage(
        error.response?.data?.message || "Failed to create course"
      );
      setSnackBarOpen(true);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Hiển thị ảnh xem trước
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewImage(objectUrl);
    }
  };

  return (
    <Scene>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Chiếm toàn bộ khung hình
          width: "100%",
        }}
      >
        <Card
          sx={{
            width: "95%",
            boxShadow: 3,
            borderRadius: 2,
            padding: 4,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            mb={4}
            textAlign={"center"}
            fontWeight="bold"
          >
            Quản lý khóa học
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenAddDialog(true)}
            sx={{ mb: 2, alignSelf: "end" }}
          >
            Thêm khóa học
          </Button>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên khóa học</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.description}</TableCell>
                    <TableCell>{course.price}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditCourseOpen(course)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteCourse(course.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Dialog Thêm khóa học */}
        <Dialog
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle variant="h7" textAlign={"center"}>Thêm khóa học</DialogTitle>
          <DialogContent>
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                maxWidth: "800px", // Tăng chiều rộng của form
                width: "100%",
                margin: "0 auto",
                padding: "20px", // Thêm khoảng cách xung quanh
              }}
              onSubmit={handleSubmit}
            >
              <TextField
                label="Course Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
                sx={{ fontSize: "1.25rem", padding: "10px" }} // Tăng kích thước
              />

              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                required
                multiline
                rows={4}
                sx={{ fontSize: "1.25rem", padding: "10px" }}
              />

              <TextField
                label="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
                required
                type="number"
                sx={{ fontSize: "1.25rem", padding: "10px" }}
              />

              <TextField
                label="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                fullWidth
                sx={{ fontSize: "1.25rem", padding: "10px" }}
              />

              <FormControl fullWidth required>
                <InputLabel id="teacher-select-label">
                  Select Teacher
                </InputLabel>
                <Select
                  labelId="teacher-select-label"
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  label="Select Teacher"
                >
                  {teachers.map((teacher) => (
                    <MenuItem key={teacher.profileId} value={teacher.profileId}>
                      {teacher.firstName} {teacher.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ fontSize: "1.25rem", padding: "5px", marginTop: "20px", fontWeight:"90%" }}
              >
                Upload Image
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
            </Box>
          </DialogContent>
          <DialogActions >
            <Button
             sx={{ fontSize: "1.25rem", paddingLeft:"30px", paddingRight:"30px"}} 
             color="error"
            onClick={() => setOpenAddDialog(false)}>Hủy</Button>
            <Button
              onClick={handleSubmit}
              color="primary"
              sx={{ fontSize: "1.25rem" }}
            >
              Create Course
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Sửa khóa học */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Sửa khóa học</DialogTitle>
          <DialogContent>
            <TextField
              label="Tên khóa học"
              fullWidth
              margin="normal"
              value={editCourse.name}
              onChange={(e) =>
                setEditCourse({ ...editCourse, name: e.target.value })
              }
            />
            <TextField
              label="Mô tả"
              fullWidth
              margin="normal"
              value={editCourse.description}
              onChange={(e) =>
                setEditCourse({ ...editCourse, description: e.target.value })
              }
            />
            <TextField
              label="Giá"
              fullWidth
              margin="normal"
              type="number"
              value={editCourse.price}
              onChange={(e) =>
                setEditCourse({ ...editCourse, price: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}  
            color="error">Hủy</Button>
            <Button onClick={handleUpdateCourse} color="primary">
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

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
    </Scene>
  );
}
