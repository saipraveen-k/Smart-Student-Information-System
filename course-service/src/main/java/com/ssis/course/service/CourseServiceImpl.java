package com.ssis.course.service;

import com.ssis.course.dto.CourseDTO;
import com.ssis.course.dto.CourseResponseDTO;
import com.ssis.course.exception.CourseNotFoundException;
import com.ssis.course.exception.DuplicateCourseException;
import com.ssis.course.model.Course;
import com.ssis.course.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    @Override
    public CourseResponseDTO createCourse(CourseDTO dto) {
        log.info("Creating course with courseId: {}, code: {}", dto.getCourseId(), dto.getCourseCode());
        if (courseRepository.existsByCourseId(dto.getCourseId())) {
            throw new DuplicateCourseException("Course with ID " + dto.getCourseId() + " already exists");
        }
        if (courseRepository.existsByCourseCode(dto.getCourseCode())) {
            throw new DuplicateCourseException("Course with code " + dto.getCourseCode() + " already exists");
        }

        Course course = mapToEntity(dto);
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());

        Course saved = courseRepository.save(course);
        return mapToDTO(saved);
    }

    @Override
    public CourseResponseDTO getCourseByCourseId(String courseId) {
        log.info("Fetching course by courseId: {}", courseId);
        Course course = courseRepository.findByCourseId(courseId)
                .orElseGet(() -> courseRepository.findByCourseCode(courseId)
                        .orElseThrow(() -> new CourseNotFoundException("Course " + courseId + " was not found")));
        return mapToDTO(course);
    }

    @Override
    public CourseResponseDTO getCourseByCourseCode(String courseCode) {
        log.info("Fetching course by courseCode: {}", courseCode);
        Course course = courseRepository.findByCourseCode(courseCode)
                .orElseThrow(() -> new CourseNotFoundException("Course with code " + courseCode + " was not found"));
        return mapToDTO(course);
    }

    @Override
    public List<CourseResponseDTO> getAllCourses() {
        log.info("Fetching all courses");
        return courseRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CourseResponseDTO updateCourse(String courseId, CourseDTO dto) {
        log.info("Updating course with ID: {}", courseId);
        Course course = courseRepository.findByCourseId(courseId)
                .orElseGet(() -> courseRepository.findByCourseCode(courseId)
                        .orElseThrow(() -> new CourseNotFoundException("Course " + courseId + " was not found")));

        if (!course.getCourseCode().equalsIgnoreCase(dto.getCourseCode()) && courseRepository.existsByCourseCode(dto.getCourseCode())) {
            throw new DuplicateCourseException("Course code " + dto.getCourseCode() + " already in use");
        }

        course.setCourseCode(dto.getCourseCode());
        course.setCourseName(dto.getCourseName());
        course.setDescription(dto.getDescription());
        course.setDepartment(dto.getDepartment());
        course.setCredits(dto.getCredits());
        course.setSemester(dto.getSemester());
        course.setFacultyName(dto.getFacultyName());
        if (dto.getStatus() != null) {
            course.setStatus(dto.getStatus());
        }
        course.setUpdatedAt(LocalDateTime.now());

        Course updated = courseRepository.save(course);
        return mapToDTO(updated);
    }

    @Override
    public void deleteCourse(String courseId) {
        log.info("Deleting course with ID: {}", courseId);
        Course course = courseRepository.findByCourseId(courseId)
                .orElseGet(() -> courseRepository.findByCourseCode(courseId)
                        .orElseThrow(() -> new CourseNotFoundException("Course " + courseId + " was not found")));
        courseRepository.delete(course);
    }

    @Override
    public List<CourseResponseDTO> searchCourses(String keyword) {
        log.info("Searching courses with keyword: {}", keyword);
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllCourses();
        }
        return courseRepository.searchCourses(keyword.trim()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseResponseDTO> getCoursesByDepartment(String department) {
        log.info("Fetching courses by department: {}", department);
        return courseRepository.findByDepartment(department).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void seedDemoDataIfEmpty() {
        if (courseRepository.count() > 0) {
            log.info("Course collection already populated. Skipping auto-seeding.");
            return;
        }
        log.info("Seeding initial course demo data into MongoDB...");
        List<Course> demoCourses = List.of(
                Course.builder().courseId("C101").courseCode("AI201").courseName("Artificial Intelligence & Machine Learning").description("Fundamentals of AI, search algorithms, neural networks, and model training.").department("AIML").credits(4).semester(6).facultyName("Dr. Ramesh Sharma").status("ACTIVE").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build(),
                Course.builder().courseId("C102").courseCode("CS202").courseName("Data Structures & Algorithms").description("Array, LinkedList, Trees, Graphs, Sorting, and Dynamic Programming.").department("CSE").credits(4).semester(3).facultyName("Prof. Sunita Rao").status("ACTIVE").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build(),
                Course.builder().courseId("C103").courseCode("CS301").courseName("Database Management Systems").description("Relational & NoSQL MongoDB architectures, ACID, indexing, and aggregation.").department("CSE").credits(3).semester(4).facultyName("Dr. Alok Verma").status("ACTIVE").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build(),
                Course.builder().courseId("C104").courseCode("EC204").courseName("Digital Signal Processing").description("Signals, Fourier transforms, filters, and digital microcontrollers.").department("ECE").credits(4).semester(4).facultyName("Prof. K. Venkatesh").status("ACTIVE").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build(),
                Course.builder().courseId("C105").courseCode("AI302").courseName("Deep Learning & Computer Vision").description("Convolutional Neural Networks, Object Detection, and PyTorch/TensorFlow.").department("AIML").credits(4).semester(6).facultyName("Dr. Ramesh Sharma").status("ACTIVE").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build(),
                Course.builder().courseId("C106").courseCode("CS401").courseName("Cloud Computing & Microservices").description("Docker, REST APIs, SOAP, Spring Boot Gateway, and Distributed Architecture.").department("CSE").credits(3).semester(6).facultyName("Dr. Vikram Bose").status("ACTIVE").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build(),
                Course.builder().courseId("C107").courseCode("EE201").courseName("Power Systems & Control Theory").description("Electrical circuits, feedback systems, and grid stability analysis.").department("EEE").credits(4).semester(4).facultyName("Prof. Meenakshi Joshi").status("ACTIVE").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build(),
                Course.builder().courseId("C108").courseCode("ME301").courseName("Thermodynamics & Heat Transfer").description("Laws of thermodynamics, fluid dynamics, and HVAC engineering.").department("MECH").credits(4).semester(5).facultyName("Dr. S. K. Gupta").status("ACTIVE").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build()
        );
        courseRepository.saveAll(demoCourses);
        log.info("Successfully seeded 8 course documents into MongoDB.");
    }

    private Course mapToEntity(CourseDTO dto) {
        return Course.builder()
                .courseId(dto.getCourseId())
                .courseCode(dto.getCourseCode())
                .courseName(dto.getCourseName())
                .description(dto.getDescription())
                .department(dto.getDepartment())
                .credits(dto.getCredits())
                .semester(dto.getSemester())
                .facultyName(dto.getFacultyName())
                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                .build();
    }

    private CourseResponseDTO mapToDTO(Course course) {
        return CourseResponseDTO.builder()
                .id(course.getId())
                .courseId(course.getCourseId())
                .courseCode(course.getCourseCode())
                .courseName(course.getCourseName())
                .description(course.getDescription())
                .department(course.getDepartment())
                .credits(course.getCredits())
                .semester(course.getSemester())
                .facultyName(course.getFacultyName())
                .status(course.getStatus())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }
}
