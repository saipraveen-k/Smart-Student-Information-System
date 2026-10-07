package com.ssis.student.service;

import com.ssis.student.dto.StudentDTO;
import com.ssis.student.dto.StudentResponseDTO;
import com.ssis.student.exception.DuplicateStudentException;
import com.ssis.student.exception.StudentNotFoundException;
import com.ssis.student.model.Student;
import com.ssis.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Override
    public StudentResponseDTO createStudent(StudentDTO dto) {
        log.info("Creating new student with studentId: {}", dto.getStudentId());
        if (studentRepository.existsByStudentId(dto.getStudentId())) {
            throw new DuplicateStudentException("Student with ID " + dto.getStudentId() + " already exists");
        }
        if (studentRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateStudentException("Student with email " + dto.getEmail() + " already exists");
        }

        Student student = mapToEntity(dto);
        student.setCreatedAt(LocalDateTime.now());
        student.setUpdatedAt(LocalDateTime.now());

        Student saved = studentRepository.save(student);
        return mapToDTO(saved);
    }

    @Override
    public StudentResponseDTO getStudentByStudentId(String studentId) {
        log.info("Fetching student with studentId: {}", studentId);
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student with ID " + studentId + " was not found"));
        return mapToDTO(student);
    }

    @Override
    public List<StudentResponseDTO> getAllStudents() {
        log.info("Fetching all students");
        return studentRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StudentResponseDTO updateStudent(String studentId, StudentDTO dto) {
        log.info("Updating student with studentId: {}", studentId);
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student with ID " + studentId + " was not found"));

        if (!student.getEmail().equalsIgnoreCase(dto.getEmail()) && studentRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateStudentException("Email " + dto.getEmail() + " is already in use by another student");
        }

        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setEmail(dto.getEmail());
        student.setPhone(dto.getPhone());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setGender(dto.getGender());
        student.setDepartment(dto.getDepartment());
        student.setProgram(dto.getProgram());
        student.setYear(dto.getYear());
        student.setSemester(dto.getSemester());
        if (dto.getEnrollmentDate() != null) {
            student.setEnrollmentDate(dto.getEnrollmentDate());
        }
        student.setAddress(dto.getAddress());
        if (dto.getStatus() != null) {
            student.setStatus(dto.getStatus());
        }
        student.setUpdatedAt(LocalDateTime.now());

        Student updated = studentRepository.save(student);
        return mapToDTO(updated);
    }

    @Override
    public void deleteStudent(String studentId) {
        log.info("Deleting student with studentId: {}", studentId);
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student with ID " + studentId + " was not found"));
        studentRepository.delete(student);
    }

    @Override
    public List<StudentResponseDTO> searchStudents(String keyword) {
        log.info("Searching students with keyword: {}", keyword);
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllStudents();
        }
        return studentRepository.searchStudents(keyword.trim()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentResponseDTO> getStudentsByDepartment(String department) {
        log.info("Fetching students for department: {}", department);
        return studentRepository.findByDepartment(department).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentResponseDTO> getStudentsByStatus(String status) {
        log.info("Fetching students for status: {}", status);
        return studentRepository.findByStatus(status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void seedDemoDataIfEmpty() {
        if (studentRepository.count() > 0) {
            log.info("Student collection already populated. Skipping auto-seeding.");
            return;
        }
        log.info("Seeding initial student demo data into MongoDB...");
        List<Student> demoStudents = List.of(
                Student.builder().studentId("STU001").firstName("Sai").lastName("Praveen").email("sai.praveen@ssis.edu").phone("+919876543210").dateOfBirth(LocalDate.of(2003, 5, 14)).gender("MALE").department("AIML").program("B.Tech").year(3).semester(6).enrollmentDate(LocalDate.of(2022, 8, 1)).address("Hyderabad, Telangana").status("ACTIVE").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build(),
                Student.builder().studentId("STU002").firstName("Ananya").lastName("Sharma").email("ananya.sharma@ssis.edu").phone("+919876543211").dateOfBirth(LocalDate.of(2003, 8, 22)).gender("FEMALE").department("CSE").program("B.Tech").year(3).semester(6).enrollmentDate(LocalDate.of(2022, 8, 1)).address("Bengaluru, Karnataka").status("ACTIVE").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build(),
                Student.builder().studentId("STU003").firstName("Rahul").lastName("Verma").email("rahul.verma@ssis.edu").phone("+919876543212").dateOfBirth(LocalDate.of(2004, 1, 10)).gender("MALE").department("ECE").program("B.Tech").year(2).semester(4).enrollmentDate(LocalDate.of(2023, 8, 1)).address("Chennai, Tamil Nadu").status("ACTIVE").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build(),
                Student.builder().studentId("STU004").firstName("Priya").lastName("Nair").email("priya.nair@ssis.edu").phone("+919876543213").dateOfBirth(LocalDate.of(2003, 11, 5)).gender("FEMALE").department("AIML").program("B.Tech").year(3).semester(6).enrollmentDate(LocalDate.of(2022, 8, 1)).address("Kochi, Kerala").status("ACTIVE").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build(),
                Student.builder().studentId("STU005").firstName("Rohan").lastName("Gupta").email("rohan.gupta@ssis.edu").phone("+919876543214").dateOfBirth(LocalDate.of(2002, 3, 18)).gender("MALE").department("CSE").program("B.Tech").year(4).semester(8).enrollmentDate(LocalDate.of(2021, 8, 1)).address("Delhi, India").status("ACTIVE").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build(),
                Student.builder().studentId("STU006").firstName("Sneha").lastName("Reddy").email("sneha.reddy@ssis.edu").phone("+919876543215").dateOfBirth(LocalDate.of(2004, 7, 30)).gender("FEMALE").department("EEE").program("B.Tech").year(2).semester(4).enrollmentDate(LocalDate.of(2023, 8, 1)).address("Hyderabad, Telangana").status("ACTIVE").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build(),
                Student.builder().studentId("STU007").firstName("Vikram").lastName("Singh").email("vikram.singh@ssis.edu").phone("+919876543216").dateOfBirth(LocalDate.of(2003, 9, 12)).gender("MALE").department("MECH").program("B.Tech").year(3).semester(5).enrollmentDate(LocalDate.of(2022, 8, 1)).address("Jaipur, Rajasthan").status("ACTIVE").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build(),
                Student.builder().studentId("STU008").firstName("Divya").lastName("Iyer").email("divya.iyer@ssis.edu").phone("+919876543217").dateOfBirth(LocalDate.of(2004, 4, 25)).gender("FEMALE").department("CSE").program("B.Tech").year(2).semester(3).enrollmentDate(LocalDate.of(2023, 8, 1)).address("Mumbai, Maharashtra").status("ACTIVE").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build(),
                Student.builder().studentId("STU009").firstName("Karthik").lastName("Rao").email("karthik.rao@ssis.edu").phone("+919876543218").dateOfBirth(LocalDate.of(2003, 2, 14)).gender("MALE").department("AIML").program("B.Tech").year(3).semester(6).enrollmentDate(LocalDate.of(2022, 8, 1)).address("Mysuru, Karnataka").status("ACTIVE").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build(),
                Student.builder().studentId("STU010").firstName("Meera").lastName("Kulkarni").email("meera.k@ssis.edu").phone("+919876543219").dateOfBirth(LocalDate.of(2002, 12, 8)).gender("FEMALE").department("CIVIL").program("B.Tech").year(4).semester(7).enrollmentDate(LocalDate.of(2021, 8, 1)).address("Pune, Maharashtra").status("ACTIVE").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build()
        );
        studentRepository.saveAll(demoStudents);
        log.info("Successfully seeded 10 student documents into MongoDB.");
    }

    private Student mapToEntity(StudentDTO dto) {
        return Student.builder()
                .studentId(dto.getStudentId())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender())
                .department(dto.getDepartment())
                .program(dto.getProgram())
                .year(dto.getYear())
                .semester(dto.getSemester())
                .enrollmentDate(dto.getEnrollmentDate() != null ? dto.getEnrollmentDate() : LocalDate.now())
                .address(dto.getAddress())
                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                .build();
    }

    private StudentResponseDTO mapToDTO(Student student) {
        return StudentResponseDTO.builder()
                .id(student.getId())
                .studentId(student.getStudentId())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .email(student.getEmail())
                .phone(student.getPhone())
                .dateOfBirth(student.getDateOfBirth())
                .gender(student.getGender())
                .department(student.getDepartment())
                .program(student.getProgram())
                .year(student.getYear())
                .semester(student.getSemester())
                .enrollmentDate(student.getEnrollmentDate())
                .address(student.getAddress())
                .status(student.getStatus())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }
}
