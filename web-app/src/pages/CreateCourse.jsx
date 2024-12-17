import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Scene from "./Scene";
import { getTeachers, createCourse } from "../services/courseService"; // Thay thế bằng courseService đã cấu hình sẵn
import useUserRoles from "../services/useUserRoles"; // Import custom hook
import { useProfile } from "../context/ProfileContext"; // Import useProfile



export default function CreateCourse() {
  const { profile, fetchProfile } = useProfile();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState([]); // Bắt đầu với một mảng rỗng
  const [teacherId, setTeacherId] = useState(""); // Lưu profileId thay vì userId
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // Để hiển thị ảnh xem trước
  const [teachers, setTeachers] = useState([]); // Lưu danh sách giáo viên
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState("info");
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const userRoles = useUserRoles();

  const handleCloseSnackBar = () => {
    setSnackBarOpen(false);
  };

  // Lấy danh sách giáo viên khi component được mount
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await getTeachers(); // Sử dụng service để lấy danh sách giáo viên
        setTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teachers", error);
      }
    };

    fetchTeachers();
  }, []);

  // Hiển thị ảnh xem trước khi người dùng chọn file ảnh
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Hiển thị ảnh xem trước
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewImage(objectUrl);
    }
  };

  const handleTagChange = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault(); // Ngăn không cho nhập thêm
      const newTag = e.target.value.trim();
      if (newTag) {
        setTags((prevTags) => [...prevTags, newTag]); // Thêm tag mới vào mảng
        e.target.value = ""; // Xóa trường nhập
      }
    }
  };
  const handleDeleteTag = (tagToDelete) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete)); // Xóa tag khỏi danh sách
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("tags", JSON.stringify(tags));
    formData.append("teacherId", teacherId || profile.profileId); // profileId của giáo viên được chọn
    formData.append("file", file);

    try {
      await createCourse(formData); // Gọi API tạo khóa học
      setSnackSeverity("success");
      setSnackBarMessage("Course created successfully!");
      setSnackBarOpen(true);
    } catch (error) {
      setSnackSeverity("error");
      setSnackBarMessage(
        error.response?.data?.message || "Failed to create course"
      );
      setSnackBarOpen(true);
    }
  };

  return (
    <Scene>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: 600,
          margin: "0 auto",
          backdropFilter: "blur(10px)", // Hiệu ứng mờ
          backgroundColor: "rgba(255, 255, 255, 0.15)", // Màu nền với độ trong suốt
          borderRadius: "15px", // Bo góc
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Đổ bóng nhẹ
          padding: "20px", // Khoảng cách padding
          width: "100%", // Chiều rộng full
        }}
        onSubmit={handleSubmit}
      >
        <Typography textAlign={"center"} variant="h4">
          TẠO KHÓA HỌC
        </Typography>

        <TextField
          label="Tên Khóa Học"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
        />

        <TextField
          label="Mô tả khóa học"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          required
          multiline
          rows={4}
        />

        <TextField
          label="Giá của khóa học"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
          required
          type="number"
        />

        <Box>
          <TextField
            label="Tags (nhấn Enter or comma để thêm)"
            onKeyDown={handleTagChange}
            fullWidth
          />
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              flexWrap: "wrap",
            }}
          >
            {tags.map((tag, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "2px",
                }}
              >
                <Typography variant="body2" sx={{ marginLeft: "8px" }}>
                  {tag}
                </Typography>
                <Button
                  variant="text"
                  color="error"
                  sx={{ minWidth: "24px", padding: "0 4px" }}
                  onClick={() => handleDeleteTag(tag)}
                >
                  X
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
        {/* Phần chọn giáo viên */}
        {userRoles.includes("ROLE_ADMIN") ? (
          <FormControl fullWidth required>
            <InputLabel id="teacher-select-label">Chọn giáo viên</InputLabel>
            <Select
              labelId="teacher-select-label"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)} // Cập nhật teacherId khi chọn giáo viên
              label="Select Teacher"
            >
              {teachers.map((teacher) => (
                <MenuItem key={teacher.profileId} value={teacher.profileId}>
                  {teacher.firstName} {teacher.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Typography>
            Giảng viên: {profile.firstName} {profile.lastName}
          </Typography>
        )}

        <Button variant="contained" component="label" fullWidth>
          Tải ảnh cho khóa học
          <input
            type="file"
            hidden
            onChange={handleFileChange} // Cập nhật file và hiển thị ảnh xem trước
          />
        </Button>

        {previewImage && (
          <Box
            component="img"
            src={previewImage}
            alt="Preview"
            sx={{ width: "100%", height: "auto", marginTop: "20px" }}
          />
        )}

        <Button variant="contained" color="primary" type="submit" fullWidth>
          Tạo khóa học
        </Button>
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
