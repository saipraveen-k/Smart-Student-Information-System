# SOAP Web Service Integration Guide

The **Reporting Service** in SSIS demonstrates contract-first **SOAP Web Service** integration alongside REST APIs.

---

## 1. SOAP Specifications

- **Protocol**: SOAP 1.1 / HTTP POST
- **SOAP Endpoint URL**: `http://localhost:8080/ws` (via Gateway) or `http://localhost:8084/ws` (Direct)
- **WSDL URL**: `http://localhost:8080/ws/studentReport.wsdl` or `http://localhost:8084/ws/studentReport.wsdl`
- **Target Namespace**: `http://ssis.com/reporting/soap`
- **Content-Type**: `text/xml;charset=UTF-8`

---

## 2. Example SOAP Request XML

**Operation**: `getStudentReport`

```xml
<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:soap="http://ssis.com/reporting/soap">
   <soapenv:Header/>
   <soapenv:Body>
      <soap:getStudentReportRequest>
         <soap:studentId>STU001</soap:studentId>
      </soap:getStudentReportRequest>
   </soapenv:Body>
</soapenv:Envelope>
```

---

## 3. Example Structured SOAP Response XML

```xml
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
   <SOAP-ENV:Header/>
   <SOAP-ENV:Body>
      <ns2:getStudentReportResponse xmlns:ns2="http://ssis.com/reporting/soap">
         <ns2:studentReport>
            <ns2:studentId>STU001</ns2:studentId>
            <ns2:studentName>Sai Praveen</ns2:studentName>
            <ns2:email>sai.praveen@ssis.edu</ns2:email>
            <ns2:department>AIML</ns2:department>
            <ns2:program>B.Tech</ns2:program>
            <ns2:year>3</ns2:year>
            <ns2:semester>6</ns2:semester>
            <ns2:status>ACTIVE</ns2:status>
            <ns2:academicRecords>
               <ns2:record>
                  <ns2:recordId>AR001</ns2:recordId>
                  <ns2:courseCode>AI201</ns2:courseCode>
                  <ns2:courseName>Artificial Intelligence &amp; Machine Learning</ns2:courseName>
                  <ns2:credits>4</ns2:credits>
                  <ns2:internalMarks>36.0</ns2:internalMarks>
                  <ns2:externalMarks>56.0</ns2:externalMarks>
                  <ns2:totalMarks>92.0</ns2:totalMarks>
                  <ns2:grade>O</ns2:grade>
                  <ns2:gradePoint>10.0</ns2:gradePoint>
               </ns2:record>
            </ns2:academicRecords>
            <ns2:totalCourses>3</ns2:totalCourses>
            <ns2:averageMarks>91.67</ns2:averageMarks>
            <ns2:cumulativeGradePointAverage>9.67</ns2:cumulativeGradePointAverage>
            <ns2:overallPerformance>Distinction / Outstanding</ns2:overallPerformance>
            <ns2:generatedAt>2026-10-07 22:50:00</ns2:generatedAt>
         </ns2:studentReport>
      </ns2:getStudentReportResponse>
   </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```

---

## 4. Why REST vs SOAP in Enterprise Architectures?

1. **REST APIs**: Lightweight, JSON-native, easy to consume in web browsers & mobile applications, used for high-frequency CRUD operations.
2. **SOAP Web Services**: Strongly typed XML contract with strict XSD schema validation, transactional security, ideal for enterprise institutional reporting and cross-organization verification system integrations.
