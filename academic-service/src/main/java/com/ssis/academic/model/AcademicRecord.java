package com.ssis.academic.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "academic_records")
@CompoundIndexes({
    @CompoundIndex(name = "student_course_idx", def = "{'studentId': 1, 'courseId': 1, 'semester': 1}", unique = true)
})
public class AcademicRecord {

    @Id
    private String id;

    @Indexed(unique = true)
    private String recordId;

    @Indexed
    private String studentId;

    @Indexed
    private String courseId;

    private String academicYear;
    private Integer semester;

    private Double internalMarks; // Max 40
    private Double externalMarks; // Max 60
    private Double totalMarks;    // internal + external (Max 100)

    private String grade;         // O, A+, A, B+, B, C, F
    private Double gradePoint;    // 10, 9, 8, 7, 6, 5, 0
    private Double attendancePercentage;
    private String remarks;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
