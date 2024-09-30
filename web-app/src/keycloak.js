import Keycloak from "keycloak-js";
import { KEYCLOAK_CONFIG } from "./configurations/configuration";

// Khởi tạo Keycloak instance
const keycloak = new Keycloak({
  url: KEYCLOAK_CONFIG.url,
  realm: KEYCLOAK_CONFIG.realm,
  clientId: KEYCLOAK_CONFIG.clientId,
});

// Lưu token và refresh token vào Keycloak object sau khi đăng nhập thành công
keycloak.onAuthSuccess = () => {
  console.log("Authenticated successfully!");
  localStorage.setItem("accessToken", keycloak.token);
  localStorage.setItem("refreshToken", keycloak.refreshToken);
};

export default keycloak;
