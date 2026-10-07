package com.ssis.academic;

import com.ssis.academic.service.AcademicRecordService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableAspectJAutoProxy
public class AcademicServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AcademicServiceApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  SSIS ACADEMIC SERVICE STARTED ON PORT 8083");
        System.out.println("=================================================");
    }

    @Bean
    public CommandLineRunner initData(AcademicRecordService academicRecordService) {
        return args -> {
            academicRecordService.seedDemoDataIfEmpty();
        };
    }
}
