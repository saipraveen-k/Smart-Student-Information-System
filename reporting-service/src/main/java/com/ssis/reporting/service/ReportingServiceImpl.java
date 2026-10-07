package com.ssis.reporting.service;

import com.ssis.reporting.soap.dto.CourseRecordXml;
import com.ssis.reporting.soap.dto.StudentReport;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportingServiceImpl implements ReportingService {

    private final MongoTemplate mongoTemplate;

    @Override
    public StudentReport generateStudentReport(String studentId) {
        log.info("Generating SOAP/REST Student Report from MongoDB for studentId: {}", studentId);

        // 1. Fetch Student from MongoDB collection 'students'
        Query studentQuery = new Query(Criteria.where("studentId").is(studentId));
        Document studentDoc = mongoTemplate.findOne(studentQuery, Document.class, "students");

        if (studentDoc == null) {
            log.warn("Student {} not found in MongoDB. Creating generic fallback report.", studentId);
            StudentReport fallback = new StudentReport();
            fallback.setStudentId(studentId);
            fallback.setStudentName("Unknown Student (" + studentId + ")");
            fallback.setEmail("notfound@ssis.edu");
            fallback.setDepartment("N/A");
            fallback.setProgram("N/A");
            fallback.setYear(0);
            fallback.setSemester(0);
            fallback.setStatus("NOT_FOUND");
            fallback.setAcademicRecords(new StudentReport.AcademicRecords());
            fallback.setTotalCourses(0);
            fallback.setAverageMarks(0.0);
            fallback.setCumulativeGradePointAverage(0.0);
            fallback.setOverallPerformance("NO_DATA");
            fallback.setGeneratedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            return fallback;
        }

        // 2. Fetch Courses map for details enrichment
        List<Document> courseDocs = mongoTemplate.findAll(Document.class, "courses");
        Map<String, Document> courseMap = courseDocs.stream()
                .filter(d -> d.getString("courseId") != null)
                .collect(Collectors.toMap(
                        d -> d.getString("courseId"),
                        d -> d,
                        (existing, replacement) -> existing
                ));

        // 3. Fetch Academic Records for this student from MongoDB 'academic_records'
        Query academicQuery = new Query(Criteria.where("studentId").is(studentId));
        List<Document> recordDocs = mongoTemplate.find(academicQuery, Document.class, "academic_records");

        StudentReport.AcademicRecords academicRecordsXml = new StudentReport.AcademicRecords();
        double totalMarksSum = 0.0;
        double gradePointSum = 0.0;
        double attendanceSum = 0.0;
        int courseCount = recordDocs.size();

        for (Document rec : recordDocs) {
            String courseId = rec.getString("courseId");
            Document cDoc = courseMap.get(courseId);

            CourseRecordXml item = new CourseRecordXml();
            item.setRecordId(rec.getString("recordId") != null ? rec.getString("recordId") : "N/A");
            item.setCourseCode(cDoc != null && cDoc.getString("courseCode") != null ? cDoc.getString("courseCode") : courseId);
            item.setCourseName(cDoc != null && cDoc.getString("courseName") != null ? cDoc.getString("courseName") : "Course " + courseId);
            item.setCredits(cDoc != null && cDoc.getInteger("credits") != null ? cDoc.getInteger("credits") : 3);
            item.setSemester(rec.getInteger("semester") != null ? rec.getInteger("semester") : 1);

            double internal = rec.getDouble("internalMarks") != null ? rec.getDouble("internalMarks") : 0.0;
            double external = rec.getDouble("externalMarks") != null ? rec.getDouble("externalMarks") : 0.0;
            double total = rec.getDouble("totalMarks") != null ? rec.getDouble("totalMarks") : (internal + external);
            double gp = rec.getDouble("gradePoint") != null ? rec.getDouble("gradePoint") : 0.0;
            double att = rec.getDouble("attendancePercentage") != null ? rec.getDouble("attendancePercentage") : 85.0;

            item.setInternalMarks(internal);
            item.setExternalMarks(external);
            item.setTotalMarks(total);
            item.setGrade(rec.getString("grade") != null ? rec.getString("grade") : "N/A");
            item.setGradePoint(gp);
            item.setAttendancePercentage(att);
            item.setRemarks(rec.getString("remarks") != null ? rec.getString("remarks") : "Satisfactory");

            totalMarksSum += total;
            gradePointSum += gp;
            attendanceSum += att;

            academicRecordsXml.getRecord().add(item);
        }

        double avgMarks = courseCount > 0 ? Math.round((totalMarksSum / courseCount) * 100.0) / 100.0 : 0.0;
        double cgpa = courseCount > 0 ? Math.round((gradePointSum / courseCount) * 100.0) / 100.0 : 0.0;
        double avgAtt = courseCount > 0 ? Math.round((attendanceSum / courseCount) * 100.0) / 100.0 : 0.0;

        String performanceText;
        if (cgpa >= 9.0) performanceText = "Distinction / Outstanding";
        else if (cgpa >= 8.0) performanceText = "First Class with Distinction";
        else if (cgpa >= 7.0) performanceText = "First Class";
        else if (cgpa >= 6.0) performanceText = "Second Class";
        else if (cgpa >= 5.0) performanceText = "Pass Class";
        else performanceText = "Needs Improvement / Fail";

        String firstName = studentDoc.getString("firstName") != null ? studentDoc.getString("firstName") : "";
        String lastName = studentDoc.getString("lastName") != null ? studentDoc.getString("lastName") : "";
        String fullName = (firstName + " " + lastName).trim();

        StudentReport report = new StudentReport();
        report.setStudentId(studentId);
        report.setStudentName(fullName);
        report.setEmail(studentDoc.getString("email"));
        report.setPhone(studentDoc.getString("phone"));
        report.setDepartment(studentDoc.getString("department"));
        report.setProgram(studentDoc.getString("program"));
        report.setYear(studentDoc.getInteger("year") != null ? studentDoc.getInteger("year") : 1);
        report.setSemester(studentDoc.getInteger("semester") != null ? studentDoc.getInteger("semester") : 1);
        report.setStatus(studentDoc.getString("status") != null ? studentDoc.getString("status") : "ACTIVE");
        report.setAcademicRecords(academicRecordsXml);
        report.setTotalCourses(courseCount);
        report.setAverageMarks(avgMarks);
        report.setCumulativeGradePointAverage(cgpa);
        report.setOverallPerformance(performanceText);
        report.setAverageAttendance(avgAtt);
        report.setGeneratedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        return report;
    }
}
