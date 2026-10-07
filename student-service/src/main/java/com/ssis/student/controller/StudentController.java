package com.ssis.student.controller;

import com.ssis.student.dto.ApiResponse;
import com.ssis.student.dto.StudentDTO;
import com.ssis.student.dto.StudentResponseDTO;
import com.ssis.student.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@Tag(name = "Student Management", description = "REST APIs for managing Student records in SSIS")
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    @Operation(summary = "Create a new student", description = "Creates a new student document in MongoDB after validation")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> createStudent(@Valid @RequestBody StudentDTO studentDTO) {
        StudentResponseDTO created = studentService.createStudent(studentDTO);
        return new ResponseEntity<>(ApiResponse.success("Student created successfully", created), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all students", description = "Retrieves all students stored in MongoDB")
    public ResponseEntity<ApiResponse<List<StudentResponseDTO>>> getAllStudents() {
        List<StudentResponseDTO> students = studentService.getAllStudents();
        return ResponseEntity.ok(ApiResponse.success("Students retrieved successfully", students));
    }

    @GetMapping("/{studentId}")
    @Operation(summary = "Get student by Student ID", description = "Retrieves a student by their unique student ID (e.g., STU001)")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> getStudentByStudentId(@PathVariable String studentId) {
        StudentResponseDTO student = studentService.getStudentByStudentId(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student retrieved successfully", student));
    }

    @PutMapping("/{studentId}")
    @Operation(summary = "Update student", description = "Updates an existing student by student ID")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> updateStudent(
            @PathVariable String studentId,
            @Valid @RequestBody StudentDTO studentDTO) {
        StudentResponseDTO updated = studentService.updateStudent(studentId, studentDTO);
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", updated));
    }

    @DeleteMapping("/{studentId}")
    @Operation(summary = "Delete student", description = "Deletes a student record from MongoDB by student ID")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable String studentId) {
        studentService.deleteStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully", null));
    }

    @GetMapping("/search")
    @Operation(summary = "Search students", description = "Search students by keyword across name, student ID, email, or department")
    public ResponseEntity<ApiResponse<List<StudentResponseDTO>>> searchStudents(@RequestParam(required = false) String keyword) {
        List<StudentResponseDTO> results = studentService.searchStudents(keyword);
        return ResponseEntity.ok(ApiResponse.success("Search completed", results));
    }

    @GetMapping("/department/{department}")
    @Operation(summary = "Get students by department", description = "Filter students by department code (e.g. AIML, CSE, ECE)")
    public ResponseEntity<ApiResponse<List<StudentResponseDTO>>> getStudentsByDepartment(@PathVariable String department) {
        List<StudentResponseDTO> results = studentService.getStudentsByDepartment(department);
        return ResponseEntity.ok(ApiResponse.success("Students retrieved by department", results));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get students by status", description = "Filter students by status (ACTIVE, INACTIVE, GRADUATED, SUSPENDED)")
    public ResponseEntity<ApiResponse<List<StudentResponseDTO>>> getStudentsByStatus(@PathVariable String status) {
        List<StudentResponseDTO> results = studentService.getStudentsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Students retrieved by status", results));
    }

    @PostMapping("/seed")
    @Operation(summary = "Seed demo data", description = "Populates MongoDB with sample student data if empty")
    public ResponseEntity<ApiResponse<String>> seedData() {
        studentService.seedDemoDataIfEmpty();
        return ResponseEntity.ok(ApiResponse.success("Demo student data seeded successfully", "OK"));
    }
}
