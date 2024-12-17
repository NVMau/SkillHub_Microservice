package com.vmaudev.ai_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
public class ChatResponse {
    private List<Choice> choices;

    @Data
    public static class Choice {
        private Message message;
    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Message {
        private String role;
        private String content;
    }
}