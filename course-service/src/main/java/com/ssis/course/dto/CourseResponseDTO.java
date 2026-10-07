package com.ssis.course.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseResponseDTO {
    private String id;
    private String courseId;
    private String courseCode;
    private String courseName;
    private String description;
    private String department;
    private Integer credits;
    private Integer semester;
    private String facultyName;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
