import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";

// Thêm bài tập mới
export const createAssignment = async (assignmentData) => {
  return await httpClient.post(`${API.CREATE_ASSIGNMENT}`, assignmentData, {
    headers: {
      "Content-Type": "application/json",  // Đảm bảo contentType phù hợp với payload bạn gửi
    },
  });
};

// API để lấy danh sách bài tập theo bài giảng
export const getAssignmentsByLectureId = async (lectureId) => {
  return await httpClient.get(`${API.GET_ASSIGNMENTS_BY_LECTURE}/${lectureId}`);
};
