package com.ssis.academic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerformanceOverviewDTO {
    private long totalRecords;
    private double systemAverageMarks;
    private double systemAverageGradePoint;
    private Map<String, Long> gradeDistribution;
    private Map<Integer, Double> semesterAveragePerformance;
}
