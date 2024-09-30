import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";

// Thêm bài tập mới
export const createRating = async (ratingData) => {
  return await httpClient.post(`${API.CREATE_RATING}`, ratingData, {
    headers: {
      "Content-Type": "application/json",  // Đảm bảo contentType phù hợp với payload bạn gửi
    },
  });
};

export const getRatingbyCourseAndUser = async (courseId, userId) => {
    return await httpClient.get(`${API.GET_RATING}/${courseId}/student/${userId}`);
  };