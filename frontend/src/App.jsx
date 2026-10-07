import React from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, GraduationCap, BarChart2, FileCode, Info } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentDetails from './pages/StudentDetails';
import Courses from './pages/Courses';
import AcademicRecords from './pages/AcademicRecords';
import PerformanceAnalytics from './pages/PerformanceAnalytics';
import Reports from './pages/Reports';
import ApiDocInfo from './pages/ApiDocInfo';

export default function App() {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/students/')) return 'Student Profile Details';
    if (path === '/students') return 'Student Directory';
    if (path === '/courses') return 'Course Catalog';
    if (path === '/academic-records') return 'Academic Records';
    if (path === '/analytics') return 'Performance Analytics';
    if (path === '/reports') return 'REST & SOAP Integration';
    if (path === '/api-docs') return 'API Documentation';
    return 'SSIS Portal';
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-badge">SSIS</div>
          <div>
            <div className="sidebar-title">Smart Student</div>
            <div className="sidebar-subtitle">Info System</div>
          </div>
        </div>

        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/students" className={({ isActive }) => (isActive ? 'active' : '')}>
              <Users size={18} /> Students
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/courses" className={({ isActive }) => (isActive ? 'active' : '')}>
              <BookOpen size={18} /> Course Catalog
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/academic-records" className={({ isActive }) => (isActive ? 'active' : '')}>
              <GraduationCap size={18} /> Academic Records
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/analytics" className={({ isActive }) => (isActive ? 'active' : '')}>
              <BarChart2 size={18} /> Analytics
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/reports" className={({ isActive }) => (isActive ? 'active' : '')}>
              <FileCode size={18} /> REST & SOAP Reports
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/api-docs" className={({ isActive }) => (isActive ? 'active' : '')}>
              <Info size={18} /> API Documentation
            </NavLink>
          </li>
        </ul>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div>Microservices Architecture</div>
          <div>Java 21 • Spring Boot 3.3</div>
          <div>MongoDB • REST • SOAP</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Navbar */}
        <header className="top-navbar">
          <div className="top-nav-title">{getPageTitle()}</div>

          <div className="microservices-pills">
            <div className="status-pill"><span className="dot"></span> Gateway:8080</div>
            <div className="status-pill"><span className="dot"></span> Student:8081</div>
            <div className="status-pill"><span className="dot"></span> Course:8082</div>
            <div className="status-pill"><span className="dot"></span> Academic:8083</div>
            <div className="status-pill"><span className="dot"></span> Report:8084</div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-body">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/:studentId" element={<StudentDetails />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/academic-records" element={<AcademicRecords />} />
            <Route path="/analytics" element={<PerformanceAnalytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/api-docs" element={<ApiDocInfo />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
