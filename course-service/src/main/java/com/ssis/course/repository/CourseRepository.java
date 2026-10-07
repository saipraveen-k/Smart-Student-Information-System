package com.ssis.course.repository;

import com.ssis.course.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends MongoRepository<Course, String> {

    Optional<Course> findByCourseId(String courseId);

    Optional<Course> findByCourseCode(String courseCode);

    boolean existsByCourseId(String courseId);

    boolean existsByCourseCode(String courseCode);

    List<Course> findByDepartment(String department);

    @Query("{ '$or': [ { 'courseCode': { '$regex': ?0, '$options': 'i' } }, { 'courseName': { '$regex': ?0, '$options': 'i' } }, { 'department': { '$regex': ?0, '$options': 'i' } }, { 'facultyName': { '$regex': ?0, '$options': 'i' } } ] }")
    List<Course> searchCourses(String keyword);
}
