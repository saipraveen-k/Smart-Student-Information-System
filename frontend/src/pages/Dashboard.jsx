import React, { useEffect, useState } from 'react';
import { 
  Users, BookOpen, GraduationCap, Award, RefreshCw, 
  ArrowUpRight, CheckCircle2, ChevronRight, Activity, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { studentApi, courseApi, academicApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();
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
  const [recentRecords, setRecentRecords] = useState([]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [stuRes, crsRes, overviewRes, recRes] = await Promise.all([
        studentApi.getAll(),
        courseApi.getAll(),
        academicApi.getSystemOverview(),
        academicApi.getAll()
      ]);

      const students = stuRes.data.data || [];
      const courses = crsRes.data.data || [];
      const overview = overviewRes.data.data || {};
      const records = recRes.data.data || [];

      setStats({
        totalStudents: students.length,
        activeStudents: students.filter(s => s.status === 'ACTIVE').length,
        totalCourses: courses.length,
        totalRecords: overview.totalRecords || records.length,
        systemAverageMarks: overview.systemAverageMarks || 0,
        systemAverageGradePoint: overview.systemAverageGradePoint || 0
      });

      setRecentStudents(students.slice(0, 5));
      setRecentRecords(records.slice(0, 5));

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
      addToast('Error loading real-time dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Listen for data seeded event from navbar
    const handleSeeded = () => loadDashboardData();
    window.addEventListener('ssis-data-seeded', handleSeeded);
    return () => window.removeEventListener('ssis-data-seeded', handleSeeded);
  }, []);

  // Monochrome chart palette
  const MONO_SHADES = ['#FFFFFF', '#D4D4D8', '#A1A1AA', '#71717A', '#52525B', '#3F3F46'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          padding: '0.5rem 0.75rem',
          borderRadius: '6px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{label || payload[0].name}</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {payload[0].value} {payload[0].unit || ''}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {/* Welcome Section */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <span className="status-dot"></span>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                Enterprise Microservices v1.0.0
              </span>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Institutional Administration & Intelligence
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem', maxWidth: '640px' }}>
              Aggregated real-time metrics across Student, Course, Academic, and SOAP Reporting microservices backed by MongoDB.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={loadDashboardData}
              disabled={loading}
              title="Refresh real-time data"
            >
              <RefreshCw size={13} className={loading ? 'spin' : ''} />
              <span>Refresh Metrics</span>
            </button>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/students')}
            >
              <span>Manage Students</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards (5 Core Metrics) */}
      <div className="stat-grid">
        {/* Total Students */}
        <div className="card stat-card">
          <div>
            <div className="stat-label">Total Students</div>
            <div className="stat-value">{loading ? '...' : stats.totalStudents}</div>
            <div className="stat-subtext">Active enrollment in records</div>
          </div>
          <div className="stat-icon"><Users size={18} /></div>
        </div>

        {/* Active Students */}
        <div className="card stat-card">
          <div>
            <div className="stat-label">Active Status</div>
            <div className="stat-value">{loading ? '...' : stats.activeStudents}</div>
            <div className="stat-subtext">
              {stats.totalStudents > 0 
                ? `${Math.round((stats.activeStudents / stats.totalStudents) * 100)}% active attendance` 
                : '100% active'}
            </div>
          </div>
          <div className="stat-icon"><CheckCircle2 size={18} /></div>
        </div>

        {/* Total Courses */}
        <div className="card stat-card">
          <div>
            <div className="stat-label">Accredited Courses</div>
            <div className="stat-value">{loading ? '...' : stats.totalCourses}</div>
            <div className="stat-subtext">Across 4 engineering depts</div>
          </div>
          <div className="stat-icon"><BookOpen size={18} /></div>
        </div>

        {/* Academic Records */}
        <div className="card stat-card">
          <div>
            <div className="stat-label">Evaluated Records</div>
            <div className="stat-value">{loading ? '...' : stats.totalRecords}</div>
            <div className="stat-subtext">Internal & External scores</div>
          </div>
          <div className="stat-icon"><GraduationCap size={18} /></div>
        </div>

        {/* Average Performance */}
        <div className="card stat-card">
          <div>
            <div className="stat-label">Mean Performance</div>
            <div className="stat-value">{loading ? '...' : `${stats.systemAverageMarks}%`}</div>
            <div className="stat-subtext">{stats.systemAverageGradePoint} / 10.0 System CGPA</div>
          </div>
          <div className="stat-icon"><Award size={18} /></div>
        </div>
      </div>

      {/* Analytics Charts (Strictly Monochromatic) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Department Enrollment Bar Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Enrollment by Department</div>
              <div className="card-description">Distribution of enrolled students across academic branches</div>
            </div>
            <span className="badge badge-outline">BSON PERSISTENCE</span>
          </div>

          <div style={{ height: '240px', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="var(--chart-axis)" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: 'var(--chart-grid)' }} 
                />
                <YAxis 
                  stroke="var(--chart-axis)" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: 'var(--chart-grid)' }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="var(--chart-c1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution Monochrome Pie/Bar */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Institutional Grade Distribution</div>
              <div className="card-description">O, A+, A, B+, B, C breakdown dynamically evaluated</div>
            </div>
            <span className="badge badge-outline">GPA ENGINE</span>
          </div>

          <div style={{ height: '240px', marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
            {gradeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--chart-axis)" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={{ stroke: 'var(--chart-grid)' }} 
                  />
                  <YAxis 
                    stroke="var(--chart-axis)" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={{ stroke: 'var(--chart-grid)' }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="var(--chart-c2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ width: '100%', padding: '2rem 0' }}>
                <div className="empty-state-desc">No academic grades distributed yet</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Students & Recent Academic Activities */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Student Registrations */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Student Registrations</div>
              <div className="card-description">Latest profiles ingested into Student Service</div>
            </div>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/students')}
            >
              <span>View All</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>ID</th>
                  <th>Dept</th>
                  <th>Sem</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((s) => (
                  <tr 
                    key={s.studentId} 
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/students/${s.studentId}`)}
                  >
                    <td style={{ fontWeight: 600 }}>{s.firstName} {s.lastName}</td>
                    <td>
                      <span className="badge badge-outline" style={{ fontFamily: 'JetBrains Mono' }}>
                        {s.studentId}
                      </span>
                    </td>
                    <td>{s.department}</td>
                    <td>Sem {s.semester}</td>
                    <td>
                      <span className="badge">
                        <span className="status-dot" style={{ width: 4, height: 4 }}></span>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Academic Activities Feed */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Academic Evaluations</div>
              <div className="card-description">Dynamic computation from Academic Service</div>
            </div>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/academic-records')}
            >
              <span>View All</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Record ID</th>
                  <th>Student ID</th>
                  <th>Marks (100)</th>
                  <th>Grade</th>
                  <th>GP</th>
                </tr>
              </thead>
              <tbody>
                {recentRecords.map((r) => (
                  <tr key={r.recordId}>
                    <td style={{ fontFamily: 'JetBrains Mono' }}>{r.recordId}</td>
                    <td>
                      <span className="badge badge-outline" style={{ fontFamily: 'JetBrains Mono' }}>
                        {r.studentId}
                      </span>
                    </td>
                    <td>{r.totalMarks} / 100</td>
                    <td>
                      <span className={`grade-badge ${r.grade === 'O' ? 'grade-o' : ''}`}>
                        {r.grade}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, fontFamily: 'JetBrains Mono' }}>
                      {r.gradePoint}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
