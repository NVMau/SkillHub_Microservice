package com.vmaudev.blog_service.service;

import com.vmaudev.blog_service.dto.response.ProfileResponse;
import com.vmaudev.blog_service.model.Comment;
import com.vmaudev.blog_service.repository.CommentRepository;
import com.vmaudev.blog_service.repository.ProfileClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;


    private final ProfileClient profileClient;

    public CommentService(ProfileClient profileClient) {
        this.profileClient = profileClient;
    }


    // Thêm bình luận mới
    public Comment addComment(Comment comment) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String token = "";

        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
            token = "Bearer " + jwtAuth.getToken().getTokenValue();
        } else {
            throw new RuntimeException("Token không hợp lệ");
        }

        ProfileResponse profile = profileClient.getUserById(comment.getAuthorId(),token);
        comment.setAuthorName(profile.getFirstName());
        comment.setAuthorAvatar(profile.getAvatarUrl());
        comment.setCreatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    // Lấy bình luận theo PostId
    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }
}
