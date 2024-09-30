package com.vmaudev.profile_service.repository;

import com.vmaudev.profile_service.dto.response.CourseResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "course-service", url = "${course.url}")
public interface CourseClient {

    @GetMapping("/api/courses/{id}")
    CourseResponse getCourseById(@PathVariable("id") String id, @RequestHeader("Authorization") String token);

    @GetMapping("/api/courses/teacher/{teacherId}")
    List<CourseResponse> getCoursesByTeacherId(@PathVariable("teacherId") String teacherId, @RequestHeader("Authorization") String token);



}
