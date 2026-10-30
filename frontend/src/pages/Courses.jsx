import React, { useEffect, useState } from 'react';
import { courseApi } from '../services/api';
import { 
  Search, Plus, Edit2, Trash2, Filter, 
  X, Check, ChevronLeft, ChevronRight, RefreshCw, BookOpen 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    courseId: '',
    courseCode: '',
    courseName: '',
    description: '',
    department: 'CSE',
    credits: 4,
    semester: 4,
    facultyName: '',
    status: 'ACTIVE'
  });

  const loadCourses = async () => {
    setLoading(true);
    try {
      let res;
      if (searchKeyword.trim()) {
        res = await courseApi.search(searchKeyword);
      } else if (selectedDepartment !== 'ALL') {
        res = await courseApi.getByDepartment(selectedDepartment);
      } else {
        res = await courseApi.getAll();
      }
      setCourses(res.data.data || []);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error loading courses:', err);
      addToast('Error loading courses from Course Microservice', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [selectedDepartment]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadCourses();
  };

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        courseId: course.courseId,
        courseCode: course.courseCode,
        courseName: course.courseName,
        description: course.description || '',
        department: course.department || 'CSE',
        credits: course.credits || 4,
        semester: course.semester || 4,
        facultyName: course.facultyName || '',
        status: course.status || 'ACTIVE'
      });
    } else {
      setEditingCourse(null);
      const nextNum = 100 + courses.length + 1;
      setFormData({
        courseId: `C${nextNum}`,
        courseCode: `CS${200 + courses.length + 1}`,
        courseName: '',
        description: '',
        department: 'CSE',
        credits: 4,
        semester: 4,
        facultyName: 'Dr. Faculty Member',
        status: 'ACTIVE'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCourse) {
        await courseApi.update(editingCourse.courseId, formData);
        addToast(`Course ${formData.courseCode} updated successfully`, 'success');
      } else {
        await courseApi.create(formData);
        addToast(`Course ${formData.courseCode} added to catalog`, 'success');
      }
      setShowModal(false);
      loadCourses();
    } catch (err) {
      console.error('Error saving course:', err);
      addToast('Error saving course: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm(`Are you sure you want to permanently delete course ${courseId}?`)) {
      try {
        await courseApi.delete(courseId);
        addToast(`Course ${courseId} deleted successfully`, 'success');
        loadCourses();
      } catch (err) {
        console.error('Error deleting course:', err);
        addToast('Error deleting course: ' + (err.response?.data?.message || err.message), 'error');
      }
    }
  };

  // Pagination calculation
  const totalPages = Math.ceil(courses.length / itemsPerPage) || 1;
  const paginatedCourses = courses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Course Catalog & Curriculum
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Accredited syllabus, credit weighting, and faculty allocations managed on Course Microservice Port 8082.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={loadCourses}
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
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem' }}>
        <div className="filter-bar" style={{ margin: 0 }}>
          <form onSubmit={handleSearch} style={{ flex: 1, minWidth: '260px' }}>
            <div className="search-wrapper">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                className="form-input search-input"
                placeholder="Search courses by code, title, or instructor..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              {searchKeyword && (
                <button 
                  type="button" 
                  className="search-clear" 
                  onClick={() => { setSearchKeyword(''); loadCourses(); }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </form>

          <div className="filter-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter size={14} style={{ color: 'var(--text-muted)' }} />
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: '160px' }}
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="ALL">All Departments</option>
                <option value="AIML">AIML</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Data Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Credits</th>
              <th>Faculty Instructor</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <RefreshCw size={15} className="spin" />
                    <span>Loading courses from Course Microservice...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedCourses.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <div className="empty-state">
                    <div className="empty-state-icon"><BookOpen size={22} /></div>
                    <div className="empty-state-title">No Courses Found</div>
                    <div className="empty-state-desc">No course offerings match your filter or search query.</div>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleOpenModal()}>
                      <Plus size={13} />
                      <span>Create New Course</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedCourses.map((c) => (
                <tr key={c.courseId}>
                  <td>
                    <span className="badge badge-outline" style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
                      {c.courseCode}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {c.courseName}
                    {c.description && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, marginTop: '0.15rem' }}>
                        {c.description}
                      </div>
                    )}
                  </td>
                  <td>{c.department}</td>
                  <td>Semester {c.semester}</td>
                  <td>
                    <span className="badge badge-inverted" style={{ fontFamily: 'JetBrains Mono' }}>
                      {c.credits} Credits
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {c.facultyName || 'Department Faculty'}
                  </td>
                  <td>
                    <span className="badge">
                      <span className="status-dot" style={{ width: 5, height: 5 }}></span>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => handleOpenModal(c)}
                        title="Edit Course"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => handleDelete(c.courseId)}
                        title="Delete Course"
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
        {courses.length > 0 && (
          <div className="pagination-container">
            <div>
              Showing <strong>{((currentPage - 1) * itemsPerPage) + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, courses.length)}</strong> of <strong>{courses.length}</strong> courses
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

      {/* Add / Edit Course Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => !submitting && setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                {editingCourse ? `Edit Course: ${editingCourse.courseCode}` : 'Add Course Offering'}
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Course ID</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.courseId}
                      onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                      disabled={!!editingCourse}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Course Code</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. AI201"
                      value={formData.courseCode}
                      onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Course Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Distributed Operating Systems"
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Course Description</label>
                  <textarea
                    rows="2"
                    className="form-textarea"
                    placeholder="Key topics, prerequisites, and learning outcomes..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select
                      className="form-select"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value="AIML">AIML</option>
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="MECH">MECH</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Credits</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      className="form-input"
                      value={formData.credits}
                      onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 1 })}
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
                </div>

                <div className="form-group">
                  <label className="form-label">Assigned Faculty / Instructor</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Dr. Jane Smith"
                    value={formData.facultyName}
                    onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
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
                  {submitting ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
