package com.vmaudev.chat_service.repository;

import com.vmaudev.chat_service.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findBySenderIdAndReceiverIdOrderByTimestampAsc(String senderId, String receiverId);
    List<Message> findByReceiverIdAndSenderIdOrderByTimestampAsc(String receiverId, String senderId);
}
