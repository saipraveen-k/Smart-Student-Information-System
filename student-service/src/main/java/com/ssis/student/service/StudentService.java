package com.ssis.student.service;

import com.ssis.student.dto.StudentDTO;
import com.ssis.student.dto.StudentResponseDTO;

import java.util.List;

public interface StudentService {
    StudentResponseDTO createStudent(StudentDTO studentDTO);
    StudentResponseDTO getStudentByStudentId(String studentId);
    List<StudentResponseDTO> getAllStudents();
    StudentResponseDTO updateStudent(String studentId, StudentDTO studentDTO);
    void deleteStudent(String studentId);
    List<StudentResponseDTO> searchStudents(String keyword);
    List<StudentResponseDTO> getStudentsByDepartment(String department);
    List<StudentResponseDTO> getStudentsByStatus(String status);
    void seedDemoDataIfEmpty();
}
