# System Architecture Documentation

The **Smart Student Information System (SSIS)** is built as a modular microservices solution on Java 21, Spring Boot 3.3, Spring Data MongoDB, and React.

---

## 1. System Topology & Request Flows

```mermaid
graph TD
    Client[React Web Frontend / Postman / SOAP Client] -->|HTTP / REST / SOAP| Gateway[Spring Cloud API Gateway :8080]
    
    Gateway -->|/api/students/**| StudentService[Student Microservice :8081]
    Gateway -->|/api/courses/**| CourseService[Course Microservice :8082]
    Gateway -->|/api/academic-records/**| AcademicService[Academic Record Microservice :8083]
    Gateway -->|/ws/** & /api/reports/**| ReportingService[Reporting Service SOAP & REST :8084]

    StudentService -->|Spring Data Mongo| Mongo[MongoDB Database: smart_student_information_system]
    CourseService -->|Spring Data Mongo| Mongo
    AcademicService -->|Spring Data Mongo| Mongo
    ReportingService -->|MongoTemplate Query| Mongo
```

---

## 2. REST Request Sequence Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as React UI / User
    participant Gateway as API Gateway (8080)
    participant Service as Student Service (8081)
    participant AOP as AOP Logging Aspect
    participant DB as MongoDB (27017)

    User->>Gateway: POST /api/students (JSON Payload)
    Gateway->>Service: Forward request to /api/students
    Service->>AOP: Intercept method entry & args
    Service->>Service: Bean Validation (@Valid @Email @Pattern)
    Service->>DB: mongoTemplate.save(student)
    DB-->>Service: Return BSON document
    Service->>AOP: Log execution duration (ms)
    Service-->>Gateway: HTTP 201 Created (JSON Response)
    Gateway-->>User: Return Student Data to React UI
```

---

## 3. SOAP Request Sequence Flow

```mermaid
sequenceDiagram
    autonumber
    actor Client as SOAP Client / UI Reports Page
    participant Gateway as API Gateway (8080)
    participant WS as Reporting Service (8084)
    participant DB as MongoDB (27017)

    Client->>Gateway: POST /ws (SOAP XML Envelope)
    Gateway->>WS: Forward to MessageDispatcherServlet
    WS->>WS: Validate XML against studentReport.xsd
    WS->>DB: Query 'students', 'courses', 'academic_records'
    DB-->>WS: Return raw document collections
    WS->>WS: Calculate CGPA, avg marks, grade points, overall performance
    WS-->>Gateway: Return SOAP Response Envelope XML
    Gateway-->>Client: HTTP 200 OK (XML)
```
