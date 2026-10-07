package com.ssis.academic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentPerformanceDTO {
    private String studentId;
    private Integer totalCoursesCompleted;
    private Double averageMarks;
    private Double cumulativeGradePointAverage; // CGPA
    private String overallPerformanceGrade;
    private Double averageAttendance;
    private List<AcademicRecordResponseDTO> records;
}
