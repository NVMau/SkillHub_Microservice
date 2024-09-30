import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";

// Hàm đăng ký người dùng mới
// Hàm đăng ký người dùng mới
export const register = async (data) => {
  return await httpClient.post(API.REGISTRATION, data, {
    headers: {
      "Content-Type": "application/json",  // Xác định kiểu dữ liệu là JSON
    },
  });
};

// Hàm lấy profile của người dùng hiện tại
export const getMyProfile = async () => {
  return await httpClient.get(API.MY_PROFILE);
};

// Hàm lấy các khóa học mà sinh viên đã đăng ký
export const getRegisteredCourses = async () => {
  return await httpClient.get(API.USERREGISTERCOURSE);
};

// Hàm lấy các khóa học mà giáo viên đang dạy
export const getTeachingCourses = async () => {
  return await httpClient.get(API.GET_TEACHERS_COURSES);
};

// Hàm lấy danh sách người dùng
export const getAllUsers = async () => {
  return await httpClient.get(API.GET_ALL_USERS);
};

// Hàm tạo người dùng mới
export const createUser = async (userData) => {
  return await httpClient.post(API.REGISTRATION, userData);
};

// Hàm cập nhật thông tin người dùng
export const updateUser = async (userData) => {
  return await httpClient.put(`${API.UPDATE_USER}/${userData.profileId}`, userData);
};

// Hàm xóa người dùng
export const deleteUser = async (userId) => {
  return await httpClient.delete(`${API.DELETE_USER}/${userId}`);
};

export const getAllUsersCount = async () => {
  return await httpClient.get(API.USER_COUNT_SYS);
};

export const updateAvatar = async (profileId, formData) => {
  return await httpClient.put(`${API.UPDATE_AVATAR}/${profileId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const updateUserProfile = async (profileData) => {
  return await httpClient.put(`${API.UPDATE_USER}/${profileData.profileId}`, profileData);
};

