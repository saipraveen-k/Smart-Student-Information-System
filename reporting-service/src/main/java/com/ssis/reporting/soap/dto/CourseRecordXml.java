package com.ssis.reporting.soap.dto;

import jakarta.xml.bind.annotation.*;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "CourseRecordXml", namespace = "http://ssis.com/reporting/soap", propOrder = {
    "recordId",
    "courseCode",
    "courseName",
    "credits",
    "semester",
    "internalMarks",
    "externalMarks",
    "totalMarks",
    "grade",
    "gradePoint",
    "attendancePercentage",
    "remarks"
})
public class CourseRecordXml {

    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected String recordId;
    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected String courseCode;
    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected String courseName;
    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected int credits;
    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected int semester;
    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected double internalMarks;
    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected double externalMarks;
    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected double totalMarks;
    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected String grade;
    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected double gradePoint;
    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected double attendancePercentage;
    @XmlElement(namespace = "http://ssis.com/reporting/soap")
    protected String remarks;

    public String getRecordId() { return recordId; }
    public void setRecordId(String value) { this.recordId = value; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String value) { this.courseCode = value; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String value) { this.courseName = value; }

    public int getCredits() { return credits; }
    public void setCredits(int value) { this.credits = value; }

    public int getSemester() { return semester; }
    public void setSemester(int value) { this.semester = value; }

    public double getInternalMarks() { return internalMarks; }
    public void setInternalMarks(double value) { this.internalMarks = value; }

    public double getExternalMarks() { return externalMarks; }
    public void setExternalMarks(double value) { this.externalMarks = value; }

    public double getTotalMarks() { return totalMarks; }
    public void setTotalMarks(double value) { this.totalMarks = value; }

    public String getGrade() { return grade; }
    public void setGrade(String value) { this.grade = value; }

    public double getGradePoint() { return gradePoint; }
    public void setGradePoint(double value) { this.gradePoint = value; }

    public double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(double value) { this.attendancePercentage = value; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String value) { this.remarks = value; }
}
