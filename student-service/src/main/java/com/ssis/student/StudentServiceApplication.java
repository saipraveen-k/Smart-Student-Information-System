package com.ssis.student;

import com.ssis.student.service.StudentService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableAspectJAutoProxy
public class StudentServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentServiceApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  SSIS STUDENT SERVICE STARTED ON PORT 8081");
        System.out.println("=================================================");
    }

    @Bean
    public CommandLineRunner initData(StudentService studentService) {
        return args -> {
            studentService.seedDemoDataIfEmpty();
        };
    }
}
