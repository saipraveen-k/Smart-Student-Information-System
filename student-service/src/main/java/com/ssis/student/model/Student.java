package com.ssis.student.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "students")
public class Student {

    @Id
    private String id;

    @Indexed(unique = true)
    private String studentId;

    private String firstName;
    private String lastName;

    @Indexed(unique = true)
    private String email;

    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String department;
    private String program;
    private Integer year;
    private Integer semester;
    private LocalDate enrollmentDate;
    private String address;
    private String status; // ACTIVE, INACTIVE, GRADUATED, SUSPENDED

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
