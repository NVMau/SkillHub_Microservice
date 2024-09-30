import { useState, useEffect } from 'react';

// Hàm giải mã JWT token
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

// Custom hook để lấy userRoles từ accessToken
const useUserRoles = () => {
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = parseJwt(token);
      const roles = decodedToken?.realm_access?.roles || [];
      setUserRoles(roles);
    }
  }, []); // Chạy khi component mount

  return userRoles;
};

export default useUserRoles;
