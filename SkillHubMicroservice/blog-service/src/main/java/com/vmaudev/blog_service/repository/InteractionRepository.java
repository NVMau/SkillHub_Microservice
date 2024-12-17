package com.vmaudev.blog_service.repository;

import com.vmaudev.blog_service.model.Interaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InteractionRepository extends MongoRepository<Interaction, String> {
    List<Interaction> findByPostId(String postId);
}
