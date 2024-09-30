import {
  Alert,
  Box,
  Card,
  Snackbar,
  Typography,
  TextField,
  Button,
  Grid,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import Scene from "./Scene";
import { useEffect, useState } from "react";
import { getAllCourses, searchCourses } from "../services/courseService";
import { registerCourse } from "../services/registerService";
import { useProfile } from "../context/ProfileContext";

import LineItem from "../components/LineItem";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("info");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const { profile, fetchProfile } = useProfile();

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const getCourses = async () => {
    try {
      const response = await getAllCourses();
      setCourses(response.data);
    } catch (error) {
      const errorResponse = error.response?.data;
      setSnackSeverity("error");
      setSnackBarMessage(errorResponse?.message ?? error.message);
      setSnackBarOpen(true);
    }
  };

  // Hàm xử lý đăng kí khóa học
  const handleRegisterCourse = async (courseId) => {
    try {
      const studentId = profile.profileId; // ID sinh viên (có thể lấy từ session hoặc Keycloak token)
      await registerCourse({ studentId, courseId }); // Gọi API đăng ký khóa học
      setSnackSeverity("success");
      setSnackBarMessage("Đăng kí khóa học thành công!");
      setSnackBarOpen(true);
      await fetchProfile();
    } catch (error) {
      const errorResponse = error.response?.data;
      setSnackSeverity("error");
      console.log("errorResponse data:",error);

      // Kiểm tra xem lỗi có phải là do đã đăng ký khóa học trước đó
     
        setSnackBarMessage("Bạn đã đăng kí khóa học này rồi!")

      setSnackBarOpen(true);

    }
  };
  const handleSearch = async () => {
    try {
      const response = await searchCourses(
        searchKeyword,
        teacherName,
        minPrice,
        maxPrice
      );
      setCourses(response.data);

      console.log("Response data:", response.data); // In ra dữ liệu response
    } catch (error) {
      const errorResponse = error.response?.data;
      setSnackSeverity("error");
      setSnackBarMessage(errorResponse?.message ?? error.message);
      setSnackBarOpen(true);
    }
  };

  useEffect(() => {
    getCourses();
    fetchProfile();
  }, []);

  return (
    <>
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
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
      <Scene>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              backdropFilter: "blur(10px)", // Hiệu ứng mờ
              backgroundColor: "rgba(255, 255, 255, 0.15)", // Màu nền với độ trong suốt
              borderRadius: "15px", // Bo góc
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Đổ bóng nhẹ
              padding: "20px", // Khoảng cách padding
              width: "100%", // Chiều rộng full
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="Từ khóa tìm kiếm"
                  variant="outlined"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Giá từ"
                  variant="outlined"
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Giá đến"
                  variant="outlined"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                      label="Tên giáo viên"
                      variant="outlined"
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      fullWidth
                    />
              </Grid>
              <Grid item xs={1}>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  fullWidth // Nút tìm kiếm sẽ rộng bằng ô nhập
                  sx={{ height: "56px" }} // Để căn giữa nút với ô nhập liệu
                >
                  Tìm kiếm
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ width: "100%", gap: "10px" }}>
            {courses.map((course) => (
              // <Card
              //   key={course.id}
              //   sx={{
              //     margin: 2,
              //     minWidth: 350,
              //     boxShadow: 3,
              //     borderRadius: 2,
              //     padding: 4,
              //     mb: 2,
              //   }}
              // >
              //   <Typography variant="h6">{course.name}</Typography>
              //   <Typography variant="body2">{course.description}</Typography>
              //   <LineItem header={"Giá"} data={course.price}></LineItem>
              //   <LineItem header={"Giáo viên"} data={course.teacherId}></LineItem>
              // </Card>

              <Card
                key={course.id}
                sx={{
                  marginTop: 2,
                  minWidth: 350,
                  boxShadow: 3,
                  borderRadius: 2,
                  padding: 2,
                  mb: 2,
                }}
              >
                <CardMedia
                  sx={{ height: 350, objectFit: "cover" }}
                  component="img"
                  alt={course.name}
                  image={course.imageUrl}
                ></CardMedia>
                <CardContent>
                  <Typography gutterBottom variant="h4" component="div">
                    {course.name}
                  </Typography>
                  
                  <Typography gutterBottom variant="h7" component="div">
                    Giá: {course.price}đ
                  </Typography>
                  <Typography variant="h7" color="text.secondary">
                    {course.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleRegisterCourse(course.id)}
                  >
                    Đăng kí khóa học
                  </Button>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Box>
      </Scene>
    </>
  );
}
