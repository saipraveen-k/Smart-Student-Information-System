package com.ssis.reporting.controller;

import com.ssis.reporting.service.ReportingService;
import com.ssis.reporting.soap.dto.StudentReport;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportingRestController {

    private final ReportingService reportingService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<Map<String, Object>> getStudentReportRest(@PathVariable String studentId) {
        StudentReport report = reportingService.generateStudentReport(studentId);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "apiType", "REST (JSON format)",
                "note", "Compare this JSON structure with the XML structure returned by /ws (SOAP Web Service)",
                "data", report
        ));
    }
}
