# Smart Student Information System (SSIS)
> **A Scalable REST & SOAP-Based Microservices Solution**

SSIS is a complete, runnable, real-world microservices application designed for university administration, student academic evaluation, performance analytics, and structured XML reporting.

---

## 🚀 Architecture Overview

```text
                        ┌───────────────────────┐
                        │     React Frontend    │ (Port 3000)
                        └───────────┬───────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │      API Gateway      │ (Spring Cloud Gateway Port 8080)
                        └───────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
     ┌────────────────┐   ┌────────────────┐   ┌──────────────────┐
     │ Student Service│   │ Course Service │   │ Academic Service │
     │  (Port 8081)   │   │  (Port 8082)   │   │   (Port 8083)    │
     └───────┬────────┘   └───────┬────────┘   └────────┬─────────┘
             │                    │                     │
             ▼                    ▼                     ▼
       MongoDB Database      MongoDB Database       MongoDB Database
  (smart_student_information_system @ mongodb://localhost:27017)

                        ┌───────────────────────┐
                        │  Reporting Service    │ (Port 8084)
                        │ SOAP API & WSDL       │ (/ws/studentReport.wsdl)
                        └───────────┬───────────┘
                                    │
                                    ▼
                             MongoDB Database
```

---

## 🛠️ Technology Stack

- **Java Version**: Java 21 / OpenJDK 21
- **Framework**: Spring Boot 3.3.4
- **API Gateway**: Spring Cloud Gateway (Port 8080)
- **Database**: MongoDB 8.0 (Port 27017) & Spring Data MongoDB
- **Database GUI**: MongoDB Compass
- **SOAP Integration**: Spring Web Services (Spring-WS), WSDL4J, JAXB
- **OpenAPI / Swagger**: Springdoc OpenAPI v2.6.0
- **Frontend**: React 18, Vite, Axios, Recharts, Lucide Icons
- **Engineering**: Maven, Jakarta Bean Validation, Spring AOP Logging

---

## ⚡ Quick Start Guide (Local Execution)

### Step 1: Ensure MongoDB is running
Make sure MongoDB is running on `mongodb://localhost:27017`. Test using MongoDB Compass or `mongosh`:
```bash
mongosh --eval "db.adminCommand('ping')"
```

### Step 2: Build all backend microservices
Set your `JAVA_HOME` to JDK 21 and run Maven clean package:
```powershell
$env:JAVA_HOME="C:\Users\saipr\.jdks\jbr-21.0.11"
& "C:\Users\saipr\apache-maven-3.9.9\bin\mvn.cmd" clean package -DskipTests
```

### Step 3: Start Microservices
Run each JAR in a separate terminal:
```powershell
java -jar api-gateway/target/api-gateway-1.0.0.jar         # Port 8080
java -jar student-service/target/student-service-1.0.0.jar # Port 8081
java -jar course-service/target/course-service-1.0.0.jar   # Port 8082
java -jar academic-service/target/academic-service-1.0.0.jar # Port 8083
java -jar reporting-service/target/reporting-service-1.0.0.jar # Port 8084
```

### Step 4: Start React Frontend
In the `frontend` directory:
```powershell
cd frontend
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🔗 Key URLs & Documentation Links

- **React Dashboard**: [http://localhost:3000](http://localhost:3000)
- **API Gateway Base**: [http://localhost:8080](http://localhost:8080)
- **SOAP WSDL URL**: [http://localhost:8084/ws/studentReport.wsdl](http://localhost:8084/ws/studentReport.wsdl)
- **Student Service Swagger**: [http://localhost:8081/swagger-ui.html](http://localhost:8081/swagger-ui.html)
- **Course Service Swagger**: [http://localhost:8082/swagger-ui.html](http://localhost:8082/swagger-ui.html)
- **Academic Service Swagger**: [http://localhost:8083/swagger-ui.html](http://localhost:8083/swagger-ui.html)

---

## 📂 Project Structure

```text
smart-student-information-system/
├── api-gateway/          # Spring Cloud Gateway (8080)
├── student-service/      # Student CRUD & MongoDB Persistence (8081)
├── course-service/       # Course Catalog Microservice (8082)
├── academic-service/     # Academic Records & Performance CGPA Engine (8083)
├── reporting-service/    # SOAP Web Service & WSDL Generator (8084)
├── frontend/             # React + Vite Enterprise Administration Portal (3000)
├── postman/              # Postman Collection & Environment JSON
├── docs/                 # MongoDB Compass, API, SOAP, Architecture & PPT docs
├── docker-compose.yml    # Docker deployment manifest
└── README.md
```

---

## 📋 10-Minute Academic Presentation / Demonstration Sequence

1. **Start Database & Services**: Open MongoDB Compass (`mongodb://localhost:27017/smart_student_information_system`) and start all services.
2. **Dashboard**: Navigate to `http://localhost:3000`. Click **Seed / Reset Demo Data** to populate MongoDB.
3. **Student Directory**: Go to **Students** tab, search for `Sai`, create a new student `STU015`, and show the BSON document in MongoDB Compass.
4. **Academic Evaluation**: Go to **Academic Records**, add internal (35) + external (55) marks, and demonstrate real-time dynamic grade calculation (`90 -> O grade, 10 GP`).
5. **REST vs SOAP Showcase**: Go to **REST & SOAP Reports**, select student `STU001`, click **Execute Both Protocols**, and compare raw XML SOAP vs REST JSON responses side-by-side.
6. **Swagger UI & WSDL**: Open `http://localhost:8081/swagger-ui.html` and `http://localhost:8084/ws/studentReport.wsdl`.
7. **Postman Collection**: Import `postman/SSIS_Postman_Collection.json` and execute negative error tests (`404 Not Found`, `400 Invalid Email`).
