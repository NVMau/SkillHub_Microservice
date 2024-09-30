package com.vmaudev.assignment_service.repository;

import com.vmaudev.assignment_service.model.Assignment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentRepository extends MongoRepository<Assignment, String> {
    // Tìm kiếm bài tập theo tiêu đề
    List<Assignment> findByTitleContaining(String title);

    // Tìm kiếm bài tập theo lectureId
    List<Assignment> findByLectureId(String lectureId);

    Optional<Assignment> findById(String id);
}
