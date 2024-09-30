import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, Card, CardContent } from "@mui/material";
import { Pie, Bar } from "react-chartjs-2";
import { getAllCourseByTeacherId, getEnrollmentCountByCourseId } from "../services/courseService";
import { getLecturesByCourseId } from "../services/lectureService";
import { useProfile } from "../context/ProfileContext";


import Scene from "./Scene";
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

export default function TeacherStatistics() {
  const [courseStats, setCourseStats] = useState([]);
  const [lectureStats, setLectureStats] = useState([]);
  const [enrollmentStats, setEnrollmentStats] = useState([]);
  const { profile } = useProfile();



  // Gọi API để lấy số liệu thống kê khóa học, bài giảng và học viên
  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Profile", profile)
        const courseResponse = await getAllCourseByTeacherId(profile.profileId); // Lấy danh sách khóa học của giáo viên
        const courses = courseResponse.data;
        console.log("Profile", courses)

        // Lấy số lượng bài giảng và học viên đăng ký cho từng khóa học
        const statsPromises = courses.map(async (course) => {
          const lectureResponse = await getLecturesByCourseId(course.id); // Lấy số lượng bài giảng
          const lectureCount = lectureResponse.data.length;

          const enrollmentResponse = await getEnrollmentCountByCourseId(course.id); // Lấy số lượng học viên đăng ký
          const enrollmentCount = enrollmentResponse.data;

          return {
            courseName: course.name,
            lectureCount: lectureCount,
            enrollmentCount: enrollmentCount,
          };
        });

        const statsData = await Promise.all(statsPromises);
        setCourseStats(statsData.map(stat => stat.courseName));
        setLectureStats(statsData.map(stat => stat.lectureCount));
        setEnrollmentStats(statsData.map(stat => stat.enrollmentCount));

      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchStats();
  }, [profile.profileId]);

  // Dữ liệu biểu đồ cột cho số lượng bài giảng theo khóa học
  const lectureBarData = {
    labels: courseStats,
    datasets: [
      {
        label: "Số lượng bài giảng",
        data: lectureStats,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Dữ liệu biểu đồ cột cho số lượng học viên đăng ký theo khóa học
  const enrollmentBarData = {
    labels: courseStats,
    datasets: [
      {
        label: "Số lượng học viên đăng ký",
        data: enrollmentStats,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Scene>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" mb={4} textAlign={"center"} fontWeight="bold" gutterBottom>
          Thống kê cho giáo viên
        </Typography>

        {/* Grid layout for the charts */}
        <Grid container spacing={3}>
          {/* Biểu đồ cột thống kê số lượng bài giảng theo khóa học */}
          <Grid item xs={12} md={6}>
            <Card sx={{ minHeight: 300 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={4}>Số lượng bài giảng theo khóa học</Typography>
                <Bar data={lectureBarData} width={150} height={150} />
              </CardContent>
            </Card>
          </Grid>

          {/* Biểu đồ cột thống kê số lượng học viên đăng ký theo khóa học */}
          <Grid item xs={12} md={6}>
            <Card sx={{ minHeight: 300 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={4}>Số lượng học viên đăng ký theo khóa học</Typography>
                <Bar data={enrollmentBarData} width={150} height={150} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Scene>
  );
}
