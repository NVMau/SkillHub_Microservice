import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";

// Hàm đăng ký khóa học
export const registerCourse = async (data) => {
  return await httpClient.post(API.REGISTER_COURSE, data, {
    headers: {
      "Content-Type": "application/json",  // Chỉ giữ lại Content-Type nếu cần
    },
  });
};
