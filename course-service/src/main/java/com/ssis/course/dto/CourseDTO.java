package com.ssis.course.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDTO {

    @NotBlank(message = "Course ID is required")
    private String courseId;

    @NotBlank(message = "Course code is required (e.g. AI201, CS101)")
    private String courseCode;

    @NotBlank(message = "Course name is required")
    @Size(min = 3, max = 100, message = "Course name must be between 3 and 100 characters")
    private String courseName;

    private String description;

    @NotBlank(message = "Department is required")
    private String department;

    @NotNull(message = "Credits are required")
    @Min(value = 1, message = "Credits must be at least 1")
    @Max(value = 10, message = "Credits cannot exceed 10")
    private Integer credits;

    @NotNull(message = "Semester is required")
    @Min(value = 1, message = "Semester must be at least 1")
    @Max(value = 12, message = "Semester cannot exceed 12")
    private Integer semester;

    @NotBlank(message = "Faculty name is required")
    private String facultyName;

    @Pattern(regexp = "^(ACTIVE|INACTIVE|ARCHIVED)$", message = "Status must be ACTIVE, INACTIVE, or ARCHIVED")
    private String status;
}
