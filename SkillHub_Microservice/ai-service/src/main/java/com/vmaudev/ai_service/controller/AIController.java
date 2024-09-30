package com.vmaudev.ai_service.controller;

import com.vmaudev.ai_service.dto.ChatRequest;
import com.vmaudev.ai_service.dto.response.ProfileResponse;
import com.vmaudev.ai_service.repository.ProfileClient;
import com.vmaudev.ai_service.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
public class AIController {

    private final ProfileClient profileClient;
    private final ChatService chatService;

    @PostMapping("/message")
    public ResponseEntity<?> sendMessage(@RequestParam String userId, @RequestBody ChatRequest chatRequest, @RequestHeader("Authorization") String token) {
        // Lấy thông tin người dùng từ profile-service
        ProfileResponse profile = profileClient.getUserById(userId, token);
        log.info("Start -Sending message for user {} to OpenAI", profile.getProfileId());

        // Gửi yêu cầu đến GPT qua ChatService
        String response = chatService.getChatResponseWithContext(profile, chatRequest.getMessages().get(0).getContent());

         //Lưu lịch sử tin nhắn vào MongoDB (bạn có thể kích hoạt lại dòng này nếu cần)
         chatService.saveChatHistory(profile, chatRequest.getMessages().get(0).getContent(), response);

        return ResponseEntity.ok(response);
    }
}
