package com.vmaudev.blog_service.controller;

import com.vmaudev.blog_service.model.Interaction;
import com.vmaudev.blog_service.service.InteractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blog/interactions")
public class InteractionController {
    @Autowired
    private InteractionService interactionService;

    // Thêm tương tác mới (like/dislike)
    @PostMapping
    public ResponseEntity<Interaction> addInteraction(@RequestBody Interaction interaction) {
        Interaction createdInteraction = interactionService.addInteraction(interaction);
        return ResponseEntity.ok(createdInteraction);
    }

    // Lấy tất cả tương tác theo PostId
    @GetMapping("/{postId}")
    public ResponseEntity<List<Interaction>> getInteractionsByPostId(@PathVariable String postId) {
        return ResponseEntity.ok(interactionService.getInteractionsByPostId(postId));
    }
}
