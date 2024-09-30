import axios from "axios";

// Tạo một instance của axios
const httpClient = axios.create({
  baseURL: "http://localhost:9000",  // Thay đổi URL này thành base URL của bạn
});

// Lấy token từ localStorage
const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");

// Thêm token vào header của request
httpClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để tự động refresh token khi gặp lỗi 401
httpClient.interceptors.response.use(
  (response) => response, // Nếu response thành công, trả về response
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        try {
          // Gọi API refresh token
          const params = new URLSearchParams();
          params.append("grant_type", "refresh_token");
          params.append("client_id", "skillhub_app");
          params.append("refresh_token", refreshToken);

          const response = await axios.post(
            "http://localhost:8180/realms/vmaudev/protocol/openid-connect/token", 
            params
          );

          // Lưu token mới vào localStorage
          localStorage.setItem("accessToken", response.data.access_token);
          localStorage.setItem("refreshToken", response.data.refresh_token);

          // Cập nhật token vào request ban đầu và gửi lại request
          originalRequest.headers["Authorization"] = `Bearer ${response.data.access_token}`;
          return httpClient(originalRequest);
        } catch (err) {
          console.error("Refresh token failed", err);
          localStorage.clear(); // Xóa token khỏi localStorage nếu refresh thất bại
        }
      }
    }
    return Promise.reject(error);
  }
);

export default httpClient;
