package com.vmaudev.enrollment_service.repository;

import com.vmaudev.enrollment_service.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment,Long> {
    List<Enrollment> findByStudentId(String studentId);

    List<Enrollment> findByCourseId(String courseId);
    // Tìm kiếm Enrollment theo studentId và courseId
    Optional<Enrollment> findByStudentIdAndCourseId(String studentId, String courseId);
    // Xóa tất cả các Enrollment theo studentId
    void deleteByStudentId(String studentId);
    void deleteByCourseId(String courseId);
    long countByCourseId(String courseId);
}
