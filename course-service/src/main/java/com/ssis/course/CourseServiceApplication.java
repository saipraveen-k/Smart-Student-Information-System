package com.ssis.course;

import com.ssis.course.service.CourseService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableAspectJAutoProxy
public class CourseServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CourseServiceApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  SSIS COURSE SERVICE STARTED ON PORT 8082");
        System.out.println("=================================================");
    }

    @Bean
    public CommandLineRunner initData(CourseService courseService) {
        return args -> {
            courseService.seedDemoDataIfEmpty();
        };
    }
}
