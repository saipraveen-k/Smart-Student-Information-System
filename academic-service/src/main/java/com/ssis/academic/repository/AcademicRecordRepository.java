package com.ssis.academic.repository;

import com.ssis.academic.model.AcademicRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AcademicRecordRepository extends MongoRepository<AcademicRecord, String> {

    Optional<AcademicRecord> findByRecordId(String recordId);

    boolean existsByRecordId(String recordId);

    List<AcademicRecord> findByStudentId(String studentId);

    List<AcademicRecord> findByStudentIdAndSemester(String studentId, Integer semester);

    List<AcademicRecord> findByCourseId(String courseId);

    boolean existsByStudentIdAndCourseIdAndSemester(String studentId, String courseId, Integer semester);
}
