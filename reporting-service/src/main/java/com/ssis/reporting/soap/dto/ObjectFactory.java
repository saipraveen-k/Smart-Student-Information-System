package com.ssis.reporting.soap.dto;

import jakarta.xml.bind.annotation.XmlRegistry;

@XmlRegistry
public class ObjectFactory {

    public ObjectFactory() {
    }

    public GetStudentReportRequest createGetStudentReportRequest() {
        return new GetStudentReportRequest();
    }

    public GetStudentReportResponse createGetStudentReportResponse() {
        return new GetStudentReportResponse();
    }

    public StudentReport createStudentReport() {
        return new StudentReport();
    }

    public StudentReport.AcademicRecords createStudentReportAcademicRecords() {
        return new StudentReport.AcademicRecords();
    }

    public CourseRecordXml createCourseRecordXml() {
        return new CourseRecordXml();
    }
}
