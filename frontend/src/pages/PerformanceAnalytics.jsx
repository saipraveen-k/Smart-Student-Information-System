import React, { useEffect, useState } from 'react';
import { academicApi } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid 
} from 'recharts';
import { Award, TrendingUp, CheckCircle, Percent, RefreshCw, BarChart2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function PerformanceAnalytics() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadOverview = async () => {
    setLoading(true);
    try {
      const res = await academicApi.getSystemOverview();
      setOverview(res.data.data);
    } catch (err) {
      console.error('Error loading analytics:', err);
      addToast('Error fetching system analytics from Academic Microservice', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

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

  if (loading || !overview) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <RefreshCw size={20} className="spin" style={{ margin: '0 auto 1rem', display: 'block' }} />
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Computing Dynamic System Analytics...</div>
      </div>
    );
  }

  const gradeData = overview.gradeDistribution
    ? Object.keys(overview.gradeDistribution).map(g => ({
        name: `Grade ${g}`,
        grade: g,
        count: overview.gradeDistribution[g]
      }))
    : [];

  const semData = overview.semesterAveragePerformance
    ? Object.keys(overview.semesterAveragePerformance).map(s => ({
        semester: `Sem ${s}`,
        averageMarks: overview.semesterAveragePerformance[s]
      }))
    : [];

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Academic Performance Analytics
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            System-wide statistical aggregation computed by Academic Microservice Engine on Port 8083.
          </p>
        </div>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={loadOverview}
          disabled={loading}
        >
          <RefreshCw size={13} className={loading ? 'spin' : ''} />
          <span>Recompute Analytics</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
        <div className="card stat-card">
          <div>
            <div className="stat-label">Evaluated Records</div>
            <div className="stat-value">{overview.totalRecords}</div>
            <div className="stat-subtext">Sum of graded subjects</div>
          </div>
          <div className="stat-icon"><CheckCircle size={18} /></div>
        </div>

        <div className="card stat-card">
          <div>
            <div className="stat-label">System Mean Score</div>
            <div className="stat-value">{overview.systemAverageMarks}%</div>
            <div className="stat-subtext">Across all active students</div>
          </div>
          <div className="stat-icon"><Percent size={18} /></div>
        </div>

        <div className="card stat-card">
          <div>
            <div className="stat-label">System CGPA</div>
            <div className="stat-value">{overview.systemAverageGradePoint}</div>
            <div className="stat-subtext">On 10.0 scale standard</div>
          </div>
          <div className="stat-icon"><Award size={18} /></div>
        </div>

        <div className="card stat-card">
          <div>
            <div className="stat-label">Active Semesters</div>
            <div className="stat-value">{semData.length}</div>
            <div className="stat-subtext">Continuous tracking</div>
          </div>
          <div className="stat-icon"><TrendingUp size={18} /></div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Grade Distribution Bar Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Grade Frequency Distribution</div>
              <div className="card-description">Total student instances per letter grade</div>
            </div>
            <span className="badge badge-outline">ABSOLUTE EVALUATION</span>
          </div>

          <div style={{ height: '260px', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="grade" 
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

        {/* Semester Average Performance */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Semester Mean Scores</div>
              <div className="card-description">Average performance percentage by semester cohort</div>
            </div>
            <span className="badge badge-inverted">MEAN MARKS %</span>
          </div>

          <div style={{ height: '260px', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={semData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="semester" 
                  stroke="var(--chart-axis)" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: 'var(--chart-grid)' }} 
                />
                <YAxis 
                  stroke="var(--chart-axis)" 
                  fontSize={11} 
                  domain={[0, 100]}
                  tickLine={false} 
                  axisLine={{ stroke: 'var(--chart-grid)' }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="averageMarks" fill="var(--chart-c2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grade Scale Reference Matrix */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Institutional Grading Benchmark Matrix</div>
            <div className="card-description">UGC & AICTE standardized 10-point credit evaluation scale</div>
          </div>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Letter Grade</th>
                <th>Mark Range</th>
                <th>Grade Point</th>
                <th>Classification</th>
                <th>Active Frequency</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="grade-badge grade-o">O</span></td>
                <td>90% – 100%</td>
                <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>10.0</td>
                <td>Outstanding / Distinction</td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{overview.gradeDistribution?.['O'] || 0}</td>
              </tr>
              <tr>
                <td><span className="grade-badge">A+</span></td>
                <td>80% – 89%</td>
                <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>9.0</td>
                <td>Excellent</td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{overview.gradeDistribution?.['A+'] || 0}</td>
              </tr>
              <tr>
                <td><span className="grade-badge">A</span></td>
                <td>70% – 79%</td>
                <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>8.0</td>
                <td>Very Good</td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{overview.gradeDistribution?.['A'] || 0}</td>
              </tr>
              <tr>
                <td><span className="grade-badge">B+</span></td>
                <td>60% – 69%</td>
                <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>7.0</td>
                <td>Good</td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{overview.gradeDistribution?.['B+'] || 0}</td>
              </tr>
              <tr>
                <td><span className="grade-badge">B</span></td>
                <td>50% – 59%</td>
                <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>6.0</td>
                <td>Above Average</td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{overview.gradeDistribution?.['B'] || 0}</td>
              </tr>
              <tr>
                <td><span className="grade-badge">C</span></td>
                <td>40% – 49%</td>
                <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>5.0</td>
                <td>Average / Pass</td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{overview.gradeDistribution?.['C'] || 0}</td>
              </tr>
              <tr>
                <td><span className="grade-badge">F</span></td>
                <td>0% – 39%</td>
                <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>0.0</td>
                <td>Fail</td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{overview.gradeDistribution?.['F'] || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
