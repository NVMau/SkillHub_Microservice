package com.vmaudev.enrollment_service.service;

import com.vmaudev.course_service.event.CourseDeleteEvent;
import com.vmaudev.enrollment_service.dto.CourseResponse;
import com.vmaudev.enrollment_service.dto.EnrollmentRequest;
import com.vmaudev.enrollment_service.dto.ProfileResponse;
import com.vmaudev.enrollment_service.event.OrderPlacedEvent;
import com.vmaudev.enrollment_service.model.Enrollment;
import com.vmaudev.enrollment_service.repository.CourseClient;
import com.vmaudev.enrollment_service.repository.EnrollmentRepository;
import com.vmaudev.enrollment_service.repository.ProfileClient;
import com.vmaudev.profile_service.event.ProfileDeleteEvent;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final KafkaTemplate<String,OrderPlacedEvent>kafkaTemplate;
    private final ProfileClient profileClient;
    private final CourseClient courseClient; // Inject ProfileServiceClient

    public Enrollment createEnrollment(EnrollmentRequest enrollmentRequest) {
        // Kiểm tra xem người dùng đã đăng ký khóa học này chưa
        Optional<Enrollment> existingEnrollment = enrollmentRepository
                .findByStudentIdAndCourseId(enrollmentRequest.getStudentId(), enrollmentRequest.getCourseId());
        // Nếu đã tồn tại, ném ra một ngoại lệ để ngăn người dùng đăng ký lại

        if (existingEnrollment.isPresent()) {
            throw new RuntimeException("Student has already enrolled in this course.");
        }


        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String token = "";


        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
            token = "Bearer " + jwtAuth.getToken().getTokenValue();
        } else {
            throw new RuntimeException("Token không hợp lệ");
        }

        // Lấy thông tin người dùng từ Profile Service
        ProfileResponse profile = profileClient.getUserById(enrollmentRequest.getStudentId(), token);
        CourseResponse course = courseClient.getCourseById(enrollmentRequest.getCourseId(),token);
        // Kiểm tra xem học sinh có đủ tiền để đăng ký khóa học hay không
        BigDecimal coursePrice = course.getPrice(); // Giá của khóa học
        BigDecimal studentBalance = profile.getCoin(); // Số tiền hiện tại của học sinh

        if (studentBalance.compareTo(coursePrice) < 0) {
            throw new RuntimeException("Không đủ tiền để đăng ký khóa học này.");
        }

        BigDecimal newBalance = studentBalance.subtract(coursePrice);
        profile.setCoin(newBalance);
        profileClient.updateUserProfile(profile.getProfileId(), profile,token);


        Enrollment enrollment = new Enrollment();
        enrollment.setStudentId(enrollmentRequest.getStudentId());
        enrollment.setCourseId(enrollmentRequest.getCourseId());
        enrollment.setEnrollmentDate(LocalDateTime.now()); // Gán ngày giờ hiện tại


        OrderPlacedEvent orderPlacedEvent = new OrderPlacedEvent();
        orderPlacedEvent.setCourseId(enrollment.getCourseId());
        orderPlacedEvent.setEmail(profile.getEmail());
        orderPlacedEvent.setLastName(profile.getLastName());
        orderPlacedEvent.setFirstName(profile.getFirstName());
        log.info("Start -Sending OrderPlaceEvent {} to Kafka topic order-placed ",orderPlacedEvent);
        kafkaTemplate.send("order-placed", orderPlacedEvent);
        log.info("End -Sending OrderPlaceEvent {} to Kafka topic order-placed ",orderPlacedEvent);

        return enrollmentRepository.save(enrollment);
        //Sent message to student to Kafka Topic



    }

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    public Optional<Enrollment> getEnrollmentById(Long id) {
        return enrollmentRepository.findById(id);
    }

    public Enrollment updateEnrollment(Long id, Enrollment updatedEnrollment) {
        return enrollmentRepository.findById(id)
                .map(enrollment -> {
                    enrollment.setStudentId(updatedEnrollment.getStudentId());
                    enrollment.setCourseId(updatedEnrollment.getCourseId());
                    enrollment.setEnrollmentDate(updatedEnrollment.getEnrollmentDate());
                    return enrollmentRepository.save(enrollment);
                })
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id " + id));
    }

    public void deleteEnrollment(Long id) {
        enrollmentRepository.deleteById(id);
    }


    public List<Enrollment> getEnrollmentsByStudentId(String studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }



    @KafkaListener(topics = "user-deleted")
    @Transactional
    public void handleProfileDelete(ProfileDeleteEvent profileDeleteEvent) {
        String profileId = profileDeleteEvent.getProfileId().toString();
        // Xóa dữ liệu liên quan đến profileId trong enrollment-service
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(profileId);
        if (enrollments != null && !enrollments.isEmpty()) {
            // Thực hiện xóa hoặc các hành động khác
            log.info("Delete done for topc user-deleted!!");
            enrollmentRepository.deleteByStudentId(profileId);
        } else {
            log.info("Không có bản ghi nào liên quan đến profileId này.");
        }
    }

    @KafkaListener(topics = "course-deleted")
    @Transactional
    public void handleCourseDelete(CourseDeleteEvent courseDeleteEvent) {
        String courseId = courseDeleteEvent.getCourseId().toString();
        // Xóa dữ liệu liên quan đến profileId trong enrollment-service
        List<Enrollment> enrollments = enrollmentRepository.findByCourseId(courseId);
        if (enrollments != null && !enrollments.isEmpty()) {
            // Thực hiện xóa hoặc các hành động khác
            log.info("Delete done for topc course-deleted!!");
            enrollmentRepository.deleteByCourseId(courseId);
        } else {
            log.info("Không có bản ghi nào liên quan đến courseId này.");
        }
    }

    // Đếm số lượng học sinh đã đăng ký theo courseId
    public long countEnrollmentsByCourseId(String courseId) {
        return enrollmentRepository.countByCourseId(courseId);
    }

    public List<Enrollment> getEnrollmentsByCourseId(String courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }

}


