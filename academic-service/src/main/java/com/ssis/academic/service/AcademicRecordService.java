package com.ssis.academic.service;

import com.ssis.academic.dto.*;

import java.util.List;

public interface AcademicRecordService {
    AcademicRecordResponseDTO createAcademicRecord(AcademicRecordDTO dto);
    AcademicRecordResponseDTO getAcademicRecordByRecordId(String recordId);
    List<AcademicRecordResponseDTO> getAllAcademicRecords();
    List<AcademicRecordResponseDTO> getAcademicRecordsByStudentId(String studentId);
    List<AcademicRecordResponseDTO> getAcademicRecordsByStudentIdAndSemester(String studentId, Integer semester);
    StudentPerformanceDTO calculateStudentPerformance(String studentId);
    PerformanceOverviewDTO getSystemPerformanceOverview();
    AcademicRecordResponseDTO updateAcademicRecord(String recordId, AcademicRecordDTO dto);
    void deleteAcademicRecord(String recordId);
    void seedDemoDataIfEmpty();
}
