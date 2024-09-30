import * as React from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ChatIcon from "@mui/icons-material/Chat";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import { useNavigate } from "react-router-dom";
import EqualizerIcon from '@mui/icons-material/Equalizer';
import useUserRoles from "../services/useUserRoles"; // Import custom hook
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ForumIcon from '@mui/icons-material/Forum';
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import PsychologyIcon from '@mui/icons-material/Psychology';

function SideMenu() {
  const navigate = useNavigate(); // Sử dụng useNavigate để lấy hàm điều hướng
  const userRoles = useUserRoles(); // Lấy userRoles từ custom hook

  const [openAdminMenu, setOpenAdminMenu] = React.useState(false);

  const handleAdminMenuClick = () => {
    setOpenAdminMenu(!openAdminMenu); // Đóng mở menu con khi nhấn nút
  };

  return (
    <>
      <Toolbar />
      <List>
        <ListItem key={"home"} disablePadding>
          <ListItemButton onClick={() => navigate("/")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Trang chủ "}
              primaryTypographyProps={{ style: { fontWeight: "bold" } }}
            />
          </ListItemButton>
        </ListItem>
        {userRoles.includes("ROLE_STUDENT") ? (
          <ListItem key={"courses-student"} disablePadding>
            <ListItemButton onClick={() => navigate("/courses-student")}>
              <ListItemIcon>
                <LocalLibraryIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Khóa học đã đăng kí"}
                primaryTypographyProps={{ style: { fontWeight: "bold" } }}
              />
            </ListItemButton>
          </ListItem>
        ) : null}

        {/* Hiển thị mục khóa học chỉ khi người dùng có ROLE_ADMIN hoặc ROLE_TEACHER */}
        {userRoles.includes("ROLE_ADMIN") ||
        userRoles.includes("ROLE_TEACHER") ? (
          <ListItem key={"createCourses"} disablePadding>
            <ListItemButton onClick={() => navigate("/createCourses")}>
              <ListItemIcon>
                <LocalLibraryIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Tạo khóa học"}
                primaryTypographyProps={{ style: { fontWeight: "bold" } }}
              />
            </ListItemButton>
          </ListItem>
        ) : null}

        {/* Hiển thị mục khóa học chỉ khi người dùng có ROLE_ADMIN hoặc ROLE_TEACHER */}
        {userRoles.includes("ROLE_ADMIN") ||
        userRoles.includes("ROLE_TEACHER") ? (
          <ListItem key={"courses-teacher"} disablePadding>
            <ListItemButton onClick={() => navigate("/courses-teacher")}>
              <ListItemIcon>
                <LocalLibraryIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Chỉnh sửa khóa học"}
                primaryTypographyProps={{ style: { fontWeight: "bold" } }}
              />
            </ListItemButton>
          </ListItem>
        ) : null}

        {/* Khóa học Item */}
        {/* <ListItem key={"baitap"} disablePadding> */}
          {/* <ListItemButton> */}
            {/* <ListItemIcon> */}
              {/* Khóa học icon */}
              {/* <AssignmentTurnedInIcon /> */}
            {/* </ListItemIcon> */}
            {/* <ListItemText */}
              {/* primary={"Bài Tập"} */}
              {/* primaryTypographyProps={{ style: { fontWeight: "bold" } }} */}
            {/* /> */}
          {/* </ListItemButton> */}
        {/* </ListItem> */}

        {/* Khóa học Item */}
        <ListItem key={"chat-ai"} disablePadding>
          <ListItemButton onClick={() => navigate("/chat-ai")}>
            <ListItemIcon>
              {/* Khóa học icon */}
              <PsychologyIcon />
            </ListItemIcon>
            <ListItemText
              primary={"SKILL-HUB-AI"}
              primaryTypographyProps={{ style: { fontWeight: "bold" } }}
            />
          </ListItemButton>
        </ListItem>


        {/* Khóa học Item */}
        <ListItem key={"chat"} disablePadding>
          <ListItemButton onClick={() => navigate("/chat")}>
            <ListItemIcon>
              {/* Khóa học icon */}
              <ChatIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Trò truyện trực tuyến"}
              primaryTypographyProps={{ style: { fontWeight: "bold" } }}
            />
          </ListItemButton>
        </ListItem>

        {/* Khóa học Item */}
        {userRoles.includes("ROLE_TEACHER") ? (
        <ListItem key={"thongke"} disablePadding>
          <ListItemButton onClick={() => navigate("/teacher-statistics")}>
            <ListItemIcon>
              {/* Khóa học icon */}
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Thống Kê"}
              primaryTypographyProps={{ style: { fontWeight: "bold" } }}
            />
          </ListItemButton>
        </ListItem>
         ) : null}

        <ListItem key={"blog"} disablePadding>
        <ListItemButton onClick={() => navigate("/blog")}>
            <ListItemIcon>
              {/* Khóa học icon */}
              <ForumIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Diễn đàn"}
              primaryTypographyProps={{ style: { fontWeight: "bold" } }}
            />
          </ListItemButton>
        </ListItem>


        {userRoles.includes("ROLE_ADMIN") ? (
          <ListItem key={"admin-menu"} disablePadding>
          <ListItemButton onClick={handleAdminMenuClick}>
            <ListItemIcon>
              <AdminPanelSettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Quản lý web"}
              primaryTypographyProps={{ style: { fontWeight: "bold" } }}
            />
            {openAdminMenu ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
          
        ) : null}

        {/* Quản lý web (nút chính) */}
        

        {/* Menu con của Quản lý web */}
        <Collapse in={openAdminMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 5 }}
              onClick={() => navigate("/user-management")}
            >
              <ListItemText
                primary={
                  <Typography style={{ fontWeight: "bold" }}>
                    Quản lý người dùng 
                  </Typography>
                }
              />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 5 }}
              onClick={() => navigate("/course-management")}
            >
              <ListItemText
                primary={
                  <Typography style={{ fontWeight: "bold" }}>
                    Quản lý khóa học
                  </Typography>
                }
              />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 5 }}
              onClick={() => navigate("/statistics")}
            >
              <ListItemText
                primary={
                  <Typography style={{ fontWeight: "bold" }}>
                    Thống kê hệ thống 
                  </Typography>
                }
              />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItem key={"profile"} disablePadding>
          <ListItemButton onClick={() => navigate("/profile")}>
            <ListItemIcon>
              <LocalLibraryIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Profile"}
              primaryTypographyProps={{ style: { fontWeight: "bold" } }}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
    </>
  );
}

export default SideMenu;
