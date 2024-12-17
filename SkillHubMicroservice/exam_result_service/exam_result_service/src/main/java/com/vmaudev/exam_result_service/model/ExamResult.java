package com.vmaudev.exam_result_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "exam_results")  // Tên collection trong MongoDB
public class ExamResult {

    @Id
    private String id;  // ID của kết quả bài thi
    private String userId;  // ID của người dùng
    private String assignmentId;  // ID của bài tập
    private List<QuestionResult> questionResults;  // Danh sách kết quả của từng câu hỏi
    private int score;  // Điểm số của người dùng

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class QuestionResult {
        private String questionText;  // Nội dung câu hỏi
        private String userAnswer;  // Câu trả lời của người dùng
        private String correctAnswer;  // Đáp án đúng
        private boolean isCorrect;  // Trạng thái đúng hay sai
    }
}
