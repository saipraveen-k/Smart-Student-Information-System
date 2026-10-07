import React, { useEffect, useState } from 'react';
import { courseApi } from '../services/api';
import { Search, Plus, Edit, Trash2, Filter } from 'lucide-react';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

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
    } catch (err) {
      console.error('Error loading courses:', err);
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
      const nextId = `C${100 + courses.length + 1}`;
      setFormData({
        courseId: nextId,
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
    try {
      if (editingCourse) {
        await courseApi.update(editingCourse.courseId, formData);
      } else {
        await courseApi.create(formData);
      }
      setShowModal(false);
      loadCourses();
    } catch (err) {
      alert('Error saving course: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm(`Are you sure you want to delete course ${courseId}?`)) {
      try {
        await courseApi.delete(courseId);
        loadCourses();
      } catch (err) {
        alert('Error deleting course: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Course Catalog Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage university courses, subject codes, credits, and faculty allocations
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={16} /> Add New Course
        </button>
      </div>

      {/* Filter & Search */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '280px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search course code, title, faculty..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary">
              <Search size={16} /> Search
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-secondary)" />
            <select
              className="form-select"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              style={{ width: '160px' }}
            >
              <option value="ALL">All Departments</option>
              <option value="AIML">AIML</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Code</th>
                <th>Course Title</th>
                <th>Department</th>
                <th>Credits</th>
                <th>Semester</th>
                <th>Faculty</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.courseId}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary-accent)', fontWeight: 600 }}>{c.courseId}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{c.courseCode}</td>
                  <td style={{ fontWeight: 600 }}>{c.courseName}</td>
                  <td><span className="badge badge-info">{c.department}</span></td>
                  <td style={{ fontWeight: 700 }}>{c.credits} Credits</td>
                  <td>Sem {c.semester}</td>
                  <td>{c.facultyName}</td>
                  <td>
                    <span className={`badge ${c.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleOpenModal(c)}>
                        <Edit size={14} />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.courseId)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && !loading && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No courses match your search criteria.
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
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </h2>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Course ID</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    required
                    disabled={!!editingCourse}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Course Code</label>
                  <input
                    type="text"
                    className="form-input"
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
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-row">
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
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
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
                    onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                    required
                  />
                </div>
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
              </div>

              <div className="form-group">
                <label className="form-label">Faculty In-Charge</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.facultyName}
                  onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
