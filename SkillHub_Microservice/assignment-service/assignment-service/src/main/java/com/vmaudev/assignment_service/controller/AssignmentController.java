package com.vmaudev.assignment_service.controller;

import com.vmaudev.assignment_service.model.Assignment;
import com.vmaudev.assignment_service.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    // API để tạo bài tập mới
    @PostMapping
    public ResponseEntity<Assignment> createAssignment(@RequestBody Assignment assignment) {
        return ResponseEntity.ok(assignmentService.createAssignment(assignment));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Assignment> getAssignmentById(@PathVariable String id) {
        Assignment assignment = assignmentService.findAssignmentById(id);
        if (assignment != null) {
            return ResponseEntity.ok(assignment);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // API để lấy danh sách tất cả các bài tập
    @GetMapping
    public ResponseEntity<List<Assignment>> getAllAssignments() {
        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }

    // API để tìm kiếm bài tập theo tiêu đề
    @GetMapping("/search")
    public ResponseEntity<List<Assignment>> searchAssignments(@RequestParam String title) {
        return ResponseEntity.ok(assignmentService.searchAssignments(title));
    }

    // API để lấy danh sách bài tập theo lectureId
    @GetMapping("/lecture/{lectureId}")
    public ResponseEntity<List<Assignment>> getAssignmentsByLectureId(@PathVariable String lectureId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByLectureId(lectureId));
    }

    // API để xóa bài tập theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable String id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.ok().build();
    }
}
