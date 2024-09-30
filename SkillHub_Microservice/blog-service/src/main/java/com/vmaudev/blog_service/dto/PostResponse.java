package com.vmaudev.blog_service.dto;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostResponse {
    private String postId;
    private String authorId;
    private String title;
    private String content;
    private String imageUrl;  // URL của ảnh được upload lên S3
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}