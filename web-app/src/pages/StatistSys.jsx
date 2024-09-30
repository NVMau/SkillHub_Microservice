import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, Card, CardContent } from "@mui/material";
import { Pie, Bar } from "react-chartjs-2";
import { getAllUsersCount } from "../services/userService";
import { getAllCourseByTeacherId, getEnrollmentCountByCourseId } from "../services/courseService";
import Scene from "./Scene";

// Cấu hình Chart.js
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function StatistSys() {
  const [userStats, setUserStats] = useState({});
  const [courseStats, setCourseStats] = useState([]);

  // Gọi API lấy số lượng người dùng và khóa học
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await getAllUsersCount();  // Gọi API đếm người dùng
        setUserStats(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      }
    };

    const fetchCourseStats = async () => {
      try {
        const courseResponse = await getAllCourseByTeacherId(); // Lấy danh sách khóa học
        const courses = courseResponse.data;

        // Lấy số lượng đăng ký cho từng khóa học
        const enrollmentPromises = courses.map(async (course) => {
          const countResponse = await getEnrollmentCountByCourseId(course.id);
          return { courseName: course.name, count: countResponse.data };
        });

        const enrollmentData = await Promise.all(enrollmentPromises);
        setCourseStats(enrollmentData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu khóa học:", error);
      }
    };

    fetchUserStats();
    fetchCourseStats();
  }, []);

  // Dữ liệu biểu đồ tròn cho người dùng
  const userPieData = {
    labels: ["Student", "Admin", "Teacher"],
    datasets: [
      {
        data: [
          userStats["ROLE_STUDENT"] || 0,
          userStats["ROLE_ADMIN"] || 0,
          userStats["ROLE_TEACHER"] || 0,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  // Dữ liệu biểu đồ cột cho số lượng đăng ký khóa học
  const courseBarData = {
    labels: courseStats.map((course) => course.courseName),
    datasets: [
      {
        label: "Số lượng đăng ký",
        data: courseStats.map((course) => course.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Scene>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4"   mb={4} textAlign={"center"} fontWeight="bold" gutterBottom>
          Thống kê hệ thống
        </Typography>

        {/* Grid layout for the charts */}
        <Grid container spacing={3}>
          {/* Biểu đồ tròn thống kê người dùng */}
          <Grid item xs={12} md={6}>
            <Card sx={{ minHeight: 300 }}>
              <CardContent>
                <Typography variant="h6"  fontWeight="bold" mb={4}>Thống kê số lượng người dùng</Typography>
                <Pie data={userPieData} width={150} height={150} />
              </CardContent>
            </Card>
          </Grid>

          {/* Biểu đồ cột thống kê số lượng đăng ký khóa học */}
          <Grid item xs={12} md={6}>
            <Card sx={{ minHeight: 300 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={4} >Thống kê số lượng đăng ký khóa học</Typography>
                <Bar data={courseBarData} width={150} height={150} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Scene>
  );
}
