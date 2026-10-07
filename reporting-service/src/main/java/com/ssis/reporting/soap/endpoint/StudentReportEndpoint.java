package com.ssis.reporting.soap.endpoint;

import com.ssis.reporting.service.ReportingService;
import com.ssis.reporting.soap.dto.GetStudentReportRequest;
import com.ssis.reporting.soap.dto.GetStudentReportResponse;
import com.ssis.reporting.soap.dto.StudentReport;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

@Endpoint
@RequiredArgsConstructor
@Slf4j
public class StudentReportEndpoint {

    private static final String NAMESPACE_URI = "http://ssis.com/reporting/soap";

    private final ReportingService reportingService;

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getStudentReportRequest")
    @ResponsePayload
    public GetStudentReportResponse getStudentReport(@RequestPayload GetStudentReportRequest request) {
        log.info("[SOAP WS INVOCATION] getStudentReport called for studentId: {}", request.getStudentId());

        StudentReport report = reportingService.generateStudentReport(request.getStudentId());

        GetStudentReportResponse response = new GetStudentReportResponse();
        response.setStudentReport(report);

        log.info("[SOAP WS RESPONSE] Generated SOAP response for studentId: {}", request.getStudentId());
        return response;
    }
}
