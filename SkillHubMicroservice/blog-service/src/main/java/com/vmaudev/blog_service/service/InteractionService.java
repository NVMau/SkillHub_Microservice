
package com.vmaudev.blog_service.service;

import com.vmaudev.blog_service.model.Interaction;
import com.vmaudev.blog_service.repository.InteractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InteractionService {
    @Autowired
    private InteractionRepository interactionRepository;

    // Thêm tương tác mới
    public Interaction addInteraction(Interaction interaction) {
        return interactionRepository.save(interaction);
    }

    // Lấy tất cả tương tác của PostId
    public List<Interaction> getInteractionsByPostId(String postId) {
        return interactionRepository.findByPostId(postId);
    }
}
