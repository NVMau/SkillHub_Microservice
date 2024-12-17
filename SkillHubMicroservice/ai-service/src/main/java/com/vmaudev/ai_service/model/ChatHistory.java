package com.vmaudev.ai_service.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "chatHistory")
public class ChatHistory {
    @Id
    private String id;
    private String profileId;
    private String userMessage;
    private String gptResponse;
    private LocalDateTime timestamp;

    public ChatHistory(String profileId, String userMessage, String gptResponse) {
        this.profileId = profileId;
        this.userMessage = userMessage;
        this.gptResponse = gptResponse;
        this.timestamp = LocalDateTime.now();
    }
}
