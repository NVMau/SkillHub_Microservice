package com.vmaudev.enrollment_service.service;

import com.vmaudev.enrollment_service.model.Enrollment;
import com.vmaudev.enrollment_service.model.Rating;
import com.vmaudev.enrollment_service.repository.EnrollmentRepository;
import com.vmaudev.enrollment_service.repository.RatingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    // Hàm đánh giá khóa học
    public Rating rateCourse(String studentId, String courseId, Rating rating) {
        // Tìm Enrollment theo studentId và courseId
        log.info("End -Sending OrderPlaceEvent {} to Kafka topic order-placed ",studentId);
        log.info("End -Sending OrderPlaceEvent {} to Kafka topic order-placed ",courseId);
        log.info("End -Sending OrderPlaceEvent {} to Kafka topic order-placed ",rating.getComment());
        log.info("End -Sending OrderPlaceEvent {} to Kafka topic order-placed ",rating.getStars());

        Optional<Enrollment> enrollmentOpt = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId);
        if (enrollmentOpt.isEmpty()) {
            throw new RuntimeException("Sinh viên chưa tham gia khóa học này.");
        }
        // Kiểm tra xem người dùng đã đánh giá khóa học này chưa
        List<Rating> existingRatings = ratingRepository.findByStudentIdAndCourseId(studentId, courseId);
        if (!existingRatings.isEmpty()) {
            throw new RuntimeException("Bạn đã đánh giá khóa học này rồi.");
        }

        // Nếu có Enrollment, lưu đánh giá
        Enrollment enrollment = enrollmentOpt.get();
        rating.setEnrollmentId(enrollment.getId());
        rating.setStudentId(studentId);
        rating.setCourseId(courseId);
        rating.setRatedAt(LocalDateTime.now());

        return ratingRepository.save(rating);
    }

    // Lấy danh sách đánh giá cho khóa học
    public List<Rating> getRatingsByCourse(String courseId) {
        return ratingRepository.findByCourseId(courseId);
    }
    public Rating getRatingByCourseIdAndStudentId(String courseId, String studentId) {
        return ratingRepository.findByCourseIdAndStudentId(courseId, studentId);
    }
}
