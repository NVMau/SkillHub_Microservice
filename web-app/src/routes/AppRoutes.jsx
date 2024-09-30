import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Registration from "../pages/sign-in/Registration";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import CreateCourse from "../pages/CreateCourse";
import Profile from "../pages/Profile";
import CoursesTeacher from "../pages/CoursesTeacher";
import CoursesStudent from "../pages/CoursesStudent";
import LectureStudent from "../pages/LectureStudent";
import LectureTeacher from "../pages/LectureTeacher";
import SignIn from "../pages/sign-in/SignIn";
import UserManagement from "../pages/UserManagement";
import CourseManagement from "../pages/CourseManagement";
import StatistSys from "../pages/StatistSys";
import Blog from "../pages/Blog";
import ChatAI from "../pages/ChatAI";
import Chat from "../pages/Chat";
import TeacherStatistics from "../pages/TeacherStatistics";





const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/createCourses" element={<CreateCourse />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat-ai" element={<ChatAI />} />


        <Route path="/courses-teacher" element={<CoursesTeacher />} />
        <Route path="/courses-student" element={<CoursesStudent />} />
        <Route path="/lectures-student/:courseId" element={<LectureStudent />} />
        <Route path="/lectures-teacher/:courseId" element={<LectureTeacher />} />
        



        //role quản lý người dùng
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/course-management" element={<CourseManagement />} />
        <Route path="/statistics" element={<StatistSys />} />

        //Thống kê của giảng viên 
        <Route path="/teacher-statistics" element={<TeacherStatistics />} />


        <Route path="/blog" element={<Blog />} />
        <Route path="/chat" element={<Chat />} />





        {/* Bảo vệ các route sau khi đăng nhập */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
