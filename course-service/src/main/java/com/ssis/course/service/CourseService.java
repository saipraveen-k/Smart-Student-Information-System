package com.ssis.course.service;

import com.ssis.course.dto.CourseDTO;
import com.ssis.course.dto.CourseResponseDTO;

import java.util.List;

public interface CourseService {
    CourseResponseDTO createCourse(CourseDTO courseDTO);
    CourseResponseDTO getCourseByCourseId(String courseId);
    CourseResponseDTO getCourseByCourseCode(String courseCode);
    List<CourseResponseDTO> getAllCourses();
    CourseResponseDTO updateCourse(String courseId, CourseDTO courseDTO);
    void deleteCourse(String courseId);
    List<CourseResponseDTO> searchCourses(String keyword);
    List<CourseResponseDTO> getCoursesByDepartment(String department);
    void seedDemoDataIfEmpty();
}
