import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react'
import { studentApi, academicApi, reportApi } from '../services/api';
import { ArrowLeft, Award, FileText, Code, CheckCircle, Clock } from 'lucide-react';

export default function StudentDetails() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [soapXml, setSoapXml] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const loadStudentData = async () => {
    setLoading(true);
    try {
      const [sRes, pRes] = await Promise.all([
        studentApi.getById(studentId),
        academicApi.getStudentPerformance(studentId)
      ]);
      setStudent(sRes.data.data);
      setPerformance(pRes.data.data);
    } catch (err) {
      console.error('Error loading student details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentData();
  }, [studentId]);

  const handleGenerateSoapReport = async () => {
    setReportLoading(true);
    setShowReportModal(true);
    try {
      const xmlResponse = await reportApi.getSoapReport(studentId);
      setSoapXml(xmlResponse);
    } catch (err) {
      console.error('Error generating SOAP report:', err);
      setSoapXml('<Error>Failed to execute SOAP request to Reporting Service at http://localhost:8084/ws</Error>');
    } finally {
      setReportLoading(false);
    }
  };

  if (loading || !student) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Student Profile...</div>;
  }

  return (
    <div>
      <button className="btn btn-secondary" style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/students')}>
        <ArrowLeft size={16} /> Back to Student List
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{student.firstName} {student.lastName}</h1>
            <span className="badge badge-info" style={{ fontSize: '0.9rem' }}>{student.studentId}</span>
            <span className={`badge ${student.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
              {student.status}
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
            {student.program} in {student.department} • Year {student.year}, Semester {student.semester}
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleGenerateSoapReport}>
          <FileText size={16} /> Generate SOAP Academic Report
        </button>
      </div>

      {/* Grid Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Personal Details
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
            <div><strong>Email:</strong> {student.email}</div>
            <div><strong>Phone:</strong> {student.phone || 'N/A'}</div>
            <div><strong>Gender:</strong> {student.gender}</div>
            <div><strong>Date of Birth:</strong> {student.dateOfBirth}</div>
            <div><strong>Address:</strong> {student.address}</div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Academic Performance
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
            <div><strong>Cumulative GPA:</strong> <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.2rem' }}>{performance?.cumulativeGradePointAverage || 0.0}</span> / 10.0</div>
            <div><strong>Average Marks:</strong> {performance?.averageMarks || 0}%</div>
            <div><strong>Overall Performance:</strong> <span className="badge badge-success">{performance?.overallPerformanceGrade || 'N/A'}</span></div>
            <div><strong>Average Attendance:</strong> {performance?.averageAttendance || 0}%</div>
            <div><strong>Courses Evaluated:</strong> {performance?.totalCoursesCompleted || 0}</div>
          </div>
        </div>
      </div>

      {/* Course Breakdown Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Subject-wise Marks & Evaluation</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Course ID</th>
                <th>Academic Year</th>
                <th>Semester</th>
                <th>Internal (40)</th>
                <th>External (60)</th>
                <th>Total (100)</th>
                <th>Grade</th>
                <th>Grade Point</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {performance?.records?.map(rec => (
                <tr key={rec.recordId}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary-accent)' }}>{rec.recordId}</td>
                  <td style={{ fontWeight: 600 }}>{rec.courseId}</td>
                  <td>{rec.academicYear}</td>
                  <td>Sem {rec.semester}</td>
                  <td>{rec.internalMarks}</td>
                  <td>{rec.externalMarks}</td>
                  <td style={{ fontWeight: 700 }}>{rec.totalMarks}</td>
                  <td><span className="badge badge-success">{rec.grade}</span></td>
                  <td style={{ fontWeight: 700 }}>{rec.gradePoint}</td>
                  <td>{rec.attendancePercentage}%</td>
                </tr>
              ))}
              {(!performance?.records || performance.records.length === 0) && (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No academic records registered for this student yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SOAP Report Modal */}
      {showReportModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Code size={20} color="var(--primary-accent)" /> SOAP Web Service Response
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Returned from Spring-WS endpoint <code>http://localhost:8084/ws</code> using MongoDB live data
                </p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowReportModal(false)}>✕</button>
            </div>

            {reportLoading ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>Generating XML SOAP Report...</div>
            ) : (
              <div>
                <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                  <span className="badge badge-success"><CheckCircle size={12} /> 200 OK</span>
                  <span className="badge badge-info">Content-Type: text/xml</span>
                </div>
                <pre className="code-preview">
                  {soapXml}
                </pre>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button className="btn btn-secondary" onClick={() => setShowReportModal(false)}>Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
