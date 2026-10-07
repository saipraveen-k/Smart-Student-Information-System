# MongoDB & MongoDB Compass Administration Guide

This guide explains how to connect to, inspect, and manage the database for the **Smart Student Information System (SSIS)** using **MongoDB** and **MongoDB Compass GUI**.

---

## 1. Prerequisites

1. **MongoDB Community Server** (v6.0+ / v7.0+ / v8.0+) running locally on default port `27017`.
2. **MongoDB Compass GUI** installed on your workstation.

---

## 2. Connecting via MongoDB Compass

1. Open **MongoDB Compass**.
2. In the connection URI box, enter:
   ```text
   mongodb://localhost:27017
   ```
3. Click **Connect**.
4. In the left panel, locate the database:
   ```text
   smart_student_information_system
   ```

---

## 3. Collections & Schema Structure

The system automatically manages 3 primary collections in MongoDB:

### Collection 1: `students`
Stores student personal profiles, department, program, and status.

**Example Document:**
```json
{
  "_id": { "$oid": "66fb10a19e88b21a3c4f9a10" },
  "studentId": "STU001",
  "firstName": "Sai",
  "lastName": "Praveen",
  "email": "sai.praveen@ssis.edu",
  "phone": "+919876543210",
  "dateOfBirth": "2003-05-14",
  "gender": "MALE",
  "department": "AIML",
  "program": "B.Tech",
  "year": 3,
  "semester": 6,
  "enrollmentDate": "2022-08-01",
  "address": "Hyderabad, Telangana",
  "status": "ACTIVE",
  "createdAt": "2026-10-07T22:50:00",
  "updatedAt": "2026-10-07T22:50:00"
}
```

### Collection 2: `courses`
Stores the institutional subject catalog.

**Example Document:**
```json
{
  "_id": { "$oid": "66fb10a19e88b21a3c4f9b20" },
  "courseId": "C101",
  "courseCode": "AI201",
  "courseName": "Artificial Intelligence & Machine Learning",
  "description": "Fundamentals of AI, search algorithms, neural networks.",
  "department": "AIML",
  "credits": 4,
  "semester": 6,
  "facultyName": "Dr. Ramesh Sharma",
  "status": "ACTIVE"
}
```

### Collection 3: `academic_records`
Stores marks, attendance, dynamically calculated grades, and grade points.

**Example Document:**
```json
{
  "_id": { "$oid": "66fb10a19e88b21a3c4f9c30" },
  "recordId": "AR001",
  "studentId": "STU001",
  "courseId": "C101",
  "academicYear": "2024-2025",
  "semester": 6,
  "internalMarks": 36.0,
  "externalMarks": 56.0,
  "totalMarks": 92.0,
  "grade": "O",
  "gradePoint": 10.0,
  "attendancePercentage": 95.0,
  "remarks": "Excellent mastery in AI algorithms"
}
```

---

## 4. Indexes & Performance Optimization

In MongoDB Compass, navigate to the **Indexes** tab for each collection to verify:
1. `students`: Unique index on `studentId` and `email`.
2. `courses`: Unique index on `courseId` and `courseCode`.
3. `academic_records`: Unique index on `recordId`, and compound index on `{ studentId: 1, courseId: 1, semester: 1 }`.

---

## 5. Live Inspection during Project Demonstration

During your laboratory demonstration:
1. Register a new student via the React UI or Postman.
2. In MongoDB Compass, press **Refresh Data** (`Ctrl + R`).
3. Point out the newly inserted MongoDB BSON document to your evaluator.
