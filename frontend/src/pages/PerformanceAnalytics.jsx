import React, { useEffect, useState } from 'react';
import { academicApi } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Award, TrendingUp, CheckCircle, Percent } from 'lucide-react';

const COLORS = ['#10b981', '#6366f1', '#3b82f6', '#f59e0b', '#ec4899', '#ef4444'];

export default function PerformanceAnalytics() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const res = await academicApi.getSystemOverview();
      setOverview(res.data.data);
    } catch (err) {
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  if (loading || !overview) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading System Analytics...</div>;
  }

  const gradeData = overview.gradeDistribution
    ? Object.keys(overview.gradeDistribution).map(g => ({
        name: `Grade ${g}`,
        count: overview.gradeDistribution[g]
      }))
    : [];

  const semData = overview.semesterAveragePerformance
    ? Object.keys(overview.semesterAveragePerformance).map(s => ({
        semester: `Semester ${s}`,
        averageMarks: overview.semesterAveragePerformance[s]
      }))
    : [];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Academic Performance Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Aggregated evaluation statistics computed dynamically by Academic Microservice
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="stat-grid">
        <div className="card stat-card">
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Total Evaluated Records</div>
            <div className="stat-value">{overview.totalRecords}</div>
          </div>
          <div className="stat-icon"><CheckCircle size={24} /></div>
        </div>

        <div className="card stat-card">
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>System Mean Score</div>
            <div className="stat-value">{overview.systemAverageMarks}%</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}><Percent size={24} /></div>
        </div>

        <div className="card stat-card">
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>System Mean CGPA</div>
            <div className="stat-value">{overview.systemAverageGradePoint} / 10</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><Award size={24} /></div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Grade Distribution */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Overall Grade Distribution</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={gradeData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, count }) => `${name}: ${count}`}>
                  {gradeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#151d2a', borderColor: '#2a364f', borderRadius: '8px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Semester Marks Trend */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Semester Average Score Comparison</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={semData}>
                <XAxis dataKey="semester" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#151d2a', borderColor: '#2a364f', borderRadius: '8px' }} />
                <Bar dataKey="averageMarks" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
