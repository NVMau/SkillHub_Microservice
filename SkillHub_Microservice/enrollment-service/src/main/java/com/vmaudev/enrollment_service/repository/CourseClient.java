package com.vmaudev.enrollment_service.repository;

import com.vmaudev.enrollment_service.dto.CourseResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;


@FeignClient(name = "course-client", url = "${course.service.url}")
public interface CourseClient  {
    @GetMapping("/api/courses/{id}")
    CourseResponse getCourseById(@PathVariable("id") String id, @RequestHeader("Authorization") String token);
}

