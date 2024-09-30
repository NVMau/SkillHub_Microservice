package com.vmaudev.blog_service.service;

import com.vmaudev.blog_service.configuration.S3Service;
import com.vmaudev.blog_service.model.Post;
import com.vmaudev.blog_service.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private S3Service s3Service;

    // Tạo bài viết mới với tùy chọn upload hình ảnh
    public Post createPost(Post post, MultipartFile image) throws IOException {
        post.setCreatedAt(LocalDateTime.now());

        // Nếu có ảnh, upload lên S3
        if (image != null && !image.isEmpty()) {
            String imageUrl = s3Service.uploadFile(image);
            post.setImageUrl(imageUrl);
        }

        return postRepository.save(post);
    }

    // Lấy tất cả các bài viết
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // Lấy bài viết theo ID
    public Optional<Post> getPostById(String postId) {
        return postRepository.findById(postId);
    }

    // Cập nhật bài viết
    public Post updatePost(String postId, Post post) {
        Optional<Post> existingPost = postRepository.findById(postId);
        if (existingPost.isPresent()) {
            Post updatedPost = existingPost.get();
            updatedPost.setTitle(post.getTitle());
            updatedPost.setContent(post.getContent());
            updatedPost.setUpdatedAt(LocalDateTime.now());
            return postRepository.save(updatedPost);
        }
        return null;
    }

    // Xóa bài viết
    public void deletePost(String postId) {
        postRepository.deleteById(postId);
    }
}
