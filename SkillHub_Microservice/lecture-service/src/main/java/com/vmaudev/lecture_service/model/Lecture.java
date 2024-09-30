package com.vmaudev.lecture_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "lectures")
public class Lecture {

    @Id
    private String id;
    private String courseId;
    private String title;
    private String content;
    private String fileUrl;       // URL chứa file PDF/Word
    private List<String> videoUrls;  // Danh sách các URL chứa video bài giảng
    private int index;  // Thứ tự của bài giảng trong khóa học

    @CreatedDate
    private Date createdAt;  // Ngày tạo

    @LastModifiedDate
    private Date updatedAt;  // Ngày chỉnh sửa lần cuối
}
