package com.ssis.reporting;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableAspectJAutoProxy
public class ReportingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReportingServiceApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  SSIS REPORTING SERVICE (SOAP & REST) STARTED");
        System.out.println("  SOAP Endpoint: http://localhost:8084/ws");
        System.out.println("  SOAP WSDL: http://localhost:8084/ws/studentReport.wsdl");
        System.out.println("=================================================");
    }
}
