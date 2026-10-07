package com.ssis.academic.config;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@Component
public class GradingConfig {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class GradeRule {
        private String grade;
        private double minMarks;
        private double maxMarks;
        private double gradePoint;
        private String description;
    }

    public GradeRule evaluateGrade(double totalMarks) {
        if (totalMarks >= 90.0) {
            return new GradeRule("O", 90.0, 100.0, 10.0, "Outstanding");
        } else if (totalMarks >= 80.0) {
            return new GradeRule("A+", 80.0, 89.99, 9.0, "Excellent");
        } else if (totalMarks >= 70.0) {
            return new GradeRule("A", 70.0, 79.99, 8.0, "Very Good");
        } else if (totalMarks >= 60.0) {
            return new GradeRule("B+", 60.0, 69.99, 7.0, "Good");
        } else if (totalMarks >= 50.0) {
            return new GradeRule("B", 50.0, 59.99, 6.0, "Above Average");
        } else if (totalMarks >= 40.0) {
            return new GradeRule("C", 40.0, 49.99, 5.0, "Average");
        } else {
            return new GradeRule("F", 0.0, 39.99, 0.0, "Fail / Re-appear");
        }
    }
}
