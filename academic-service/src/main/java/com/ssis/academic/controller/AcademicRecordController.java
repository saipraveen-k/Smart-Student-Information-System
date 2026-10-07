package com.ssis.academic.controller;

import com.ssis.academic.dto.*;
import com.ssis.academic.service.AcademicRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academic-records")
@RequiredArgsConstructor
@Tag(name = "Academic Record & Performance Management", description = "REST APIs for managing student marks, grades, and academic performance analytics")
public class AcademicRecordController {

    private final AcademicRecordService academicRecordService;

    @PostMapping
    @Operation(summary = "Create academic record", description = "Adds student internal/external marks and automatically computes total, grade, and grade point")
    public ResponseEntity<ApiResponse<AcademicRecordResponseDTO>> createAcademicRecord(@Valid @RequestBody AcademicRecordDTO dto) {
        AcademicRecordResponseDTO created = academicRecordService.createAcademicRecord(dto);
        return new ResponseEntity<>(ApiResponse.success("Academic record created successfully", created), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all academic records", description = "Retrieves all academic records stored in MongoDB")
    public ResponseEntity<ApiResponse<List<AcademicRecordResponseDTO>>> getAllAcademicRecords() {
        List<AcademicRecordResponseDTO> list = academicRecordService.getAllAcademicRecords();
        return ResponseEntity.ok(ApiResponse.success("Academic records retrieved successfully", list));
    }

    @GetMapping("/{recordId}")
    @Operation(summary = "Get academic record by Record ID", description = "Retrieves an academic record by its record ID (e.g. AR001)")
    public ResponseEntity<ApiResponse<AcademicRecordResponseDTO>> getAcademicRecordByRecordId(@PathVariable String recordId) {
        AcademicRecordResponseDTO record = academicRecordService.getAcademicRecordByRecordId(recordId);
        return ResponseEntity.ok(ApiResponse.success("Academic record retrieved successfully", record));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get academic records by Student ID", description = "Retrieves all course marks and grades for a specific student")
    public ResponseEntity<ApiResponse<List<AcademicRecordResponseDTO>>> getAcademicRecordsByStudentId(@PathVariable String studentId) {
        List<AcademicRecordResponseDTO> list = academicRecordService.getAcademicRecordsByStudentId(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student academic records retrieved successfully", list));
    }

    @GetMapping("/student/{studentId}/semester/{semester}")
    @Operation(summary = "Get academic records by Student ID and Semester", description = "Retrieves course marks for a specific student and semester")
    public ResponseEntity<ApiResponse<List<AcademicRecordResponseDTO>>> getAcademicRecordsByStudentIdAndSemester(
            @PathVariable String studentId,
            @PathVariable Integer semester) {
        List<AcademicRecordResponseDTO> list = academicRecordService.getAcademicRecordsByStudentIdAndSemester(studentId, semester);
        return ResponseEntity.ok(ApiResponse.success("Semester academic records retrieved successfully", list));
    }

    @GetMapping("/student/{studentId}/performance")
    @Operation(summary = "Calculate student overall performance", description = "Computes real-time average marks, CGPA, overall grade, and attendance metrics for a student")
    public ResponseEntity<ApiResponse<StudentPerformanceDTO>> calculateStudentPerformance(@PathVariable String studentId) {
        StudentPerformanceDTO performance = academicRecordService.calculateStudentPerformance(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student performance calculated successfully", performance));
    }

    @GetMapping("/analytics/overview")
    @Operation(summary = "Get system-wide academic analytics", description = "Returns global performance statistics, system average, grade distribution, and semester metrics")
    public ResponseEntity<ApiResponse<PerformanceOverviewDTO>> getSystemPerformanceOverview() {
        PerformanceOverviewDTO overview = academicRecordService.getSystemPerformanceOverview();
        return ResponseEntity.ok(ApiResponse.success("System performance overview retrieved successfully", overview));
    }

    @PutMapping("/{recordId}")
    @Operation(summary = "Update academic record", description = "Updates internal/external marks and re-computes grades dynamically")
    public ResponseEntity<ApiResponse<AcademicRecordResponseDTO>> updateAcademicRecord(
            @PathVariable String recordId,
            @Valid @RequestBody AcademicRecordDTO dto) {
        AcademicRecordResponseDTO updated = academicRecordService.updateAcademicRecord(recordId, dto);
        return ResponseEntity.ok(ApiResponse.success("Academic record updated successfully", updated));
    }

    @DeleteMapping("/{recordId}")
    @Operation(summary = "Delete academic record", description = "Deletes an academic record from MongoDB by record ID")
    public ResponseEntity<ApiResponse<Void>> deleteAcademicRecord(@PathVariable String recordId) {
        academicRecordService.deleteAcademicRecord(recordId);
        return ResponseEntity.ok(ApiResponse.success("Academic record deleted successfully", null));
    }

    @PostMapping("/seed")
    @Operation(summary = "Seed demo academic records", description = "Populates MongoDB with sample academic records if empty")
    public ResponseEntity<ApiResponse<String>> seedData() {
        academicRecordService.seedDemoDataIfEmpty();
        return ResponseEntity.ok(ApiResponse.success("Demo academic record data seeded successfully", "OK"));
    }
}
