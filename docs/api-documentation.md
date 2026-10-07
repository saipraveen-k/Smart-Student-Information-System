# REST API Reference Documentation

All REST APIs in **SSIS** are routed through the Spring Cloud API Gateway at `http://localhost:8080`.

---

## 1. Student Service Endpoints (`/api/students`)

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/students` | Create new student in MongoDB | `201 Created` |
| `GET` | `/api/students` | Retrieve all students | `200 OK` |
| `GET` | `/api/students/{studentId}` | Retrieve student by ID (e.g., `STU001`) | `200 OK` |
| `PUT` | `/api/students/{studentId}` | Update student details | `200 OK` |
| `DELETE` | `/api/students/{studentId}` | Delete student record | `200 OK` |
| `GET` | `/api/students/search?keyword=` | Search by ID, name, email, department | `200 OK` |
| `GET` | `/api/students/department/{dept}` | Filter students by department | `200 OK` |
| `GET` | `/api/students/status/{status}` | Filter students by status (`ACTIVE`, `INACTIVE`) | `200 OK` |
| `POST` | `/api/students/seed` | Seed initial demo data into MongoDB | `200 OK` |

---

## 2. Course Service Endpoints (`/api/courses`)

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/courses` | Create new course entry | `201 Created` |
| `GET` | `/api/courses` | Retrieve all course catalog entries | `200 OK` |
| `GET` | `/api/courses/{courseId}` | Get course by ID or code | `200 OK` |
| `PUT` | `/api/courses/{courseId}` | Update course metadata | `200 OK` |
| `DELETE` | `/api/courses/{courseId}` | Delete course entry | `200 OK` |
| `GET` | `/api/courses/search?keyword=` | Search courses by title, faculty, code | `200 OK` |
| `GET` | `/api/courses/department/{dept}` | Filter courses by department | `200 OK` |

---

## 3. Academic Record Service Endpoints (`/api/academic-records`)

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/academic-records` | Store internal/external marks & auto-compute grade | `201 Created` |
| `GET` | `/api/academic-records` | Retrieve all academic evaluation entries | `200 OK` |
| `GET` | `/api/academic-records/{recordId}` | Get academic record by ID (e.g. `AR001`) | `200 OK` |
| `GET` | `/api/academic-records/student/{studentId}` | Retrieve all course marks for student | `200 OK` |
| `GET` | `/api/academic-records/student/{studentId}/performance` | Compute CGPA, average marks & overall grade | `200 OK` |
| `GET` | `/api/academic-records/analytics/overview` | Compute system-wide grade distribution & stats | `200 OK` |
| `PUT` | `/api/academic-records/{recordId}` | Update marks & re-compute grades dynamically | `200 OK` |
| `DELETE` | `/api/academic-records/{recordId}` | Delete academic record | `200 OK` |

---

## 4. Error Responses

Invalid requests return structured JSON with global exception handling:

```json
{
  "timestamp": "2026-10-07T22:50:00",
  "status": 404,
  "error": "Student Not Found",
  "message": "Student STU9999 was not found",
  "path": "/api/students/STU9999"
}
```
