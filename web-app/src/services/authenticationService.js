import keycloak from "../keycloak";

// Hàm đăng xuất
export const logOut = () => {
  // Xóa token khỏi localStorage (nếu bạn lưu trữ chúng)
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  
  // Thực hiện đăng xuất khỏi Keycloak
  keycloak.logout();
};