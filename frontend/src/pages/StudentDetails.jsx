import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentApi, academicApi, reportApi } from '../services/api';
import { 
  ArrowLeft, Award, FileText, Code, CheckCircle, 
  Clock, Copy, Check, RefreshCw, X, BookOpen, GraduationCap 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function StudentDetails() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [student, setStudent] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [soapXml, setSoapXml] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
      addToast('Error loading student profile from Student Microservice', 'error');
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
      addToast('SOAP XML Academic Report received from Port 8084', 'success');
    } catch (err) {
      console.error('Error generating SOAP report:', err);
      setSoapXml(`<Error>Failed to execute SOAP request to Reporting Service at http://localhost:8084/ws: ${err.message}</Error>`);
      addToast('Failed to execute SOAP request', 'error');
    } finally {
      setReportLoading(false);
    }
  };

  const handleCopyXml = () => {
    if (soapXml) {
      navigator.clipboard.writeText(soapXml);
      setCopied(true);
      addToast('SOAP XML payload copied to clipboard', 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading || !student) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <RefreshCw size={20} className="spin" style={{ margin: '0 auto 1rem', display: 'block' }} />
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading Student Profile...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <button 
        className="btn btn-secondary btn-sm" 
        style={{ marginBottom: '1.5rem' }} 
        onClick={() => navigate('/students')}
      >
        <ArrowLeft size={14} />
        <span>Back to Student Directory</span>
      </button>

      {/* Header Profile Info */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                {student.firstName} {student.lastName}
              </h1>
              <span className="badge badge-outline" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>
                {student.studentId}
              </span>
              <span className="badge">
                <span className="status-dot" style={{ width: 5, height: 5 }}></span>
                {student.status}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
              {student.program} in {student.department} • Year {student.year}, Semester {student.semester} • Enrolled {student.enrollmentDate}
            </p>
          </div>

          <button className="btn btn-primary btn-sm" onClick={handleGenerateSoapReport}>
            <FileText size={14} />
            <span>Generate SOAP Academic Report</span>
          </button>
        </div>
      </div>

      {/* Detail Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Personal Info */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Personal Information</div>
            <span className="badge badge-outline">STUDENT RECORD</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Email Address</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 500 }}>{student.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Phone</span>
              <span style={{ fontFamily: 'JetBrains Mono' }}>{student.phone || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Gender</span>
              <span>{student.gender}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Date of Birth</span>
              <span>{student.dateOfBirth}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Residential Address</span>
              <span style={{ textAlign: 'right' }}>{student.address}</span>
            </div>
          </div>
        </div>

        {/* Academic Performance KPI */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Cumulative Performance</div>
            <span className="badge badge-inverted">GPA ENGINE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Cumulative Grade Point (CGPA)</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'JetBrains Mono', color: 'var(--text-primary)' }}>
                {performance?.cumulativeGradePointAverage || 0.0} / 10.0
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Average Score</span>
              <span style={{ fontWeight: 600 }}>{performance?.averageMarks || 0}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Average Attendance</span>
              <span style={{ fontWeight: 600 }}>{performance?.averageAttendance || 0}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Evaluated Courses</span>
              <span style={{ fontFamily: 'JetBrains Mono' }}>{performance?.totalCourses || 0} subjects</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Performance Classification</span>
              <span className="badge badge-inverted">{performance?.overallPerformance || 'Evaluating'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluated Courses Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Evaluated Course Subjects</div>
            <div className="card-description">Internal and external marks dynamic breakdown</div>
          </div>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Course</th>
                <th>Credits</th>
                <th>Internal (40)</th>
                <th>External (60)</th>
                <th>Total (100)</th>
                <th>Grade</th>
                <th>Grade Point</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {performance?.academicRecords && performance.academicRecords.length > 0 ? (
                performance.academicRecords.map((r) => (
                  <tr key={r.recordId}>
                    <td style={{ fontFamily: 'JetBrains Mono' }}>{r.recordId}</td>
                    <td style={{ fontWeight: 600 }}>
                      {r.courseName || r.courseCode}
                      <span className="badge badge-outline" style={{ marginLeft: '0.5rem', fontFamily: 'JetBrains Mono' }}>
                        {r.courseCode}
                      </span>
                    </td>
                    <td>{r.credits} Credits</td>
                    <td>{r.internalMarks}</td>
                    <td>{r.externalMarks}</td>
                    <td style={{ fontWeight: 600 }}>{r.totalMarks}</td>
                    <td>
                      <span className={`grade-badge ${r.grade === 'O' ? 'grade-o' : ''}`}>
                        {r.grade}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{r.gradePoint}</td>
                    <td>{r.attendancePercentage}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
                    No academic course records found for this student.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SOAP Report Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Code size={18} />
                <span className="modal-title">SOAP XML Report — {student.studentId}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {soapXml && (
                  <button className="btn btn-secondary btn-sm" onClick={handleCopyXml}>
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy XML'}</span>
                  </button>
                )}
                <button 
                  className="btn btn-ghost btn-icon btn-sm" 
                  onClick={() => setShowReportModal(false)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="modal-body">
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <div>Endpoint: <code>POST http://localhost:8990/ws</code></div>
                <div>Namespace: <code>http://ssis.com/reporting/soap</code></div>
              </div>

              {reportLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <RefreshCw size={20} className="spin" style={{ margin: '0 auto 1rem', display: 'block' }} />
                  <div>Invoking Spring-WS SOAP endpoint...</div>
                </div>
              ) : (
                <pre className="code-viewer" style={{ maxHeight: '400px' }}>
                  {soapXml}
                </pre>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary btn-sm" onClick={() => setShowReportModal(false)}>
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
