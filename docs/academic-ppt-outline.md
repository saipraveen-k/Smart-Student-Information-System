# Academic Presentation Outline (14 Slides Alignment)

This document provides exact content for the 14-slide academic viva presentation of **Smart Student Information System (SSIS)**.

---

### Slide 1: Title Slide
- **Title**: SMART STUDENT INFORMATION SYSTEM
- **Subtitle**: A Scalable REST & SOAP-Based Microservices Solution
- **Presenter**: Senior Engineering Team / Undergraduate Project Demonstration
- **Stack**: Java 21, Spring Boot 3.3, Spring Data MongoDB, React, Spring Cloud Gateway, SOAP Web Services

### Slide 2: Abstract & Presentation Flow
- **Abstract**: Centralized university administration platform separating student management, course catalog, academic evaluation, and structured XML reporting into decoupled microservices backed by MongoDB document persistence.
- **Agenda**: Problem Statement, Existing System Limitations, Proposed Microservices Solution, Architecture, Demonstration, and Conclusion.

### Slide 3: Abstract
- Detailed explanation of how SSIS replaces legacy monolithic relational systems with an asynchronous, decoupled microservices topology, offering both REST APIs for web/mobile UI interaction and SOAP Web Services for enterprise accreditation reporting.

### Slide 4: Problem Statement
- Traditional university portals suffer from tightly coupled monolithic databases, rigid schema migration bottlenecks, lack of real-time performance analytics, and inability to integrate with external legacy systems expecting XML standards.

### Slide 5: Introduction
- SSIS provides unified management of students, courses, internal/external marks, CGPA calculations, and XML reporting.
- Utilizes MongoDB for schema flexibility and high-throughput document querying.

### Slide 6: Existing Systems
- Monolithic Java EE / PHP applications with centralized RDBMS (MySQL/Oracle).
- Hardcoded grading rules, manual report generation, and lack of API Gateway entry points.

### Slide 7: Limitations of Existing Systems
- Single point of failure.
- Tight database coupling.
- Slow reporting generation.
- Inability to scale student registration independently from course catalog browsing.

### Slide 8: Proposed System
- **Microservices Architecture**:
  1. API Gateway (Spring Cloud Gateway Port 8080)
  2. Student Service (Port 8081)
  3. Course Service (Port 8082)
  4. Academic Service (Port 8083)
  5. Reporting Service (SOAP & REST Port 8084)
- **Database**: MongoDB & MongoDB Compass.

### Slide 9: Advantages
- Scalable independent microservices.
- Dual protocol support: REST for UI speed, SOAP for XML enterprise reports.
- Real-time performance evaluation (Internal 40 + External 60 = 100 Marks → Dynamic CGPA).
- AOP logging & Jakarta Bean validation.

### Slide 10: Methodology & Modules
- **Module 1**: Student Profile & Department Management.
- **Module 2**: Course Catalog & Faculty Allocation.
- **Module 3**: Academic Record Evaluation & Grade Computation.
- **Module 4**: Contract-First SOAP Reporting Service.
- **Module 5**: React Dashboard & Visual Analytics.

### Slide 11: Technology Stack Alignment
- **Backend**: Java 21, Spring Boot 3.3, Spring Data MongoDB, Spring Web Services (Spring-WS), WSDL4J, Lombok.
- **Frontend**: React 18, Vite, Axios, Recharts, Lucide Icons.
- **APIs & Integration**: REST APIs, SOAP Web Services, Swagger OpenAPI 3.0, Postman.
- **Database**: MongoDB 8.0, MongoDB Compass.
- *(Note: RDBMS like MySQL, PostgreSQL, Hibernate, and JPA are intentionally omitted in alignment with MongoDB document persistence).*

### Slide 12: Conclusion
- SSIS successfully demonstrates a production-grade, runnable microservices architecture fulfilling academic requirements for REST CRUD operations, dynamic grading, MongoDB persistence, and WSDL SOAP web service integration.

### Slide 13: Future Scope
- OAuth2 / JWT Role-Based Access Control (RBAC).
- AI-based student performance drop prediction.
- Kafka-driven event notification service.
- Mobile application (Android / Flutter).

### Slide 14: Thank You
- Q&A & Live System Demonstration.
