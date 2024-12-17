package com.vmaudev.chat_service.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vmaudev.chat_service.model.Message;
import com.vmaudev.chat_service.repository.MessageRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class MyWebSocketHandler extends TextWebSocketHandler {

    private final MessageRepository messageRepository;
    private static final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    public MyWebSocketHandler(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String query = session.getUri().getQuery();
        String userId = getUserIdFromQuery(query); // Lấy userId từ query parameter

        if (userId != null) {
            sessions.put(userId, session);
            System.out.println("User " + userId + " connected");
        } else {
            System.out.println("User ID not found in query parameters");
        }
    }

    // Hàm để lấy userId từ query parameter
    private String getUserIdFromQuery(String query) {
        // Giả định query là dạng "userId=123"
        if (query != null && query.startsWith("userId=")) {
            return query.split("=")[1];
        }
        return null;
    }


    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonPayload = objectMapper.readTree(payload);

        String senderId = jsonPayload.get("senderId").asText();
        String receiverId = jsonPayload.get("receiverId").asText();
        String content = jsonPayload.get("content").asText();

        System.out.println("Message received from " + senderId + " to " + receiverId + ": " + content);

        // Lưu tin nhắn vào MongoDB
        Message chatMessage = new Message(senderId, receiverId, content);
        messageRepository.save(chatMessage);

        // Gửi tin nhắn cho người nhận nếu họ đang kết nối
        WebSocketSession receiverSession = sessions.get(receiverId);
        if (receiverSession != null && receiverSession.isOpen()) {
            System.out.println("Sending message to receiver " + receiverId);
            receiverSession.sendMessage(new TextMessage(payload)); // Gửi toàn bộ payload cho người nhận
        } else {
            System.out.println("Receiver " + receiverId + " is not connected");
        }

        // Gửi lại tin nhắn cho người gửi
        session.sendMessage(new TextMessage(payload)); // Gửi toàn bộ payload cho người gửi
    }



    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) throws Exception {
        // Xóa session khi người dùng ngắt kết nối
        String userId = (String) session.getAttributes().get("userId");
        if (userId != null) {
            sessions.remove(userId);
        }
    }
}
