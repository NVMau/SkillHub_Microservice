import React, { createContext, useState, useContext, useEffect } from 'react';

// Tạo context cho dark mode
const DarkModeContext = createContext();

// Hook để sử dụng context
export const useDarkMode = () => useContext(DarkModeContext);

// Provider để quản lý dark mode và lưu vào localStorage
export const DarkModeProvider = ({ children }) => {
  // Lấy trạng thái dark mode từ localStorage nếu có
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : false; // Mặc định là false (sáng)
  });

  // Mỗi khi darkMode thay đổi, lưu vào localStorage
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
