package com.vmaudev.course_service.controller;
import com.vmaudev.course_service.dto.CourseRequest;
import com.vmaudev.course_service.dto.CourseResponse;
import com.vmaudev.course_service.model.Course;
import com.vmaudev.course_service.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping(consumes = {"multipart/form-data"})
    @ResponseStatus(HttpStatus.CREATED)
    public CourseResponse createCourse(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam("tags") List<String> tags,
            @RequestParam("teacherId") String teacherId,
            @RequestPart("file") MultipartFile file) throws IOException {

        CourseRequest courseRequest = CourseRequest.builder()
                .name(name)
                .description(description)
                .price(price)
                .tags(tags)
                .teacherId(teacherId)
                .build();

        return courseService.createCourse(courseRequest, file);
    }

    @GetMapping("/teacher/{teacherId}")
    public List<Course> getCoursesByTeacherId(@PathVariable String teacherId) {
        return courseService.getCoursesByTeacherId(teacherId);
    }


    @GetMapping
    public List<CourseResponse> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public CourseResponse getCourseById(@PathVariable String id) {
        return courseService.getCourseById(id);
    }

    @PutMapping("/{id}")
    public CourseResponse updateCourse(@PathVariable String id, @RequestBody CourseRequest courseRequest) {
        return courseService.updateCourse(id, courseRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable String id) {
        courseService.deleteCourse(id);
    }


    @GetMapping("/search")
    public List<CourseResponse> searchCourses(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String teacherName,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {

        // Kiểm tra nếu minPrice lớn hơn maxPrice, thì trả về lỗi hoặc xử lý phù hợp
        if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
            throw new IllegalArgumentException("Giá tối thiểu không thể lớn hơn giá tối đa");
        }

        // Gọi service để xử lý tìm kiếm
        return courseService.searchCourses(keyword, teacherName, minPrice, maxPrice);
    }

}
