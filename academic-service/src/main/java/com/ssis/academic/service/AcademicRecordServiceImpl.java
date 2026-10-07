package com.ssis.academic.service;

import com.ssis.academic.config.GradingConfig;
import com.ssis.academic.dto.*;
import com.ssis.academic.exception.AcademicRecordNotFoundException;
import com.ssis.academic.exception.InvalidMarksException;
import com.ssis.academic.model.AcademicRecord;
import com.ssis.academic.repository.AcademicRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AcademicRecordServiceImpl implements AcademicRecordService {

    private final AcademicRecordRepository academicRecordRepository;
    private final GradingConfig gradingConfig;

    @Override
    public AcademicRecordResponseDTO createAcademicRecord(AcademicRecordDTO dto) {
        log.info("Creating academic record AR: {} for student: {}, course: {}", dto.getRecordId(), dto.getStudentId(), dto.getCourseId());
        if (academicRecordRepository.existsByRecordId(dto.getRecordId())) {
            throw new InvalidMarksException("Academic Record ID " + dto.getRecordId() + " already exists");
        }

        validateMarks(dto.getInternalMarks(), dto.getExternalMarks());

        AcademicRecord record = mapToEntity(dto);
        computeGradeAndPerformance(record);
        record.setCreatedAt(LocalDateTime.now());
        record.setUpdatedAt(LocalDateTime.now());

        AcademicRecord saved = academicRecordRepository.save(record);
        return mapToDTO(saved);
    }

    @Override
    public AcademicRecordResponseDTO getAcademicRecordByRecordId(String recordId) {
        log.info("Fetching academic record: {}", recordId);
        AcademicRecord record = academicRecordRepository.findByRecordId(recordId)
                .orElseThrow(() -> new AcademicRecordNotFoundException("Academic record " + recordId + " was not found"));
        return mapToDTO(record);
    }

    @Override
    public List<AcademicRecordResponseDTO> getAllAcademicRecords() {
        log.info("Fetching all academic records");
        return academicRecordRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AcademicRecordResponseDTO> getAcademicRecordsByStudentId(String studentId) {
        log.info("Fetching academic records for studentId: {}", studentId);
        return academicRecordRepository.findByStudentId(studentId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AcademicRecordResponseDTO> getAcademicRecordsByStudentIdAndSemester(String studentId, Integer semester) {
        log.info("Fetching academic records for studentId: {}, semester: {}", studentId, semester);
        return academicRecordRepository.findByStudentIdAndSemester(studentId, semester).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StudentPerformanceDTO calculateStudentPerformance(String studentId) {
        log.info("Calculating performance metrics for studentId: {}", studentId);
        List<AcademicRecord> records = academicRecordRepository.findByStudentId(studentId);
        if (records.isEmpty()) {
            return StudentPerformanceDTO.builder()
                    .studentId(studentId)
                    .totalCoursesCompleted(0)
                    .averageMarks(0.0)
                    .cumulativeGradePointAverage(0.0)
                    .overallPerformanceGrade("N/A")
                    .averageAttendance(0.0)
                    .records(List.of())
                    .build();
        }

        double totalMarksSum = records.stream().mapToDouble(AcademicRecord::getTotalMarks).sum();
        double gradePointSum = records.stream().mapToDouble(AcademicRecord::getGradePoint).sum();
        double attendanceSum = records.stream().mapToDouble(r -> r.getAttendancePercentage() != null ? r.getAttendancePercentage() : 0.0).sum();

        int count = records.size();
        double avgMarks = Math.round((totalMarksSum / count) * 100.0) / 100.0;
        double cgpa = Math.round((gradePointSum / count) * 100.0) / 100.0;
        double avgAttendance = Math.round((attendanceSum / count) * 100.0) / 100.0;

        GradingConfig.GradeRule overallRule = gradingConfig.evaluateGrade(avgMarks);

        List<AcademicRecordResponseDTO> responseList = records.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return StudentPerformanceDTO.builder()
                .studentId(studentId)
                .totalCoursesCompleted(count)
                .averageMarks(avgMarks)
                .cumulativeGradePointAverage(cgpa)
                .overallPerformanceGrade(overallRule.getGrade() + " (" + overallRule.getDescription() + ")")
                .averageAttendance(avgAttendance)
                .records(responseList)
                .build();
    }

    @Override
    public PerformanceOverviewDTO getSystemPerformanceOverview() {
        log.info("Computing global system performance overview analytics");
        List<AcademicRecord> allRecords = academicRecordRepository.findAll();
        if (allRecords.isEmpty()) {
            return PerformanceOverviewDTO.builder()
                    .totalRecords(0)
                    .systemAverageMarks(0.0)
                    .systemAverageGradePoint(0.0)
                    .gradeDistribution(Map.of())
                    .semesterAveragePerformance(Map.of())
                    .build();
        }

        double totalMarksSum = allRecords.stream().mapToDouble(AcademicRecord::getTotalMarks).sum();
        double totalGpSum = allRecords.stream().mapToDouble(AcademicRecord::getGradePoint).sum();
        long count = allRecords.size();

        double avgMarks = Math.round((totalMarksSum / count) * 100.0) / 100.0;
        double avgGp = Math.round((totalGpSum / count) * 100.0) / 100.0;

        Map<String, Long> gradeDist = allRecords.stream()
                .collect(Collectors.groupingBy(AcademicRecord::getGrade, Collectors.counting()));

        Map<Integer, Double> semAvg = allRecords.stream()
                .collect(Collectors.groupingBy(AcademicRecord::getSemester,
                        Collectors.averagingDouble(AcademicRecord::getTotalMarks)))
                .entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> Math.round(e.getValue() * 100.0) / 100.0
                ));

        return PerformanceOverviewDTO.builder()
                .totalRecords(count)
                .systemAverageMarks(avgMarks)
                .systemAverageGradePoint(avgGp)
                .gradeDistribution(gradeDist)
                .semesterAveragePerformance(semAvg)
                .build();
    }

    @Override
    public AcademicRecordResponseDTO updateAcademicRecord(String recordId, AcademicRecordDTO dto) {
        log.info("Updating academic record AR: {}", recordId);
        AcademicRecord record = academicRecordRepository.findByRecordId(recordId)
                .orElseThrow(() -> new AcademicRecordNotFoundException("Academic record " + recordId + " was not found"));

        validateMarks(dto.getInternalMarks(), dto.getExternalMarks());

        record.setAcademicYear(dto.getAcademicYear());
        record.setSemester(dto.getSemester());
        record.setInternalMarks(dto.getInternalMarks());
        record.setExternalMarks(dto.getExternalMarks());
        record.setAttendancePercentage(dto.getAttendancePercentage());
        record.setRemarks(dto.getRemarks());

        computeGradeAndPerformance(record);
        record.setUpdatedAt(LocalDateTime.now());

        AcademicRecord updated = academicRecordRepository.save(record);
        return mapToDTO(updated);
    }

    @Override
    public void deleteAcademicRecord(String recordId) {
        log.info("Deleting academic record AR: {}", recordId);
        AcademicRecord record = academicRecordRepository.findByRecordId(recordId)
                .orElseThrow(() -> new AcademicRecordNotFoundException("Academic record " + recordId + " was not found"));
        academicRecordRepository.delete(record);
    }

    @Override
    public void seedDemoDataIfEmpty() {
        if (academicRecordRepository.count() > 0) {
            log.info("Academic record collection already populated. Skipping auto-seeding.");
            return;
        }
        log.info("Seeding initial academic record demo data into MongoDB...");
        List<AcademicRecordDTO> seeds = List.of(
                // Student STU001 (Sai Praveen - AIML)
                new AcademicRecordDTO("AR001", "STU001", "C101", "2024-2025", 6, 36.0, 56.0, 92.0, "Excellent mastery in AI algorithms"),
                new AcademicRecordDTO("AR002", "STU001", "C105", "2024-2025", 6, 34.0, 52.0, 88.0, "High performance in Neural Networks"),
                new AcademicRecordDTO("AR003", "STU001", "C106", "2024-2025", 6, 32.0, 48.0, 95.0, "Completed REST & Microservices project"),

                // Student STU002 (Ananya Sharma - CSE)
                new AcademicRecordDTO("AR004", "STU002", "C102", "2023-2024", 3, 38.0, 58.0, 96.0, "Top scorer in Data Structures"),
                new AcademicRecordDTO("AR005", "STU002", "C103", "2023-2024", 4, 35.0, 50.0, 90.0, "Outstanding SQL & MongoDB design"),
                new AcademicRecordDTO("AR006", "STU002", "C106", "2024-2025", 6, 33.0, 51.0, 87.0, "Great cloud deployment skills"),

                // Student STU003 (Rahul Verma - ECE)
                new AcademicRecordDTO("AR007", "STU003", "C104", "2023-2024", 4, 28.0, 44.0, 85.0, "Good signal filter implementation"),

                // Student STU004 (Priya Nair - AIML)
                new AcademicRecordDTO("AR008", "STU004", "C101", "2024-2025", 6, 30.0, 46.0, 91.0, "Solid AI foundations"),
                new AcademicRecordDTO("AR009", "STU004", "C105", "2024-2025", 6, 31.0, 47.0, 89.0, "Strong Computer Vision project"),

                // Student STU005 (Rohan Gupta - CSE)
                new AcademicRecordDTO("AR010", "STU005", "C102", "2022-2023", 3, 26.0, 38.0, 80.0, "Passed DS exam comfortably"),
                new AcademicRecordDTO("AR011", "STU005", "C103", "2022-2023", 4, 29.0, 41.0, 82.0, "Good DBMS performance"),

                // Student STU006 (Sneha Reddy - EEE)
                new AcademicRecordDTO("AR012", "STU006", "C107", "2023-2024", 4, 34.0, 50.0, 94.0, "Excellent Power Systems analysis"),

                // Student STU007 (Vikram Singh - MECH)
                new AcademicRecordDTO("AR013", "STU007", "C108", "2024-2025", 5, 27.0, 39.0, 78.0, "Good heat transfer lab report"),

                // Student STU008 (Divya Iyer - CSE)
                new AcademicRecordDTO("AR014", "STU008", "C102", "2023-2024", 3, 37.0, 55.0, 93.0, "Outstanding DSA problem solver"),

                // Student STU009 (Karthik Rao - AIML)
                new AcademicRecordDTO("AR015", "STU009", "C101", "2024-2025", 6, 25.0, 42.0, 86.0, "Satisfactory machine learning project"),

                // Student STU010 (Meera Kulkarni - CIVIL)
                new AcademicRecordDTO("AR016", "STU010", "C103", "2023-2024", 4, 30.0, 45.0, 88.0, "Good structural data modeling")
        );

        for (AcademicRecordDTO seed : seeds) {
            AcademicRecord record = mapToEntity(seed);
            computeGradeAndPerformance(record);
            record.setCreatedAt(LocalDateTime.now());
            record.setUpdatedAt(LocalDateTime.now());
            academicRecordRepository.save(record);
        }
        log.info("Successfully seeded {} academic record documents into MongoDB.", seeds.size());
    }

    private void validateMarks(Double internalMarks, Double externalMarks) {
        if (internalMarks == null || internalMarks < 0 || internalMarks > 40) {
            throw new InvalidMarksException("Internal marks must be between 0 and 40");
        }
        if (externalMarks == null || externalMarks < 0 || externalMarks > 60) {
            throw new InvalidMarksException("External marks must be between 0 and 60");
        }
    }

    private void computeGradeAndPerformance(AcademicRecord record) {
        double total = record.getInternalMarks() + record.getExternalMarks();
        record.setTotalMarks(total);

        GradingConfig.GradeRule rule = gradingConfig.evaluateGrade(total);
        record.setGrade(rule.getGrade());
        record.setGradePoint(rule.getGradePoint());
    }

    private AcademicRecord mapToEntity(AcademicRecordDTO dto) {
        return AcademicRecord.builder()
                .recordId(dto.getRecordId())
                .studentId(dto.getStudentId())
                .courseId(dto.getCourseId())
                .academicYear(dto.getAcademicYear())
                .semester(dto.getSemester())
                .internalMarks(dto.getInternalMarks())
                .externalMarks(dto.getExternalMarks())
                .attendancePercentage(dto.getAttendancePercentage() != null ? dto.getAttendancePercentage() : 85.0)
                .remarks(dto.getRemarks())
                .build();
    }

    private AcademicRecordResponseDTO mapToDTO(AcademicRecord record) {
        return AcademicRecordResponseDTO.builder()
                .id(record.getId())
                .recordId(record.getRecordId())
                .studentId(record.getStudentId())
                .courseId(record.getCourseId())
                .academicYear(record.getAcademicYear())
                .semester(record.getSemester())
                .internalMarks(record.getInternalMarks())
                .externalMarks(record.getExternalMarks())
                .totalMarks(record.getTotalMarks())
                .grade(record.getGrade())
                .gradePoint(record.getGradePoint())
                .attendancePercentage(record.getAttendancePercentage())
                .remarks(record.getRemarks())
                .createdAt(record.getCreatedAt())
                .updatedAt(record.getUpdatedAt())
                .build();
    }
}
