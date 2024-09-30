import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";

// API để gửi tin nhắn đến AI
export const sendChatAi = async (userId, message) => {

    
  // Dữ liệu cần gửi đi
  const payload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
  };

  // Gửi request POST với userId và tin nhắn
  return await httpClient.post(`${API.SENDCHAT}?userId=${userId}`, payload);
};