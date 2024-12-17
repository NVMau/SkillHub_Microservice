package com.vmaudev.exam_result_service.controller;

import com.vmaudev.exam_result_service.model.ExamResult;
import com.vmaudev.exam_result_service.service.ExamResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/exam-results")
@RequiredArgsConstructor
public class ExamResultController {

    private final ExamResultService examResultService;

    // API để tạo mới kết quả bài thi
    @PostMapping("/{assignmentId}/user/{userId}")
    public ResponseEntity<ExamResult> createExamResult(
            @PathVariable String assignmentId,
            @PathVariable String userId,
            @RequestBody Map<String, List<String>> answers) {
        List<String> userAnswers = answers.get("userAnswers");
        return ResponseEntity.ok(examResultService.createExamResult(assignmentId, userId, userAnswers));
    }

    // API để lấy tất cả kết quả của một người dùng
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ExamResult>> getExamResultsByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(examResultService.getExamResultsByUserId(userId));
    }

    // API để lấy tất cả kết quả của một bài tập
    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<ExamResult>> getExamResultsByAssignmentId(@PathVariable String assignmentId) {
        return ResponseEntity.ok(examResultService.getExamResultsByAssignmentId(assignmentId));
    }

    // API để lấy kết quả bài thi của một người dùng cho một bài tập cụ thể
    @GetMapping("/assignment/{assignmentId}/user/{userId}")
    public ResponseEntity<ExamResult> getExamResultByUserIdAndAssignmentId(
            @PathVariable String assignmentId,
            @PathVariable String userId) {
        ExamResult examResult = examResultService.getExamResultByUserIdAndAssignmentId(userId, assignmentId);
        if (examResult != null) {
            return ResponseEntity.ok(examResult);
        } else {
            return ResponseEntity.noContent().build(); // Nếu không có kết quả trả về HTTP 204 No Content
        }
    }
}
