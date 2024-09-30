package com.vmaudev.exam_result_service.service;

import com.vmaudev.assignment_service.event.AssignmentDeletedEvent;
import com.vmaudev.exam_result_service.repository.AssignmentClient;
import com.vmaudev.exam_result_service.dto.AssignmentResponse;
import com.vmaudev.exam_result_service.model.ExamResult;
import com.vmaudev.exam_result_service.repository.ExamResultRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExamResultService {

    private final ExamResultRepository examResultRepository;
    private final AssignmentClient assignmentClient; // Gọi đến AssignmentService

    // Tạo mới kết quả bài thi
    public ExamResult createExamResult(String assignmentId, String userId, List<String> userAnswers) {
        // Gọi AssignmentService thông qua FeignClient
        AssignmentResponse assignment = assignmentClient.getAssignmentById(assignmentId);

        // Tạo danh sách kết quả từng câu hỏi
        List<ExamResult.QuestionResult> questionResults = assignment.getQuestions().stream()
                .map(question -> {
                    String userAnswer = userAnswers.get(assignment.getQuestions().indexOf(question));
                    boolean isCorrect = userAnswer.equals(question.getCorrectAnswer());
                    return ExamResult.QuestionResult.builder()
                            .questionText(question.getQuestionText())
                            .userAnswer(userAnswer)
                            .correctAnswer(question.getCorrectAnswer())
                            .isCorrect(isCorrect)
                            .build();
                })
                .collect(Collectors.toList());

        // Tính tổng điểm
        int score = (int) questionResults.stream().filter(ExamResult.QuestionResult::isCorrect).count();

        // Lưu kết quả bài thi
        ExamResult examResult = ExamResult.builder()
                .userId(userId)
                .assignmentId(assignmentId)
                .questionResults(questionResults)
                .score(score)
                .build();

        return examResultRepository.save(examResult);
    }

    // Lấy tất cả kết quả của người dùng
    public List<ExamResult> getExamResultsByUserId(String userId) {
        return examResultRepository.findByUserId(userId);
    }

    // Lấy tất cả kết quả của bài tập
    public List<ExamResult> getExamResultsByAssignmentId(String assignmentId) {
        return examResultRepository.findByAssignmentId(assignmentId);
    }
    // Lấy kết quả của một người dùng cho một bài tập cụ thể
    public ExamResult getExamResultByUserIdAndAssignmentId(String userId, String assignmentId) {
        return examResultRepository.findByUserIdAndAssignmentId(userId, assignmentId);
    }

    @KafkaListener(topics = "assignments-deleted")
    @Transactional
    public void handleLectureDeleted(AssignmentDeletedEvent event) {
        // Chuyển danh sách lectureId từ CharSequence sang String
        List<String> assignmentIds = event.getAssignmentIds().stream()
                .map(CharSequence::toString)
                .collect(Collectors.toList());

        log.info("Nhận được sự kiện lectures-deleted với lectureIds: {}", assignmentIds);

        // Xóa tất cả exam result liên quan đến lectureId
        for (String assignmentId : assignmentIds) {
            List<ExamResult> examResults = examResultRepository.findByAssignmentId(assignmentId);
            if (examResults != null && !examResults.isEmpty()) {
                log.info("Xóa các kết quả thi liên quan đến lectureId: {}", assignmentId);
                examResultRepository.deleteAll(examResults);
            } else {
                log.info("Không có kết quả thi nào liên quan đến lectureId: {}", assignmentId);
            }
        }
    }
}

