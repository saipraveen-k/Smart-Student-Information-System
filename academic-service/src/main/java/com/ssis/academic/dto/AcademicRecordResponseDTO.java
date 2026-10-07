package com.ssis.academic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademicRecordResponseDTO {
    private String id;
    private String recordId;
    private String studentId;
    private String courseId;
    private String academicYear;
    private Integer semester;
    private Double internalMarks;
    private Double externalMarks;
    private Double totalMarks;
    private String grade;
    private Double gradePoint;
    private Double attendancePercentage;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
