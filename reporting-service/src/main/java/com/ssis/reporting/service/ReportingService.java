package com.ssis.reporting.service;

import com.ssis.reporting.soap.dto.StudentReport;

public interface ReportingService {
    StudentReport generateStudentReport(String studentId);
}
