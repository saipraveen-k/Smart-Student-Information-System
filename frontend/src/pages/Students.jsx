import React, { useEffect, useState } from 'react';
import { studentApi } from '../services/api';
import { 
  Search, Plus, Edit2, Trash2, Eye, Filter, 
  X, Check, ChevronLeft, ChevronRight, RefreshCw, UserPlus, Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '2003-01-01',
    gender: 'MALE',
    department: 'AIML',
    program: 'B.Tech',
    year: 3,
    semester: 6,
    enrollmentDate: '2022-08-01',
    address: 'Hyderabad, India',
    status: 'ACTIVE'
  });

  const loadStudents = async () => {
    setLoading(true);
    try {
      let res;
      if (searchKeyword.trim()) {
        res = await studentApi.search(searchKeyword);
      } else if (selectedDepartment !== 'ALL') {
        res = await studentApi.getByDepartment(selectedDepartment);
      } else {
        res = await studentApi.getAll();
      }
      setStudents(res.data.data || []);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error loading students:', err);
      addToast('Failed to load students from Student Microservice', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [selectedDepartment]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadStudents();
  };

  const handleOpenModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone || '',
        dateOfBirth: student.dateOfBirth || '2003-01-01',
        gender: student.gender || 'MALE',
        department: student.department || 'AIML',
        program: student.program || 'B.Tech',
        year: student.year || 3,
        semester: student.semester || 6,
        enrollmentDate: student.enrollmentDate || '2022-08-01',
        address: student.address || '',
        status: student.status || 'ACTIVE'
      });
    } else {
      setEditingStudent(null);
      const nextId = `STU${String(students.length + 1).padStart(3, '0')}`;
      setFormData({
        studentId: nextId,
        firstName: '',
        lastName: '',
        email: '',
        phone: '+919876543210',
        dateOfBirth: '2004-05-15',
        gender: 'MALE',
        department: 'AIML',
        program: 'B.Tech',
        year: 2,
        semester: 4,
        enrollmentDate: '2023-08-01',
        address: 'Bengaluru, India',
        status: 'ACTIVE'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingStudent) {
        await studentApi.update(editingStudent.studentId, formData);
        addToast(`Student ${formData.studentId} updated successfully`, 'success');
      } else {
        await studentApi.create(formData);
        addToast(`New student ${formData.studentId} registered successfully`, 'success');
      }
      setShowModal(false);
      loadStudents();
    } catch (err) {
      console.error('Error saving student:', err);
      addToast('Error saving student: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm(`Are you sure you want to permanently delete student ${studentId}?`)) {
      try {
        await studentApi.delete(studentId);
        addToast(`Student ${studentId} deleted successfully`, 'success');
        loadStudents();
      } catch (err) {
        console.error('Error deleting student:', err);
        addToast('Error deleting student: ' + (err.response?.data?.message || err.message), 'error');
      }
    }
  };

  // Filter by status if selected
  const filteredStudents = students.filter(s => {
    if (selectedStatus === 'ALL') return true;
    return s.status === selectedStatus;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Student Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Comprehensive directory of registered students with BSON persistence on MongoDB Port 27017.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={loadStudents}
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
            <span>Register Student</span>
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
                placeholder="Search students by name, ID, or email..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              {searchKeyword && (
                <button 
                  type="button" 
                  className="search-clear" 
                  onClick={() => { setSearchKeyword(''); loadStudents(); }}
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
                style={{ width: 'auto', minWidth: '150px' }}
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

            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '130px' }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Full Name</th>
              <th>Department</th>
              <th>Program</th>
              <th>Year / Sem</th>
              <th>Contact Email</th>
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
                    <span>Loading student records from MongoDB...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <div className="empty-state">
                    <div className="empty-state-icon"><Users size={22} /></div>
                    <div className="empty-state-title">No Students Found</div>
                    <div className="empty-state-desc">No student records match the active search or filter criteria.</div>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleOpenModal()}>
                      <Plus size={13} />
                      <span>Register First Student</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedStudents.map((s) => (
                <tr key={s.studentId}>
                  <td>
                    <span className="badge badge-outline" style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
                      {s.studentId}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {s.firstName} {s.lastName}
                  </td>
                  <td>{s.department}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{s.program}</td>
                  <td>Year {s.year}, Sem {s.semester}</td>
                  <td style={{ color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono', fontSize: '0.78rem' }}>
                    {s.email}
                  </td>
                  <td>
                    <span className="badge">
                      <span className="status-dot" style={{ width: 5, height: 5 }}></span>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => navigate(`/students/${s.studentId}`)}
                        title="View Detailed Profile"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => handleOpenModal(s)}
                        title="Edit Student"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => handleDelete(s.studentId)}
                        title="Delete Student"
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
        {filteredStudents.length > 0 && (
          <div className="pagination-container">
            <div>
              Showing <strong>{((currentPage - 1) * itemsPerPage) + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredStudents.length)}</strong> of <strong>{filteredStudents.length}</strong> students
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

      {/* Add / Edit Student Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => !submitting && setShowModal(false)}>
          <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                {editingStudent ? `Edit Student: ${editingStudent.studentId}` : 'Register New Student'}
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Student ID</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      disabled={!!editingStudent}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

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
                    <label className="form-label">Program</label>
                    <select
                      className="form-select"
                      value={formData.program}
                      onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    >
                      <option value="B.Tech">B.Tech</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="Ph.D">Ph.D</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Year of Study</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      className="form-input"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 1 })}
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
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '0.5rem' }}>
                  <label className="form-label">Residential Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                  {submitting ? 'Saving to Database...' : editingStudent ? 'Update Student Record' : 'Save New Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
