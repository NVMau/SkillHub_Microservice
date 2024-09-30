
package com.vmaudev.lecture_service.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import com.vmaudev.lecture_service.model.Lecture;
public interface LectureRepository extends MongoRepository<Lecture, String> {
    List<Lecture> findByCourseIdOrderByIndexAsc(String courseId); // Tìm bài giảng theo courseId và sắp xếp theo index
    List<Lecture>  findByCourseId(String courseId); // T
    void deleteLectureByCourseId(String courseId);
}
