package com.ssis.reporting.soap.dto;

import jakarta.xml.bind.annotation.*;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "studentReport"
})
@XmlRootElement(name = "getStudentReportResponse", namespace = "http://ssis.com/reporting/soap")
public class GetStudentReportResponse {

    @XmlElement(namespace = "http://ssis.com/reporting/soap", required = true)
    protected StudentReport studentReport;

    public StudentReport getStudentReport() {
        return studentReport;
    }

    public void setStudentReport(StudentReport value) {
        this.studentReport = value;
    }
}
