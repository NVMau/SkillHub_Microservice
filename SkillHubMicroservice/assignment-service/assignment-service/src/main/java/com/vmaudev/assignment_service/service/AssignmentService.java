package com.vmaudev.assignment_service.service;

import com.vmaudev.assignment_service.event.AssignmentDeletedEvent;
import com.vmaudev.assignment_service.model.Assignment;
import com.vmaudev.assignment_service.repository.AssignmentRepository;
import com.vmaudev.lecture_service.event.LectureDeletedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final KafkaTemplate<String, AssignmentDeletedEvent> kafkaTemplateDelete;

    // Lưu bài tập mới
    public Assignment createAssignment(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    // Lấy danh sách tất cả bài tập
    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    // Tìm kiếm bài tập theo tiêu đề
    public List<Assignment> searchAssignments(String title) {
        return assignmentRepository.findByTitleContaining(title);
    }

    // Lấy danh sách bài tập theo lectureId
    public List<Assignment> getAssignmentsByLectureId(String lectureId) {
        return assignmentRepository.findByLectureId(lectureId);
    }
    public Assignment findAssignmentById(String id) {
        return assignmentRepository.findById(id).orElse(null);
    }

    // Xóa bài tập theo ID
    public void deleteAssignment(String id) {
        assignmentRepository.deleteById(id);
    }

    @KafkaListener(topics = "lectures-deleted")
    @Transactional
    public void handleLectureDeleted(LectureDeletedEvent event) {
        List<String> lectureIds = event.getLectureIds().stream()
                .map(CharSequence::toString)  // Chuyển đổi từ CharSequence thành String
                .collect(Collectors.toList());
        log.info("Received lecture-deleted event for lectures: {}", lectureIds);

        // Khởi tạo danh sách assignmentIds để chứa các ID của assignments bị xóa
        List<String> assignmentIds = new ArrayList<>();

        // Xóa tất cả assignment liên quan đến lectureId
        for (String lectureId : lectureIds) {
            List<Assignment> assignments = assignmentRepository.findByLectureId(lectureId);
            if (assignments != null && !assignments.isEmpty()) {
                log.info("Deleting assignments for lectureId: {}", lectureId);

                // Thêm assignmentIds vào danh sách để gửi sự kiện sau khi xóa
                assignmentIds.addAll(assignments.stream()
                        .map(Assignment::getId)
                        .collect(Collectors.toList()));

                // Thực hiện xóa các assignments
                assignmentRepository.deleteAll(assignments);
            } else {
                log.info("No assignments found for lectureId: {}", lectureId);
            }
        }

        // Nếu có assignmentIds, gửi sự kiện AssignmentDeletedEvent
        if (!assignmentIds.isEmpty()) {

            List<CharSequence> assignmentCharSeqIds = assignmentIds.stream()
                    .map(id -> (CharSequence) id)  // Ép kiểu sang CharSequence
                    .collect(Collectors.toList());
            AssignmentDeletedEvent assignmentDeletedEvent = new AssignmentDeletedEvent(assignmentCharSeqIds);
            log.info("Sending AssignmentDeletedEvent for deleted assignments: {}", assignmentIds);
            kafkaTemplateDelete.send("assignments-deleted", assignmentDeletedEvent);
            log.info(" End Sending AssignmentDeletedEvent for deleted assignments: {}", assignmentIds);
        }
    }
}
