import React, { useEffect, useState } from 'react';
import { Users, BookOpen, GraduationCap, Award, RefreshCw, Layers } from 'lucide-react';
import { studentApi, courseApi, academicApi } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalCourses: 0,
    totalRecords: 0,
    systemAverageMarks: 0,
    systemAverageGradePoint: 0
  });
  const [departmentData, setDepartmentData] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [semesterPerformance, setSemesterPerformance] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [stuRes, crsRes, overviewRes] = await Promise.all([
        studentApi.getAll(),
        courseApi.getAll(),
        academicApi.getSystemOverview()
      ]);

      const students = stuRes.data.data || [];
      const courses = crsRes.data.data || [];
      const overview = overviewRes.data.data || {};

      setStats({
        totalStudents: students.length,
        activeStudents: students.filter(s => s.status === 'ACTIVE').length,
        totalCourses: courses.length,
        totalRecords: overview.totalRecords || 0,
        systemAverageMarks: overview.systemAverageMarks || 0,
        systemAverageGradePoint: overview.systemAverageGradePoint || 0
      });

      setRecentStudents(students.slice(0, 5));

      // Department breakdown calculation
      const deptMap = {};
      students.forEach(s => {
        const d = s.department || 'Other';
        deptMap[d] = (deptMap[d] || 0) + 1;
      });
      const deptArray = Object.keys(deptMap).map(d => ({ name: d, count: deptMap[d] }));
      setDepartmentData(deptArray);

      // Grade distribution
      if (overview.gradeDistribution) {
        const gradeArray = Object.keys(overview.gradeDistribution).map(g => ({
          name: g,
          count: overview.gradeDistribution[g]
        }));
        setGradeDistribution(gradeArray);
      }

      // Semester performance
      if (overview.semesterAveragePerformance) {
        const semArray = Object.keys(overview.semesterAveragePerformance).map(s => ({
          semester: `Sem ${s}`,
          avgMarks: overview.semesterAveragePerformance[s]
        }));
        setSemesterPerformance(semArray);
      }

    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedAll = async () => {
    try {
      setLoading(true);
      await studentApi.seed();
      await courseApi.seed();
      await academicApi.seed();
      await loadDashboardData();
    } catch (err) {
      console.error('Error seeding data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Academic Overview Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Real-time analytics from MongoDB Microservices architecture
          </p>
        </div>
        <button className="btn btn-secondary" onClick={handleSeedAll} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          Seed / Reset Demo Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stat-grid">
        <div className="card stat-card">
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Total Students</div>
            <div className="stat-value">{stats.totalStudents}</div>
            <div style={{ color: 'var(--success-color)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
              {stats.activeStudents} Active Students
            </div>
          </div>
          <div className="stat-icon"><Users size={24} /></div>
        </div>

        <div className="card stat-card">
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Course Catalog</div>
            <div className="stat-value">{stats.totalCourses}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>Active Subjects</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}><BookOpen size={24} /></div>
        </div>

        <div className="card stat-card">
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Academic Records</div>
            <div className="stat-value">{stats.totalRecords}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>Evaluated Entries</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><GraduationCap size={24} /></div>
        </div>

        <div className="card stat-card">
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>System Avg Marks</div>
            <div className="stat-value">{stats.systemAverageMarks}%</div>
            <div style={{ color: 'var(--warning-color)', fontSize: '0.75rem', marginTop: '0.2rem' }}>Avg GP: {stats.systemAverageGradePoint} / 10</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><Award size={24} /></div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Department Distribution */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Students by Department</h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={departmentData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={({ name, count }) => `${name}: ${count}`}>
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#151d2a', borderColor: '#2a364f', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Semester Performance */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Average Marks by Semester</h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={semesterPerformance}>
                <XAxis dataKey="semester" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#151d2a', borderColor: '#2a364f', borderRadius: '8px' }} />
                <Bar dataKey="avgMarks" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Students Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Recent Registered Students</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Program</th>
                <th>Year & Sem</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map(student => (
                <tr key={student.studentId}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary-accent)', fontWeight: 600 }}>{student.studentId}</td>
                  <td style={{ fontWeight: 600 }}>{student.firstName} {student.lastName}</td>
                  <td>{student.email}</td>
                  <td><span className="badge badge-info">{student.department}</span></td>
                  <td>{student.program}</td>
                  <td>Year {student.year}, Sem {student.semester}</td>
                  <td>
                    <span className={`badge ${student.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentStudents.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No student records found. Click "Seed Demo Data" above to populate MongoDB.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
