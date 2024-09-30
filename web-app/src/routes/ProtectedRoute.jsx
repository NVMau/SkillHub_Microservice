import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import keycloak from "../keycloak"; // Import keycloak instance nếu cần

const ProtectedRoute = () => {
  const token = localStorage.getItem("accessToken");

  console.log("Access token in ProtectedRoute:", token);

  // Nếu có token trong localStorage, người dùng sẽ được phép truy cập vào Outlet (component con)
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;