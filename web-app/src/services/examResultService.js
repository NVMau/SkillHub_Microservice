import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";

// Lấy bài tập theo lectureId
export const getAssignmentsByLectureId = async (lectureId) => {
  return await httpClient.get(`${API.GET_ASSIGNMENTS_BY_LECTURE}/${lectureId}`);
};

// Gửi kết quả bài thi
export const submitExamResult = async (assignmentId, userId, resultPayload) => {
  return await httpClient.post(`${API.SUBMIT_EXAM_RESULT}/${assignmentId}/user/${userId}`, resultPayload, {
    headers: {
      "Content-Type": "application/json",  // Chỉ giữ lại Content-Type nếu cần
    },
  });
};

// Lấy kết quả bài thi theo lectureId
export const getExamResultByLectureId = async (assignmentId, userId) => {
  return await httpClient.get(`${API.GET_EXAMRESULT_BY_LECTURE}/${assignmentId}/user/${userId}`);
};
