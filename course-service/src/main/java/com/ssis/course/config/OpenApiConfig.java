package com.ssis.course.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI courseServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SSIS - Course Microservice API")
                        .description("REST API for managing Course catalog, subjects, credits, and faculty allocations in Smart Student Information System.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("SSIS Engineering Team")
                                .email("admin@ssis.edu"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")));
    }
}
