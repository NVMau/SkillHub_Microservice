package com.vmaudev.course_service.service;

import com.vmaudev.course_service.configuration.S3Service;
import com.vmaudev.course_service.dto.CourseRequest;
import com.vmaudev.course_service.dto.CourseResponse;
import com.vmaudev.course_service.dto.response.ProfileResponse;
import com.vmaudev.course_service.event.CourseDeleteEvent;
import com.vmaudev.course_service.model.Course;
import com.vmaudev.course_service.repository.CourseRepository;
import com.vmaudev.course_service.repository.ProfileClient;
import com.vmaudev.profile_service.event.ProfileDeleteEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.context.SecurityContextHolder;


import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseService {
    private final CourseRepository courseRepository;
    private final S3Service s3Service;
    private final ProfileClient profileClient;
    private final KafkaTemplate<String, CourseDeleteEvent> kafkaTemplateDelete;

    public CourseResponse createCourse(CourseRequest courseRequest, MultipartFile file) throws IOException {
        String fileUrl = s3Service.uploadFile(file);  // Upload file lên S3 và lấy URL của file

        Course course = Course.builder()
                .name(courseRequest.getName())
                .description(courseRequest.getDescription())
                .price(courseRequest.getPrice())
                .category(courseRequest.getCategory())
                .imageUrl(fileUrl)  // Lưu URL file vào imageUrl
                .tags(courseRequest.getTags())
                .teacherId(courseRequest.getTeacherId())
                .build();

        course = courseRepository.save(course);
        log.info("Course created successfully");

        return mapToCourseResponse(course);
    }

    public List<CourseResponse> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::mapToCourseResponse)
                .collect(Collectors.toList());
    }

    public CourseResponse getCourseById(String id) {
        return courseRepository.findById(id)
                .map(this::mapToCourseResponse)
                .orElse(null);
    }

    public CourseResponse updateCourse(String id, CourseRequest courseRequest) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        course.setName(courseRequest.getName());
        course.setDescription(courseRequest.getDescription());
        course.setPrice(courseRequest.getPrice());
        course.setCategory(courseRequest.getCategory());
        course.setImageUrl(courseRequest.getImageUrl());
        course.setTags(courseRequest.getTags());
        course.setTeacherId(courseRequest.getTeacherId());

        course = courseRepository.save(course);
        log.info("Course updated successfully");

        return mapToCourseResponse(course);
    }

    public void deleteCourse(String id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with Id: " + id));
        CourseDeleteEvent courseDeleteEvent = new CourseDeleteEvent(id);
        courseDeleteEvent.setCourseId(id);
        log.info("Start -Sending CourseDeleteEvent {} to Kafka topic course-deleted",courseDeleteEvent);
        kafkaTemplateDelete.send("course-deleted", courseDeleteEvent);
        log.info("End -Sending CourseDeleteEvent {} to Kafka topic course-deleted ",courseDeleteEvent);
        courseRepository.deleteById(id);
        log.info("Course deleted successfully");
    }

    private CourseResponse mapToCourseResponse(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .name(course.getName())
                .description(course.getDescription())
                .price(course.getPrice())
                .category(course.getCategory())
                .imageUrl(course.getImageUrl())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .tags(course.getTags())
                .teacherId(course.getTeacherId())
                .build();
    }


    public List<Course> getCoursesByTeacherId(String teacherId) {
        return courseRepository.findByTeacherId(teacherId);
    }


    // Trong CourseService, lấy token từ SecurityContext
    public List<CourseResponse> searchCourses(String keyword, String teacherName, BigDecimal minPrice, BigDecimal maxPrice) {
        // Xử lý token từ Keycloak
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String token = "";

        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
            token = "Bearer " + jwtAuth.getToken().getTokenValue();
        } else {
            throw new RuntimeException("Token không hợp lệ");
        }

        // Tạo pattern cho keyword
        String keywordPattern = (keyword != null && !keyword.isEmpty()) ? keyword : ".*";

        // Danh sách teacherId
        List<String> teacherIds = new ArrayList<>();
        if (teacherName != null && !teacherName.isEmpty()) {
            List<ProfileResponse> teachers = profileClient.searchUsersByName(teacherName, token);
            if (teachers != null && !teachers.isEmpty()) {
                teacherIds = teachers.stream()
                        .map(ProfileResponse::getProfileId)
                        .collect(Collectors.toList());
            } else {
                // Nếu không tìm thấy giáo viên, trả về danh sách rỗng
                return new ArrayList<>();
            }
        }

        // Tìm kiếm theo các trường hợp
        if (!teacherIds.isEmpty() && minPrice != null && maxPrice != null) {
            // Tìm kiếm theo keyword, teacherId, và khoảng giá
            return courseRepository.findCoursesWithTeacherId(keywordPattern, teacherIds, minPrice, maxPrice)
                    .stream()
                    .map(this::mapToCourseResponse)
                    .collect(Collectors.toList());
        } else if (!teacherIds.isEmpty()) {
            // Tìm kiếm theo keyword và teacherId, không có khoảng giá
            return courseRepository.findCoursesByTeacherIdOnly(keywordPattern, teacherIds)
                    .stream()
                    .map(this::mapToCourseResponse)
                    .collect(Collectors.toList());

        }else if (minPrice != null && maxPrice != null) {
            // Tìm kiếm theo keyword và khoảng giá, không có teacherId
            return courseRepository.findCoursesWithoutTeacherId(keywordPattern, minPrice, maxPrice)
                    .stream()
                    .map(this::mapToCourseResponse)
                    .collect(Collectors.toList());
        } else if (!teacherIds.isEmpty()) {
            // Tìm kiếm theo keyword và teacherId, không có khoảng giá
            return courseRepository.findCoursesWithTeacherId(keywordPattern, teacherIds, null, null)
                    .stream()
                    .map(this::mapToCourseResponse)
                    .collect(Collectors.toList());
        } else {
            // Tìm kiếm chỉ theo keyword
            return courseRepository.findCoursesByKeyword(keywordPattern)
                    .stream()
                    .map(this::mapToCourseResponse)
                    .collect(Collectors.toList());
        }
    }

}
