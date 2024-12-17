package com.vmaudev.assignment_service.model;

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
@Document(collection = "assignments")  // Tên collection trong MongoDB
public class Assignment {

    @Id
    private String id;  // ID của bài tập
    private String lectureId;  // ID của bài giảng
    private String title;  // Tiêu đề của bài tập
    private List<Question> questions;  // Danh sách các câu hỏi

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Question {
        private String questionText;  // Nội dung câu hỏi
        private List<String> options;  // Các lựa chọn
        private String correctAnswer;  // Đáp án đúng
    }
}
