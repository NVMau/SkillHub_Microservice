package com.vmaudev.exam_result_service.repository;

import com.vmaudev.exam_result_service.dto.AssignmentResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "assignment-service", url = "${assignment.service.url}")
public interface AssignmentClient {

    // API gọi đến AssignmentService để lấy thông tin bài tập
    @GetMapping("/api/assignments/{assignmentId}")
    AssignmentResponse getAssignmentById(@PathVariable("assignmentId") String assignmentId);
}
