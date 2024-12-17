import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";

// API để lấy tất cả bài viết
export const getAllPosts = async () => {
  return await httpClient.get(`${API.GET_ALL_POST}`);
};

// API để tạo bài viết mớis
export const createPost = async (formData) => {
  return await httpClient.post(`${API.CREATE_POST}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// API để lấy bình luận theo PostId
export const getCommentsByPostId = async (postId) => {
  return await httpClient.get(`${API.GET_COMMENTBYPOSTID}/${postId}`);
};

// API để thêm bình luận
export const addComment = async (comment) => {
  return await httpClient.post(`${API.ADD_COMMENT}`, comment);
};

// API để lấy các tương tác (like/dislike) theo PostId
export const getInteractionsByPostId = async (postId) => {
  return await httpClient.get(`${API.GET_INTERACTIONBYPOSTID}/${postId}`);
};

// API để thêm like/dislike
export const addInteraction = async (interaction) => {
  return await httpClient.post(`${API.ADD_INTERACTION}`, interaction);
};
// API để xóa bài viết
export const deletePost = async (postId) => {
  return await httpClient.delete(`${API.DELETE_POST}/${postId}`);
};