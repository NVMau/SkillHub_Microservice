CREATE TABLE enrollments (
                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             student_id VARCHAR(255) NOT NULL,
                             course_id VARCHAR(255) NOT NULL,
                             enrollment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);