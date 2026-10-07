package com.ssis.reporting.soap.dto;

import jakarta.xml.bind.annotation.*;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "studentId"
})
@XmlRootElement(name = "getStudentReportRequest", namespace = "http://ssis.com/reporting/soap")
public class GetStudentReportRequest {

    @XmlElement(namespace = "http://ssis.com/reporting/soap", required = true)
    protected String studentId;

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String value) {
        this.studentId = value;
    }
}
