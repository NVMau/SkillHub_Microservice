import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  Typography,
  Avatar,
} from "@mui/material";
import Scene from "./Scene";
import { sendChatAi } from "../services/chatAIService";
import { useProfile } from "../context/ProfileContext"; // Lấy thông tin user profile

// Hình ảnh avatar GPT (bạn có thể thay thế bằng URL từ file bạn đã tải lên)
const gptAvatarUrl = "/logo/logo-ai.png";

export default function ChatAI() {
  const [inputMessage, setInputMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("info");
  const { profile } = useProfile(); // Lấy thông tin người dùng từ context

  const handleSendMessage = async () => {
    if (!inputMessage) return;
    

    // Thêm tin nhắn của người dùng vào chat history
    const userMessage = {
      role: "user",
      content: inputMessage,
      avatar: profile.avatarUrl,
    };
    setChatHistory((prevChatHistory) => [...prevChatHistory, userMessage]);

    try {
      // Gửi tin nhắn đến AI
      const response = await sendChatAi(profile.profileId, inputMessage);
      const gptResponse = response.data;

      // Thêm phản hồi của GPT vào chat history
      const assistantMessage = {
        role: "assistant",
        content: gptResponse,
        avatar: gptAvatarUrl,
      };
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        assistantMessage,
      ]);
    } catch (error) {
      setSnackBarMessage("Failed to send message. Please try again.");
      setSnackSeverity("error");
      setSnackBarOpen(true);
    }

    // Clear input field
    setInputMessage("");
  };

  const handleCloseSnackBar = () => {
    setSnackBarOpen(false);
  };

  return (
    <Scene>
      <Box
       display="flex"
        flexDirection="column" 
        alignItems="center" 
        mt={2}>
        <Typography fontWeight={"bold"} variant="h4" gutterBottom>
          SKILL-HUB-AI
        </Typography>

        <Box
          width="70vw"
          height="70vh"
          overflow="auto"
          bgcolor="rgba(255, 255, 255, 0.15)"
          p={2}
          borderRadius={2}
          boxShadow={2}
          mb={2}
        >
          {chatHistory.map((message, index) => (
            <Box
              key={index}
              display="flex"
              flexDirection={message.role === "user" ? "row-reverse" : "row"}
              alignItems="flex-start"
              mb={2}
            >
              {/* Avatar */}
              <Avatar
                alt={message.role === "user" ? "User Avatar" : "GPT Avatar"}
                src={message.avatar}
                sx={{
                  width: 40,
                  height: 40,
                  marginLeft: message.role === "user" ? 2 : 0,
                  marginRight: message.role === "assistant" ? 2 : 0,
                }}
              />
              {/* Nội dung tin nhắn */}
              <Box
                p={2}
                bgcolor={message.role === "user" ? "#cce7ff" : "#e0e0e0"}
                borderRadius={1}
                maxWidth="80%"
              >
                <Typography>{message.content}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box
          width="70vw"
          overflow="auto"
          bgcolor="rgba(255, 255, 255, 0.15)"

          p={2}
          borderRadius={2}
          boxShadow={2}
          mb={2}
        >
          <TextField
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            fullWidth
            placeholder="Nhập tin nhắn của bạn..."
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            disabled={!inputMessage}
            style={{ marginTop: 10 }}
          >
            Gửi
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={snackSeverity}
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </Scene>
  );
}
