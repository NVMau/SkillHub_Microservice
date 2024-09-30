package com.vmaudev.ai_service.service;

import com.vmaudev.ai_service.config.OpenAiClient;
import com.vmaudev.ai_service.dto.ChatRequest;
import com.vmaudev.ai_service.dto.response.ProfileResponse;
import com.vmaudev.ai_service.model.ChatHistory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    private final MongoTemplate mongoTemplate;
    private final OpenAiClient openAiClient;

    // Giả sử bạn lưu ngữ cảnh trong một Map hoặc một cơ sở dữ liệu
    private Map<String, String> userContext = new HashMap<>();

    public ChatService(MongoTemplate mongoTemplate, OpenAiClient openAiClient) {
        this.mongoTemplate = mongoTemplate;
        this.openAiClient = openAiClient;
    }

    public String getChatResponseWithContext(ProfileResponse profile, String userMessage) {
        String profileId = profile.getProfileId();

        // Lấy ngữ cảnh trước đó của người dùng (nếu có)
        String previousContext = userContext.getOrDefault(profileId, "");

        // Thêm thông điệp hệ thống để định nghĩa GPT là Skill Hub AI
        String systemMessageContent = "You are Skill Hub AI, a helpful assistant that provides information about the Skill Hub website and other related services.";

        // Tạo thông điệp hệ thống
        ChatRequest.Message systemMessage = new ChatRequest.Message("system", systemMessageContent);

        // Gộp ngữ cảnh trước đó với tin nhắn hiện tại
        String fullMessage = previousContext + "\n" + "User: " + userMessage;

        // Tạo tin nhắn của người dùng
        ChatRequest.Message userMessageObject = new ChatRequest.Message("user", fullMessage);

        // Tạo yêu cầu GPT với cả thông điệp hệ thống và tin nhắn người dùng
        ChatRequest gptRequest = new ChatRequest("gpt-3.5-turbo", List.of(systemMessage, userMessageObject));

        // Gửi yêu cầu và nhận phản hồi từ GPT
        String gptResponse = openAiClient.sendMessage(gptRequest);

        // Lưu lại ngữ cảnh mới cho người dùng
        userContext.put(profileId, fullMessage + "\nGPT: " + gptResponse);

        return gptResponse;
    }

    public void saveChatHistory(ProfileResponse profile, String userMessage, String gptResponse) {
        ChatHistory chatHistory = new ChatHistory(profile.getProfileId(), userMessage, gptResponse);
        mongoTemplate.save(chatHistory, "chatHistory");
    }
}

