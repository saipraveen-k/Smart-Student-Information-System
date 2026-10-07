package com.ssis.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  SSIS API GATEWAY STARTED ON PORT 8080");
        System.out.println("=================================================");
    }
}
