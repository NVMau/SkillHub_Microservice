package com.vmaudev.course_service.repository;


import com.vmaudev.course_service.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.Query;


import java.math.BigDecimal;
import java.util.List;

public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByNameContainingIgnoreCase(String name);

    List<Course> findByTeacherId(String teacherId);

    List<Course> findByDescriptionContainingIgnoreCase(String description);

    List<Course> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    // Tìm kiếm theo keyword và price range (không có teacherName)
    @Query("{'$and': [{'price': {$gte: ?1, $lte: ?2}}, {'$or': [{'name': {$regex: ?0, $options: 'i'}}, {'description': {$regex: ?0, $options: 'i'}}]}]}")
    List<Course> findCoursesWithoutTeacherId(String keyword, BigDecimal minPrice, BigDecimal maxPrice);

    // Tìm kiếm theo keyword, teacherId, và price range
    @Query("{'$and': [{'price': {$gte: ?2, $lte: ?3}}, {'teacherId': {$in: ?1}}, {'$or': [{'name': {$regex: ?0, $options: 'i'}}, {'description': {$regex: ?0, $options: 'i'}}]}]}")
    List<Course> findCoursesWithTeacherId(String keyword, List<String> teacherIds, BigDecimal minPrice, BigDecimal maxPrice);

    // Tìm kiếm chỉ theo keyword
    @Query("{'$or': [{'name': {$regex: ?0, $options: 'i'}}, {'description': {$regex: ?0, $options: 'i'}}]}")
    List<Course> findCoursesByKeyword(String keyword);

    @Query("{'$and': [{'teacherId': {$in: ?1}}, {'$or': [{'name': {$regex: ?0, $options: 'i'}}, {'description': {$regex: ?0, $options: 'i'}}]}]}")
    List<Course> findCoursesByTeacherIdOnly(String keyword, List<String> teacherIds);





}