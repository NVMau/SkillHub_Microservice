import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Paper,
  Typography,
} from "@mui/material";
import { getAllUsers } from "../services/userService"; // API lấy danh sách người dùng
import { useProfile } from "../context/ProfileContext";
import Scene from "./Scene"; // Lấy thông tin người dùng hiện tại

export default function Chat() {
  const { profile } = useProfile(); // Lấy thông tin user hiện tại từ context
  const [users, setUsers] = useState([]); // Danh sách người dùng
  const [filteredUsers, setFilteredUsers] = useState([]); // Danh sách người dùng sau khi lọc
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [selectedUser, setSelectedUser] = useState(null); // Người dùng được chọn để chat
  const [message, setMessage] = useState(""); // Nội dung tin nhắn
  const [messagesByUser, setMessagesByUser] = useState({}); // Lưu trữ tin nhắn theo từng profileId
  const webSocketRef = useRef(null); // Dùng để lưu kết nối WebSocket

  // Lấy danh sách người dùng khi component được mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data); // Lưu danh sách người dùng vào state
        setFilteredUsers(response.data); // Khởi tạo danh sách người dùng được lọc
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Cập nhật danh sách người dùng khi có từ khóa tìm kiếm
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(users); // Nếu không có từ khóa tìm kiếm, hiển thị tất cả người dùng
    } else {
      const filtered = users.filter((user) =>
        (user.fullName || `${user.firstName} ${user.lastName}`)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) // Lọc người dùng theo tên đầy đủ
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Tạo hàm gọi API lấy lịch sử tin nhắn
  const fetchMessageHistory = async (profileId) => {
    try {
      const response = await fetch(
        `http://localhost:8091/messages?senderId=${profile.profileId}&receiverId=${profileId}`
      );
      const data = await response.json();

      setMessagesByUser((prevMessages) => ({
        ...prevMessages,
        [profileId]: data, // Lưu lịch sử tin nhắn vào state
      }));
    } catch (error) {
      console.error("Error fetching message history:", error);
    }
  };

  // Khi người dùng được chọn, gọi API để lấy lịch sử chat
  const handleUserSelection = (user) => {
    setSelectedUser(user); // Chọn người dùng để chat
    fetchMessageHistory(user.profileId); // Gọi API để lấy lịch sử tin nhắn giữa hai người dùng
  };

  // Thiết lập WebSocket khi người dùng được chọn
  useEffect(() => {
    if (selectedUser && profile) {
      // Thêm profileId vào URL khi khởi tạo WebSocket
      webSocketRef.current = new WebSocket(
        `ws://localhost:8091/chat?profileId=${profile.profileId}`
      );

      webSocketRef.current.onopen = () => {
        console.log("WebSocket connected with profileId:", profile.profileId);
      };

      webSocketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received message:", data); // Log tin nhắn nhận được

          // Kiểm tra điều kiện nhận tin nhắn và cập nhật tin nhắn theo từng profileId
          if (
            (data.receiverId === profile.profileId &&
              data.senderId === selectedUser.profileId) ||
            (data.senderId === profile.profileId &&
              data.receiverId === selectedUser.profileId)
          ) {
            setMessagesByUser((prevMessages) => ({
              ...prevMessages,
              [selectedUser.profileId]: [
                ...(prevMessages[selectedUser.profileId] || []),
                data,
              ],
            }));
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      };

      webSocketRef.current.onerror = (error) => {
        console.error("WebSocket error", error);
      };

      webSocketRef.current.onclose = () => {
        console.log("WebSocket closed");
      };

      return () => {
        if (webSocketRef.current) {
          webSocketRef.current.close(); // Đóng WebSocket khi component bị unmount
        }
      };
    }
  }, [selectedUser, profile]);

  // Gửi tin nhắn qua WebSocket
  const sendMessage = () => {
    if (!selectedUser || message.trim() === "" || !profile) return; // Kiểm tra profile trước khi gửi tin nhắn

    const chatMessage = {
      senderId: profile.profileId, // Thông tin người gửi
      receiverId: selectedUser.profileId, // Thông tin người nhận
      content: message,
    };

    console.log("Sending message:", chatMessage); // Log khi gửi tin nhắn
    webSocketRef.current.send(JSON.stringify(chatMessage)); // Gửi tin nhắn qua WebSocket
    setMessage(""); // Clear input sau khi gửi
  };

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messagesByUser, selectedUser]); // Mỗi khi `messagesByUser` thay đổi, cuộn xuống cuối danh sách tin nhắn

  // Hiển thị loading hoặc thông báo nếu profile chưa sẵn sàng
  if (!profile) {
    return <Typography>Loading profile...</Typography>;
  }

  const currentMessages = messagesByUser[selectedUser?.profileId] || []; // Lấy tin nhắn của người dùng hiện tại

  return (
    <Scene>
      <Box display="flex" flexDirection="row" justifyContent="space-between" p={2}>
        {/* Danh sách người dùng */}
        <Paper elevation={3} sx={{ width: "30%", height: "80vh", overflowY: "auto" }}>
          <Typography variant="h6" align="center" p={2}>
            Danh sách người dùng
          </Typography>
          {/* Thanh tìm kiếm */}
          <TextField
            label="Tìm kiếm người dùng"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khóa tìm kiếm
            sx={{ mb: 2 }}
          />
          <List>
            {filteredUsers.map((user) => (
              <ListItem
                button
                key={user.profileId}
                selected={selectedUser && selectedUser.profileId === user.profileId}
                onClick={() => handleUserSelection(user)} // Chọn người dùng để chat
              >
                <Avatar src={user.avatarUrl || "/default-avatar.png"} />
                {/* Hiển thị tên đầy đủ của người dùng */}
                <ListItemText
                  primary={user.fullName || `${user.firstName} ${user.lastName}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Khu vực chat */}
        {selectedUser && (
          <Box flex="1" ml={2}>
            <Paper elevation={3} sx={{ height: "80vh", display: "flex", flexDirection: "column" }}>
              <Box flex="1" p={2} overflow="auto" id="message-container">
                <Typography variant="h6">
                  Đang nhắn với: {selectedUser.fullName || `${selectedUser.firstName} ${selectedUser.lastName}`}
                </Typography>
                <List sx={{ maxHeight: "70vh", overflowY: "auto" }}>
                  {currentMessages.map((msg, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent:
                          msg.senderId === profile.profileId ? "flex-end" : "flex-start",
                      }}
                    >
                      <ListItemText
                        primary={msg.content}
                        secondary={
                          msg.senderId === profile.profileId
                            ? "Bạn"
                            : selectedUser.fullName || `${selectedUser.firstName} ${selectedUser.lastName}`
                        }
                        sx={{
                          backgroundColor:
                            msg.senderId === profile.profileId ? "#cfe8fc" : "#f1f0f0",
                          padding: "10px",
                          borderRadius: "10px",
                          maxWidth: "60%",
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box p={2} display="flex">
                <TextField
                  label="Nhập tin nhắn"
                  variant="outlined"
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={sendMessage}
                  sx={{ ml: 2 }}
                >
                  Gửi
                </Button>
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </Scene>
  );
}
