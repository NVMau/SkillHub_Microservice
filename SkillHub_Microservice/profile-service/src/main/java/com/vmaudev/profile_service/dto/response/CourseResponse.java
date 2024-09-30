package com.vmaudev.profile_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CourseResponse {
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private String imageUrl;
    private List<String> tags;
    private String teacherId;
}
