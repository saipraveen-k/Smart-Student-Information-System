package com.ssis.reporting.soap.dto;

import jakarta.xml.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "StudentReport", namespace = "http://ssis.com/reporting/soap", propOrder = {
    "studentId",
    "studentName",
    "email",
    "phone",
    "department",
    "program",
    "year",
    "semester",
    "status",
    "academicRecords",
    "totalCourses",
    "averageMarks",
    "cumulativeGradePointAverage",
    "overallPerformance",
    "averageAttendance",
    "generatedAt"
})
public class StudentReport {

    @XmlElement(namespace = "http://ssis.com/reporting/soap", required = true)
    protected String studentId;
    @XmlElement(namespace = "http://ssis.com/reporting/soap", required = true)
    protected String studentName;
    @XmlElement(namespace = "http://ssis.com/reporting/soap", required = true)
    protected String email;
    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected String phone;
    @XmlElement(namespace = "http://ssis.com/reporting/soap", required = true)
    protected String department;
    @XmlElement(namespace = "http://ssis.com/reporting/soap", required = true)
    protected String program;
    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected int year;
    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected int semester;
    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected String status;
    @XmlElement(namespace = "http://ssis.com/reporting/soap", required = true)
    protected StudentReport.AcademicRecords academicRecords;
    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected int totalCourses;
    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected double averageMarks;
    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected double cumulativeGradePointAverage;
    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected String overallPerformance;
    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected double averageAttendance;
    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected String generatedAt;

    public String getStudentId() { return studentId; }
    public void setStudentId(String value) { this.studentId = value; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String value) { this.studentName = value; }

    public String getEmail() { return email; }
    public void setEmail(String value) { this.email = value; }

    public String getPhone() { return phone; }
    public void setPhone(String value) { this.phone = value; }

    public String getDepartment() { return department; }
    public void setDepartment(String value) { this.department = value; }

    public String getProgram() { return program; }
    public void setProgram(String value) { this.program = value; }

    public int getYear() { return year; }
    public void setYear(int value) { this.year = value; }

    public int getSemester() { return semester; }
    public void setSemester(int value) { this.semester = value; }

    public String getStatus() { return status; }
    public void setStatus(String value) { this.status = value; }

    public StudentReport.AcademicRecords getAcademicRecords() { return academicRecords; }
    public void setAcademicRecords(StudentReport.AcademicRecords value) { this.academicRecords = value; }

    public int getTotalCourses() { return totalCourses; }
    public void setTotalCourses(int value) { this.totalCourses = value; }

    public double getAverageMarks() { return averageMarks; }
    public void setAverageMarks(double value) { this.averageMarks = value; }

    public double getCumulativeGradePointAverage() { return cumulativeGradePointAverage; }
    public void setCumulativeGradePointAverage(double value) { this.cumulativeGradePointAverage = value; }

    public String getOverallPerformance() { return overallPerformance; }
    public void setOverallPerformance(String value) { this.overallPerformance = value; }

    public double getAverageAttendance() { return averageAttendance; }
    public void setAverageAttendance(double value) { this.averageAttendance = value; }

    public String getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(String value) { this.generatedAt = value; }

    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {
        "record"
    })
    public static class AcademicRecords {
        @XmlElement(namespace = "http://ssis.com/reporting/soap")
        protected List<CourseRecordXml> record;

        public List<CourseRecordXml> getRecord() {
            if (record == null) {
                record = new ArrayList<>();
            }
            return this.record;
        }
    }
}
