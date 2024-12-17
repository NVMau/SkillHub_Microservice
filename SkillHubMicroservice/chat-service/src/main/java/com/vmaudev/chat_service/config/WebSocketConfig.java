package com.vmaudev.chat_service.config;

import com.vmaudev.chat_service.handler.MyWebSocketHandler;
import com.vmaudev.chat_service.repository.MessageRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final MessageRepository messageRepository;

    public WebSocketConfig(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new MyWebSocketHandler(messageRepository), "/chat")
                .setAllowedOrigins("*");
    }
}
