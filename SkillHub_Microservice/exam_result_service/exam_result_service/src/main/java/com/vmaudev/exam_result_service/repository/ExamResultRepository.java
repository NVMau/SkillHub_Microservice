package com.vmaudev.exam_result_service.repository;

import com.vmaudev.exam_result_service.model.ExamResult;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamResultRepository extends MongoRepository<ExamResult, String> {
    List<ExamResult> findByUserId(String userId);
    List<ExamResult> findByAssignmentId(String assignmentId);

    // Truy vấn để tìm kết quả của một người dùng cho một bài tập cụ thể
    ExamResult findByUserIdAndAssignmentId(String userId, String assignmentId);
}
