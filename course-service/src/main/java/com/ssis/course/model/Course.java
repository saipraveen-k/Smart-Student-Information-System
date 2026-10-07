package com.ssis.course.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "courses")
public class Course {

    @Id
    private String id;

    @Indexed(unique = true)
    private String courseId;

    @Indexed(unique = true)
    private String courseCode;

    private String courseName;
    private String description;
    private String department;
    private Integer credits;
    private Integer semester;
    private String facultyName;
    private String status; // ACTIVE, INACTIVE, ARCHIVED

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
