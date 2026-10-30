import React, { useEffect, useState } from 'react';
import { academicApi, studentApi, courseApi } from '../services/api';
import { 
  Plus, Edit2, Trash2, Award, Calculator, 
  Search, Filter, X, RefreshCw, ChevronLeft, ChevronRight, GraduationCap 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function AcademicRecords() {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Filters & Search
  const [searchStudentId, setSearchStudentId] = useState('ALL');
  const [searchCourseId, setSearchCourseId] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    recordId: '',
    studentId: 'STU001',
    courseId: 'C101',
    academicYear: '2024-2025',
    semester: 6,
    internalMarks: 30.0,
    externalMarks: 50.0,
    attendancePercentage: 90.0,
    remarks: 'Satisfactory performance'
  });

  // Calculate live preview totals and grades
  const totalMarksPreview = (parseFloat(formData.internalMarks) || 0) + (parseFloat(formData.externalMarks) || 0);

  const getGradePreview = (total) => {
    if (total >= 90) return { grade: 'O', gp: 10.0, status: 'Distinction' };
    if (total >= 80) return { grade: 'A+', gp: 9.0, status: 'Excellent' };
    if (total >= 70) return { grade: 'A', gp: 8.0, status: 'Very Good' };
    if (total >= 60) return { grade: 'B+', gp: 7.0, status: 'Good' };
    if (total >= 50) return { grade: 'B', gp: 6.0, status: 'Above Average' };
    if (total >= 40) return { grade: 'C', gp: 5.0, status: 'Average' };
    return { grade: 'F', gp: 0.0, status: 'Fail' };
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
      setCurrentPage(1);
    } catch (err) {
      console.error('Error loading academic records:', err);
      addToast('Error fetching records from Academic Microservice', 'error');
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
        remarks: 'Excellent mastery in coursework'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingRecord) {
        await academicApi.update(editingRecord.recordId, formData);
        addToast(`Academic Record ${formData.recordId} updated`, 'success');
      } else {
        await academicApi.create(formData);
        addToast(`New Academic Record ${formData.recordId} evaluated`, 'success');
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error('Error saving record:', err);
      addToast('Error saving academic record: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (recordId) => {
    if (window.confirm(`Are you sure you want to delete evaluation record ${recordId}?`)) {
      try {
        await academicApi.delete(recordId);
        addToast(`Record ${recordId} deleted successfully`, 'success');
        loadData();
      } catch (err) {
        console.error('Error deleting record:', err);
        addToast('Error deleting record: ' + (err.response?.data?.message || err.message), 'error');
      }
    }
  };

  // Filter records
  const filteredRecords = records.filter(r => {
    if (searchStudentId !== 'ALL' && r.studentId !== searchStudentId) return false;
    if (searchCourseId !== 'ALL' && r.courseId !== searchCourseId) return false;
    return true;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Academic Records & Evaluations
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Continuous assessment, end-semester marks, dynamic CGPA and letter grade grading engine.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw size={13} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => handleOpenModal()}
          >
            <Plus size={14} />
            <span>Record Evaluation</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem' }}>
        <div className="filter-bar" style={{ margin: 0 }}>
          <div className="filter-group" style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter size={14} style={{ color: 'var(--text-muted)' }} />
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: '180px' }}
                value={searchStudentId}
                onChange={(e) => setSearchStudentId(e.target.value)}
              >
                <option value="ALL">All Students ({students.length})</option>
                {students.map(s => (
                  <option key={s.studentId} value={s.studentId}>
                    {s.studentId} — {s.firstName} {s.lastName}
                  </option>
                ))}
              </select>
            </div>

            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '180px' }}
              value={searchCourseId}
              onChange={(e) => setSearchCourseId(e.target.value)}
            >
              <option value="ALL">All Courses ({courses.length})</option>
              {courses.map(c => (
                <option key={c.courseId} value={c.courseId}>
                  {c.courseCode} — {c.courseName}
                </option>
              ))}
            </select>
          </div>

          {(searchStudentId !== 'ALL' || searchCourseId !== 'ALL') && (
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => { setSearchStudentId('ALL'); setSearchCourseId('ALL'); }}
            >
              <X size={13} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Academic Records Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Student</th>
              <th>Course Subject</th>
              <th>Internal (40)</th>
              <th>External (60)</th>
              <th>Total Marks</th>
              <th>Grade</th>
              <th>Grade Point</th>
              <th>Attendance</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <RefreshCw size={15} className="spin" />
                    <span>Loading evaluations from Academic Microservice...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan="10">
                  <div className="empty-state">
                    <div className="empty-state-icon"><GraduationCap size={22} /></div>
                    <div className="empty-state-title">No Academic Records</div>
                    <div className="empty-state-desc">No examination evaluation records match your filter criteria.</div>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleOpenModal()}>
                      <Plus size={13} />
                      <span>Record First Evaluation</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRecords.map((r) => (
                <tr key={r.recordId}>
                  <td>
                    <span className="badge badge-outline" style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
                      {r.recordId}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.studentName || r.studentId}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                      {r.studentId}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{r.courseName || r.courseCode}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                      {r.courseCode} • Sem {r.semester}
                    </div>
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono' }}>{r.internalMarks}</td>
                  <td style={{ fontFamily: 'JetBrains Mono' }}>{r.externalMarks}</td>
                  <td>
                    <strong style={{ fontFamily: 'JetBrains Mono', fontSize: '0.9rem' }}>{r.totalMarks}</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}> / 100</span>
                  </td>
                  <td>
                    <span className={`grade-badge ${r.grade === 'O' ? 'grade-o' : ''}`}>
                      {r.grade}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
                    {r.gradePoint}
                  </td>
                  <td>{r.attendancePercentage}%</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => handleOpenModal(r)}
                        title="Edit Marks"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => handleDelete(r.recordId)}
                        title="Delete Record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Minimalist Pagination */}
        {filteredRecords.length > 0 && (
          <div className="pagination-container">
            <div>
              Showing <strong>{((currentPage - 1) * itemsPerPage) + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredRecords.length)}</strong> of <strong>{filteredRecords.length}</strong> evaluation records
            </div>
            <div className="pagination-controls">
              <button
                className="btn btn-secondary btn-sm btn-icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                title="Previous page"
              >
                <ChevronLeft size={14} />
              </button>
              <span style={{ padding: '0 0.5rem', fontWeight: 600 }}>
                {currentPage} / {totalPages}
              </span>
              <button
                className="btn btn-secondary btn-sm btn-icon"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                title="Next page"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Evaluation Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => !submitting && setShowModal(false)}>
          <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                {editingRecord ? `Update Evaluation: ${editingRecord.recordId}` : 'Enter Academic Evaluation'}
              </div>
              <button
                className="btn btn-ghost btn-icon btn-sm"
                onClick={() => setShowModal(false)}
                disabled={submitting}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Dynamic Calculation Live Banner */}
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calculator size={18} />
                    <div>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Dynamic Evaluation Engine
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                        Internal ({formData.internalMarks || 0}) + External ({formData.externalMarks || 0}) = {totalMarksPreview} / 100
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Computed Grade</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{previewGrading.status}</div>
                    </div>
                    <span className={`grade-badge ${previewGrading.grade === 'O' ? 'grade-o' : ''}`} style={{ fontSize: '1.1rem', padding: '0.25rem 0.6rem' }}>
                      {previewGrading.grade}
                    </span>
                    <span className="badge badge-outline" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.9rem' }}>
                      {previewGrading.gp} GP
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Record ID</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.recordId}
                      onChange={(e) => setFormData({ ...formData, recordId: e.target.value })}
                      disabled={!!editingRecord}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Student</label>
                    <select
                      className="form-select"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      required
                    >
                      {students.map(s => (
                        <option key={s.studentId} value={s.studentId}>
                          {s.studentId} — {s.firstName} {s.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Course Subject</label>
                    <select
                      className="form-select"
                      value={formData.courseId}
                      onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                      required
                    >
                      {courses.map(c => (
                        <option key={c.courseId} value={c.courseId}>
                          {c.courseCode} — {c.courseName}
                        </option>
                      ))}
                    </select>
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

                  <div className="form-group">
                    <label className="form-label">Semester</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      className="form-input"
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Attendance Percentage (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      className="form-input"
                      value={formData.attendancePercentage}
                      onChange={(e) => setFormData({ ...formData, attendancePercentage: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Internal Continuous Marks (Max 40)</label>
                    <input
                      type="number"
                      min="0"
                      max="40"
                      step="0.5"
                      className="form-input"
                      value={formData.internalMarks}
                      onChange={(e) => setFormData({ ...formData, internalMarks: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">External Examination Marks (Max 60)</label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      step="0.5"
                      className="form-input"
                      value={formData.externalMarks}
                      onChange={(e) => setFormData({ ...formData, externalMarks: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '0.5rem' }}>
                  <label className="form-label">Faculty Evaluator Remarks</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Completed laboratory assessment and capstone presentation"
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Calculating...' : editingRecord ? 'Update Record' : 'Record & Compute Grades'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
