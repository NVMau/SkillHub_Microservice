package com.vmaudev.chat_service.controller;

import com.vmaudev.chat_service.model.Message;
import com.vmaudev.chat_service.repository.MessageRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

@RestController
public class MessageController {

    private final MessageRepository messageRepository;

    public MessageController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    // API lấy lịch sử tin nhắn giữa hai người dùng
    @GetMapping("/messages")
    public List<Message> getMessages(@RequestParam String senderId, @RequestParam String receiverId) {
        // Lấy tất cả các tin nhắn giữa hai người dùng
        List<Message> messagesSent = messageRepository.findBySenderIdAndReceiverIdOrderByTimestampAsc(senderId, receiverId);
        List<Message> messagesReceived = messageRepository.findByReceiverIdAndSenderIdOrderByTimestampAsc(senderId, receiverId);

        // Kết hợp và sắp xếp lại các tin nhắn theo thứ tự thời gian
        messagesSent.addAll(messagesReceived);
        messagesSent.sort(Comparator.comparing(Message::getTimestamp));

        return messagesSent;
    }
}
