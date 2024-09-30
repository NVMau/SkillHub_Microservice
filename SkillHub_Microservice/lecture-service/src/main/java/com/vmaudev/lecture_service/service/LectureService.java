package com.vmaudev.lecture_service.service;

import com.vmaudev.course_service.event.CourseDeleteEvent;
import com.vmaudev.lecture_service.configuration.S3Service;
import com.vmaudev.lecture_service.event.LectureDeletedEvent;
import com.vmaudev.lecture_service.model.Lecture;
import com.vmaudev.lecture_service.repository.LectureRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Date;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LectureService {
    private final LectureRepository lectureRepository;
    private final S3Service s3Service;  // Inject S3Service
    private final KafkaTemplate<String, LectureDeletedEvent> kafkaTemplateDelete;




    public List<Lecture> getLecturesByCourseId(String courseId) {
        return lectureRepository.findByCourseIdOrderByIndexAsc(courseId);
    }

    public Lecture createLecture(Lecture lecture, MultipartFile file, List<MultipartFile> videoFiles) throws IOException {
        // Tìm bài giảng cuối cùng của khóa học để thiết lập index tiếp theo
        List<Lecture> lectures = lectureRepository.findByCourseIdOrderByIndexAsc(lecture.getCourseId());
        int nextIndex = lectures.isEmpty() ? 0 : lectures.get(lectures.size() - 1).getIndex() + 1;
        lecture.setIndex(nextIndex);

        // Tải file PDF/Word lên S3
        String fileUrl = s3Service.uploadFile(file);
        lecture.setFileUrl(fileUrl);

        // Tải các video lên S3 và lưu danh sách URL video
        List<String> videoUrls = videoFiles.stream()
                .map(video -> {
                    try {
                        return s3Service.uploadFile(video);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                })
                .toList();
        lecture.setVideoUrls(videoUrls);

        // Tạo mới
        lecture.setCreatedAt(new Date());
        lecture.setUpdatedAt(new Date());

        return lectureRepository.save(lecture);
    }

    @KafkaListener(topics = "course-deleted")
    @Transactional
    public void deleteLecturebyCouredDeleted(CourseDeleteEvent courseDeleteEvent) {
        String courseId = courseDeleteEvent.getCourseId().toString();
        List<Lecture> lectures = lectureRepository.findByCourseId(courseId);
        if (lectures != null && !lectures.isEmpty()) {
            List<CharSequence> lectureIds = lectures.stream()
                    .map(Lecture::getId)
                    .map(CharSequence.class::cast)
                    .collect(Collectors.toList());
            // Gửi sự kiện LectureDeletedEvent chứa các lectureId cần xóa
            LectureDeletedEvent lectureDeletedEvent = new LectureDeletedEvent(lectureIds);
            log.info("Start -Sending LectureDeletedEvent {} to Kafka topic lectures-deleted",lectureDeletedEvent);
            kafkaTemplateDelete.send("lectures-deleted", lectureDeletedEvent);
            log.info("End -Sending LectureDeletedEvent {} to Kafka topic lectures-deleted ",lectureDeletedEvent);
            // Thực hiện xóa
            log.info("Delete done for topc course-deleted!!");
            lectureRepository.deleteLectureByCourseId(courseId);
        } else {
            log.info("Không có bản ghi nào liên quan đến courseId này.");
        }
    }




    public void deleteLecture(String lectureId) {
        lectureRepository.deleteById(lectureId);
    }
}
