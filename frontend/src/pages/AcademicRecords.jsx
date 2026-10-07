import React, { useEffect, useState } from 'react';
import { academicApi, studentApi, courseApi } from '../services/api';
import { Plus, Edit, Trash2, Award, Calculator } from 'lucide-react';

export default function AcademicRecords() {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [formData, setFormData] = useState({
    recordId: '',
    studentId: 'STU001',
    courseId: 'C101',
    academicYear: '2024-2025',
    semester: 6,
    internalMarks: 30.0,
    externalMarks: 50.0,
    attendancePercentage: 90.0,
    remarks: 'Good progress'
  });

  // Calculate live preview totals and grades
  const totalMarksPreview = (parseFloat(formData.internalMarks) || 0) + (parseFloat(formData.externalMarks) || 0);

  const getGradePreview = (total) => {
    if (total >= 90) return { grade: 'O', gp: 10 };
    if (total >= 80) return { grade: 'A+', gp: 9 };
    if (total >= 70) return { grade: 'A', gp: 8 };
    if (total >= 60) return { grade: 'B+', gp: 7 };
    if (total >= 50) return { grade: 'B', gp: 6 };
    if (total >= 40) return { grade: 'C', gp: 5 };
    return { grade: 'F', gp: 0 };
  };

  const previewGrading = getGradePreview(totalMarksPreview);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recRes, stuRes, crsRes] = await Promise.all([
        academicApi.getAll(),
        studentApi.getAll(),
        courseApi.getAll()
      ]);
      setRecords(recRes.data.data || []);
      setStudents(stuRes.data.data || []);
      setCourses(crsRes.data.data || []);
    } catch (err) {
      console.error('Error loading academic records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (record = null) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        recordId: record.recordId,
        studentId: record.studentId,
        courseId: record.courseId,
        academicYear: record.academicYear,
        semester: record.semester,
        internalMarks: record.internalMarks,
        externalMarks: record.externalMarks,
        attendancePercentage: record.attendancePercentage || 85.0,
        remarks: record.remarks || ''
      });
    } else {
      setEditingRecord(null);
      const nextId = `AR${String(records.length + 1).padStart(3, '0')}`;
      setFormData({
        recordId: nextId,
        studentId: students.length > 0 ? students[0].studentId : 'STU001',
        courseId: courses.length > 0 ? courses[0].courseId : 'C101',
        academicYear: '2024-2025',
        semester: 6,
        internalMarks: 32.0,
        externalMarks: 52.0,
        attendancePercentage: 92.0,
        remarks: 'Excellent performance'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRecord) {
        await academicApi.update(editingRecord.recordId, formData);
      } else {
        await academicApi.create(formData);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      alert('Error saving record: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (recordId) => {
    if (window.confirm(`Are you sure you want to delete academic record ${recordId}?`)) {
      try {
        await academicApi.delete(recordId);
        loadData();
      } catch (err) {
        alert('Error deleting record: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Academic Records & Grades</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Store student marks and compute grades dynamically in MongoDB
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={16} /> Add Academic Record
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Student ID</th>
                <th>Course ID</th>
                <th>Academic Year</th>
                <th>Sem</th>
                <th>Internal (40)</th>
                <th>External (60)</th>
                <th>Total (100)</th>
                <th>Grade</th>
                <th>GP</th>
                <th>Attendance</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.recordId}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary-accent)', fontWeight: 600 }}>{r.recordId}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{r.studentId}</td>
                  <td style={{ fontWeight: 600 }}>{r.courseId}</td>
                  <td>{r.academicYear}</td>
                  <td>Sem {r.semester}</td>
                  <td>{r.internalMarks}</td>
                  <td>{r.externalMarks}</td>
                  <td style={{ fontWeight: 800, color: '#38bdf8' }}>{r.totalMarks}</td>
                  <td><span className="badge badge-success">{r.grade}</span></td>
                  <td style={{ fontWeight: 700 }}>{r.gradePoint}</td>
                  <td>{r.attendancePercentage}%</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleOpenModal(r)}>
                        <Edit size={14} />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.recordId)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {records.length === 0 && !loading && (
                <tr>
                  <td colSpan="12" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No academic records available in MongoDB.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {editingRecord ? 'Edit Academic Record' : 'Add Academic Marks'}
              </h2>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Record ID</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.recordId}
                    onChange={(e) => setFormData({ ...formData, recordId: e.target.value })}
                    required
                    disabled={!!editingRecord}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Academic Year</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Select Student</label>
                  <select
                    className="form-select"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    required
                  >
                    {students.map(s => (
                      <option key={s.studentId} value={s.studentId}>
                        {s.studentId} - {s.firstName} {s.lastName} ({s.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Select Course</label>
                  <select
                    className="form-select"
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    required
                  >
                    {courses.map(c => (
                      <option key={c.courseId} value={c.courseId}>
                        {c.courseId} ({c.courseCode}) - {c.courseName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    className="form-input"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Attendance (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    className="form-input"
                    value={formData.attendancePercentage}
                    onChange={(e) => setFormData({ ...formData, attendancePercentage: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Internal Marks (Max 40)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="40"
                    className="form-input"
                    value={formData.internalMarks}
                    onChange={(e) => setFormData({ ...formData, internalMarks: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">External Marks (Max 60)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="60"
                    className="form-input"
                    value={formData.externalMarks}
                    onChange={(e) => setFormData({ ...formData, externalMarks: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>

              {/* Dynamic Calculation Live Box */}
              <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', margin: '1rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-accent)', fontWeight: 700, marginBottom: '0.5rem' }}>
                  <Calculator size={18} /> Real-Time Performance Calculation Preview
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Calculated Total</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{totalMarksPreview} / 100</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Assigned Grade</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>{previewGrading.grade}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Grade Point</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#60a5fa' }}>{previewGrading.gp}</div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Remarks</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Academic Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
