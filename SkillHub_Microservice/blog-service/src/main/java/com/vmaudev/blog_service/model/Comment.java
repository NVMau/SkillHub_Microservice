package com.vmaudev.blog_service.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "comments")
public class Comment {
    @Id
    private String commentId;
    private String postId; // Liên kết đến Post
    private String commentParent; // Comment cha nếu có (cấp 2)
    private String authorId;
    private String authorName; // Tên người dùng
    private String authorAvatar; // Avatar người dùng
    private String content;
    private LocalDateTime createdAt;
}
