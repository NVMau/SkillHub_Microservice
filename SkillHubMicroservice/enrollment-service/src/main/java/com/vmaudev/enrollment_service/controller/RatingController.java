package com.vmaudev.enrollment_service.controller;

import com.vmaudev.enrollment_service.model.Rating;
import com.vmaudev.enrollment_service.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    // API đánh giá khóa học
    // Đánh giá khóa học dựa trên studentId và courseId
    @PostMapping("/rate")
    public ResponseEntity<Rating> rateCourse(@RequestBody Rating rating) {
        try {
            Rating savedRating = ratingService.rateCourse(rating.getStudentId(), rating.getCourseId(), rating);
            return ResponseEntity.ok(savedRating);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }


    // API lấy danh sách đánh giá cho khóa học
    @GetMapping("/courses/{courseId}/ratings")
    public ResponseEntity<List<Rating>> getRatingsByCourse(@PathVariable String courseId) {
        return ResponseEntity.ok(ratingService.getRatingsByCourse(courseId));
    }

    @GetMapping("/course/{courseId}/student/{studentId}")
    public ResponseEntity<Rating> getRatingByCourseIdAndStudentId(@PathVariable String courseId,@PathVariable String studentId) {
        return ResponseEntity.ok(ratingService.getRatingByCourseIdAndStudentId(courseId,studentId));
    }
}
