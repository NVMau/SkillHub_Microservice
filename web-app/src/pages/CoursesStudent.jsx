import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Scene from "./Scene";
import {
  getRegisteredCourses,
} from "../services/userService";
import { useNavigate } from "react-router-dom";
import keycloak from "../keycloak"; // Import keycloak to get user roles
import Loading from '../components/Loading'; // Component Loading bạn vừa tạo

export default function CoursesStudent() {
  const [courses, setCourses] = useState([]);
  const [snackSeverity, setSnackSeverity] = useState("info");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate(); // Đặt useNavigate ở đây

  // Check user role from Keycloak
  const userRoles = keycloak.tokenParsed?.realm_access?.roles || [];

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  // Fetch courses based on the role of the user
  const fetchCourses = async () => {
    try {
      let response;
      response = await getRegisteredCourses(); // Call API for student's registered courses
      const data = response.data;
      setCourses(data);
      setIsLoading(false);
    } catch (error) {
      const errorResponse = error.response?.data;
      setSnackSeverity("error");
      setSnackBarMessage(errorResponse?.message ?? error.message);
      setSnackBarOpen(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Scene>
        <Box sx={{ width: "100%", gap: "10px" }}>
          {courses.map((course) => (
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
                sx={{ height: 200, objectFit: "cover" }}
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
                  onClick={() => navigate(`/lectures-student/${course.id}`)} // Điều hướng khi nhấn nút/ Điều hướng khi nhấn nút
                >
                  Xem khóa học
                </Button>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Scene>
    </>
  );
}