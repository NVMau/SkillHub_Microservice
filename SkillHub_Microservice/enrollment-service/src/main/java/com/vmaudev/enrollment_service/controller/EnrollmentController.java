package com.vmaudev.enrollment_service.controller;

import com.vmaudev.enrollment_service.dto.EnrollmentRequest;
import com.vmaudev.enrollment_service.model.Enrollment;
import com.vmaudev.enrollment_service.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Enrollment createEnrollment(@RequestBody EnrollmentRequest enrollmentRequest) {
        try {
            return enrollmentService.createEnrollment(enrollmentRequest);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }



    @GetMapping
    public List<Enrollment> getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }

    @GetMapping("/{id}")
    public Optional<Enrollment> getEnrollmentById(@PathVariable Long id) {
        return enrollmentService.getEnrollmentById(id);
    }


    @PutMapping("/{id}")
    public Enrollment updateEnrollment(@PathVariable Long id, @RequestBody Enrollment enrollment) {
        return enrollmentService.updateEnrollment(id, enrollment);
    }

    @DeleteMapping("/{id}")
    public void deleteEnrollment(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
    }


    @GetMapping("/student/{studentId}")
    public List<Enrollment> getEnrollmentsByStudentId(@PathVariable String studentId) {
        return enrollmentService.getEnrollmentsByStudentId(studentId);
    }

    @GetMapping("/course/{courseId}/count")
    public ResponseEntity<Long> countEnrollmentsByCourseId(@PathVariable String courseId) {
        long count = enrollmentService.countEnrollmentsByCourseId(courseId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/course/{courseId}/students")
    public ResponseEntity<List<Enrollment>> getStudentsByCourseId(@PathVariable String courseId) {
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByCourseId(courseId);

        if (enrollments.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(enrollments, HttpStatus.OK);
    }

}
