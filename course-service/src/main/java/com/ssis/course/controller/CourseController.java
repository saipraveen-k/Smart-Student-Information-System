package com.ssis.course.controller;

import com.ssis.course.dto.ApiResponse;
import com.ssis.course.dto.CourseDTO;
import com.ssis.course.dto.CourseResponseDTO;
import com.ssis.course.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@Tag(name = "Course Management", description = "REST APIs for managing Course catalog in SSIS")
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    @Operation(summary = "Create a new course", description = "Adds a new course document into MongoDB catalog")
    public ResponseEntity<ApiResponse<CourseResponseDTO>> createCourse(@Valid @RequestBody CourseDTO courseDTO) {
        CourseResponseDTO created = courseService.createCourse(courseDTO);
        return new ResponseEntity<>(ApiResponse.success("Course created successfully", created), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all courses", description = "Retrieves all course catalog entries from MongoDB")
    public ResponseEntity<ApiResponse<List<CourseResponseDTO>>> getAllCourses() {
        List<CourseResponseDTO> courses = courseService.getAllCourses();
        return ResponseEntity.ok(ApiResponse.success("Courses retrieved successfully", courses));
    }

    @GetMapping("/{courseId}")
    @Operation(summary = "Get course by ID or Code", description = "Retrieves course details by course ID (e.g. C101) or course code (e.g. AI201)")
    public ResponseEntity<ApiResponse<CourseResponseDTO>> getCourseByCourseId(@PathVariable String courseId) {
        CourseResponseDTO course = courseService.getCourseByCourseId(courseId);
        return ResponseEntity.ok(ApiResponse.success("Course retrieved successfully", course));
    }

    @PutMapping("/{courseId}")
    @Operation(summary = "Update course", description = "Updates course information by course ID")
    public ResponseEntity<ApiResponse<CourseResponseDTO>> updateCourse(
            @PathVariable String courseId,
            @Valid @RequestBody CourseDTO courseDTO) {
        CourseResponseDTO updated = courseService.updateCourse(courseId, courseDTO);
        return ResponseEntity.ok(ApiResponse.success("Course updated successfully", updated));
    }

    @DeleteMapping("/{courseId}")
    @Operation(summary = "Delete course", description = "Removes a course from MongoDB by course ID")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable String courseId) {
        courseService.deleteCourse(courseId);
        return ResponseEntity.ok(ApiResponse.success("Course deleted successfully", null));
    }

    @GetMapping("/search")
    @Operation(summary = "Search courses", description = "Search course catalog by keyword across code, name, department, or faculty")
    public ResponseEntity<ApiResponse<List<CourseResponseDTO>>> searchCourses(@RequestParam(required = false) String keyword) {
        List<CourseResponseDTO> results = courseService.searchCourses(keyword);
        return ResponseEntity.ok(ApiResponse.success("Search completed", results));
    }

    @GetMapping("/department/{department}")
    @Operation(summary = "Get courses by department", description = "Filter course catalog by department")
    public ResponseEntity<ApiResponse<List<CourseResponseDTO>>> getCoursesByDepartment(@PathVariable String department) {
        List<CourseResponseDTO> results = courseService.getCoursesByDepartment(department);
        return ResponseEntity.ok(ApiResponse.success("Courses retrieved by department", results));
    }

    @PostMapping("/seed")
    @Operation(summary = "Seed demo courses", description = "Populates MongoDB with sample course catalog data if empty")
    public ResponseEntity<ApiResponse<String>> seedData() {
        courseService.seedDemoDataIfEmpty();
        return ResponseEntity.ok(ApiResponse.success("Demo course data seeded successfully", "OK"));
    }
}
