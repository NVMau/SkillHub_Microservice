package com.vmaudev.ai_service.config;


import org.springframework.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.vmaudev.ai_service.dto.ChatRequest;
import com.vmaudev.ai_service.dto.ChatResponse;
import reactor.core.publisher.Mono;
import java.util.Objects;

@Service
public class OpenAiClient {

    private final WebClient webClient;

    public OpenAiClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @Value("${openai.api.key}")
    private String apiKey;

    public String sendMessage(ChatRequest chatRequest) {
        return webClient.post()
                .uri("https://api.openai.com/v1/chat/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .header(HttpHeaders.CONTENT_TYPE, "application/json")
                .bodyValue(chatRequest)
                .retrieve()
                .bodyToMono(ChatResponse.class)
                .map(response -> {
                    if (response != null && response.getChoices() != null && !response.getChoices().isEmpty()) {
                        // Truy cập content bên trong message của Choice
                        return response.getChoices().get(0).getMessage().getContent();
                    } else {
                        return "No response from OpenAI.";
                    }
                })
                .onErrorResume(e -> {
                    // Xử lý lỗi khác, ví dụ lỗi kết nối
                    return Mono.just("Error occurred while contacting OpenAI: " + e.getMessage());
                })
                .block();
    }
}
