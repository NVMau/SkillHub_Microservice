package com.vmaudev.blog_service.controller;

import com.vmaudev.blog_service.model.Comment;
import com.vmaudev.blog_service.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blog/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;

    // Thêm bình luận mới
    @PostMapping
    public ResponseEntity<Comment> addComment(@RequestBody Comment comment) {
        Comment createdComment = commentService.addComment(comment);
        return ResponseEntity.ok(createdComment);
    }

    // Lấy tất cả bình luận theo PostId
    @GetMapping("/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable String postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }
}
