package com.vmaudev.enrollment_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ratings")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long enrollmentId;  // Liên kết đến Enrollment
    private String studentId;
    private String courseId;

    @Column(nullable = false)
    private int stars;  // Số sao, tối đa 5 sao

    private String comment;  // Bình luận (tùy chọn)

    private LocalDateTime ratedAt;
}
