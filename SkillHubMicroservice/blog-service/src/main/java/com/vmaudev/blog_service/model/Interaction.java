package com.vmaudev.blog_service.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "interactions")
public class Interaction {
    @Id
    private String interactionId;
    private String postId; // Có thể là bài viết hoặc bình luận
    private String userId;
    private String interactionType; // "like" hoặc "dislike"
}