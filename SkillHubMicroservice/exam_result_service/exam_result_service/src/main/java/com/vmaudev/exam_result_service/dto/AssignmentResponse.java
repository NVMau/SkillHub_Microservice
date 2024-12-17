package com.vmaudev.exam_result_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentResponse {
    private String id;
    private String lectureId;
    private String title;
    private List<Question> questions;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Question {
        private String questionText;
        private List<String> options;
        private String correctAnswer;
    }
}
