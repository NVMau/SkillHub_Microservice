import React, { useState, createContext, useContext, useEffect } from 'react';
import { getMyProfile } from "../services/userService"; // Hàm lấy thông tin người dùng

// Tạo context
export const ProfileContext = createContext();

// Component quản lý context
export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await getMyProfile();
      setProfile(response.data); // Cập nhật profile khi nhận được từ API
    } catch (error) {
      console.error("Lỗi khi lấy profile", error);
    }
  };

  useEffect(() => {
    fetchProfile(); // Lấy thông tin profile khi component này được render lần đầu tiên
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Hook để sử dụng ProfileContext ở các component con
export const useProfile = () => useContext(ProfileContext);
