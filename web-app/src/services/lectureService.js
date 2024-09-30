import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";

// Lấy danh sách các bài giảng theo khóa học
export const getLecturesByCourseId = async (courseId) => {
  return await httpClient.get(`${API.GET_LECTURES_BY_COURSE}/${courseId}`);
};

// Thêm bài giảng mới
export const createLecture = async (formData) => {
  return await httpClient.post(API.CREATE_LECTURE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",  // Chỉ giữ lại Content-Type nếu cần
    },
  });
};
