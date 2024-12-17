
package com.vmaudev.profile_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentResponse {
    private String studentId;
    private String courseId;
    private String enrollmentDate;
}
