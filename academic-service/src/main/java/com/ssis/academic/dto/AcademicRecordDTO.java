package com.ssis.academic.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademicRecordDTO {

    @NotBlank(message = "Record ID is required")
    private String recordId;

    @NotBlank(message = "Student ID is required")
    private String studentId;

    @NotBlank(message = "Course ID is required")
    private String courseId;

    @NotBlank(message = "Academic year is required (e.g. 2024-2025)")
    private String academicYear;

    @NotNull(message = "Semester is required")
    @Min(value = 1, message = "Semester must be at least 1")
    @Max(value = 12, message = "Semester cannot exceed 12")
    private Integer semester;

    @NotNull(message = "Internal marks are required")
    @Min(value = 0, message = "Internal marks cannot be negative")
    @Max(value = 40, message = "Internal marks cannot exceed 40")
    private Double internalMarks;

    @NotNull(message = "External marks are required")
    @Min(value = 0, message = "External marks cannot be negative")
    @Max(value = 60, message = "External marks cannot exceed 60")
    private Double externalMarks;

    @DecimalMin(value = "0.0", message = "Attendance cannot be negative")
    @DecimalMax(value = "100.0", message = "Attendance cannot exceed 100%")
    private Double attendancePercentage;

    private String remarks;
}
