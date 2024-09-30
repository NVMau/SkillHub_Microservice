package com.vmaudev.enrollment_service.repository;

import com.vmaudev.enrollment_service.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByCourseId(String courseId);
    List<Rating> findByEnrollmentId(Long enrollmentId);
    List<Rating> findByStudentIdAndCourseId(String studentId, String courseId);
    Rating findByCourseIdAndStudentId(String course,String studentId);
}
