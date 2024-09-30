import { useEffect } from "react";
import { CssBaseline } from "@mui/material";
import AppRoutes from "./routes/AppRoutes";
import keycloak from "./keycloak"; // Nhập keycloak instance từ file keycloak của bạn
import { useDarkMode } from './DarkModeContext';
import { lightTheme, darkTheme } from './theme';
import { ThemeProvider } from '@mui/material/styles';
import { ProfileProvider } from './context/ProfileContext';

function App() {
  const { darkMode } = useDarkMode();
  // Hàm để kiểm tra và cập nhật token khi ứng dụng khởi động
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (token && refreshToken) {
      console.log("Token và refresh token có sẵn trong localStorage");
      // Nếu cần, bạn có thể làm mới token tại đây
      // Hoặc gán token vào keycloak instance
      keycloak.token = token;
      keycloak.refreshToken = refreshToken;
    } else {
      console.log("Chưa có token, yêu cầu người dùng đăng nhập lại");
      // Bạn có thể yêu cầu người dùng đăng nhập lại ở đây nếu không có token
    }
  }, []);

  return (
    <>
    <ProfileProvider>

    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </ProfileProvider>
      
    </>
  );
}

export default App;
