import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',  // Màu chủ đạo của các nút và tiêu đề
    },
    background: {
      default: '#f5f5f5', // Màu nền chính
      paper: '#ffffff',   // Màu nền của các khối giấy như Card hoặc AppBar
    },
    text: {
      primary: '#000000',  // Màu chữ chính
      secondary: '#555555', // Màu chữ phụ
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',  // Tùy chỉnh font chữ
    fontSize: 14,  // Kích thước chữ
    h1: {
      fontSize: '2rem',  // Kích thước tiêu đề H1
      fontWeight: 'bold',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',  // Màu chủ đạo
    },
    background: {
      default: '#121212', // Màu nền của giao diện dark mode
      paper: '#1e1e1e',   // Màu nền của các khối giấy
    },
    text: {
      primary: '#ffffff',  // Màu chữ chính trong dark mode
      secondary: '#aaaaaa', // Màu chữ phụ
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    fontSize: 14,
    h1: {
      fontSize: '2rem',
      fontWeight: 'bold',
    },
  },
});
