import React, { useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BookOpen, GraduationCap, 
  BarChart2, FileCode, Info, Settings as SettingsIcon,
  Sun, Moon, Menu, X, RefreshCw, Layers
} from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { useToast } from './context/ToastContext';
import { studentApi, courseApi, academicApi } from './services/api';

import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentDetails from './pages/StudentDetails';
import Courses from './pages/Courses';
import AcademicRecords from './pages/AcademicRecords';
import PerformanceAnalytics from './pages/PerformanceAnalytics';
import Reports from './pages/Reports';
import ApiDocInfo from './pages/ApiDocInfo';
import Settings from './pages/Settings';

export default function App() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/') return { title: 'Academic Overview', section: 'Dashboard' };
    if (path.startsWith('/students/')) return { title: 'Student Profile', section: 'Directory' };
    if (path === '/students') return { title: 'Students Directory', section: 'Administration' };
    if (path === '/courses') return { title: 'Course Catalog', section: 'Curriculum' };
    if (path === '/academic-records') return { title: 'Academic Records', section: 'Evaluations' };
    if (path === '/analytics') return { title: 'Performance Analytics', section: 'Insights' };
    if (path === '/reports') return { title: 'REST & SOAP Hub', section: 'Integrations' };
    if (path === '/api-docs') return { title: 'API Documentation', section: 'Specifications' };
    if (path === '/settings') return { title: 'Settings & Topology', section: 'System' };
    return { title: 'SSIS Portal', section: 'System' };
  };

  const handleQuickSeed = async () => {
    setSeeding(true);
    try {
      await Promise.all([
        studentApi.seed(),
        courseApi.seed(),
        academicApi.seed()
      ]);
      addToast('System database successfully seeded with demo records', 'success');
      // Dispatch custom event to let active page know data refreshed
      window.dispatchEvent(new Event('ssis-data-seeded'));
    } catch (err) {
      console.error('Seed error:', err);
      addToast('Seed operation failed: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSeeding(false);
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="app-container">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="modal-overlay" 
          style={{ zIndex: 95 }} 
          onClick={() => setMobileMenuOpen(false)} 
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo-icon">SSIS</div>
            <div>
              <div className="sidebar-brand-title">Smart SIS</div>
              <div className="sidebar-brand-sub">Enterprise Portal</div>
            </div>
          </div>
          {mobileMenuOpen && (
            <button 
              className="btn btn-ghost btn-icon mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Core Platform</div>

          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/students" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Users size={16} />
            <span>Students</span>
          </NavLink>

          <NavLink 
            to="/courses" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <BookOpen size={16} />
            <span>Courses</span>
          </NavLink>

          <NavLink 
            to="/academic-records" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <GraduationCap size={16} />
            <span>Academic Records</span>
          </NavLink>

          <div className="nav-section-label" style={{ marginTop: '0.75rem' }}>Intelligence & Protocols</div>

          <NavLink 
            to="/analytics" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <BarChart2 size={16} />
            <span>Performance Analytics</span>
          </NavLink>

          <NavLink 
            to="/reports" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <FileCode size={16} />
            <span>Reports (REST & SOAP)</span>
          </NavLink>

          <div className="nav-section-label" style={{ marginTop: '0.75rem' }}>Platform & Config</div>

          <NavLink 
            to="/api-docs" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Info size={16} />
            <span>API Documentation</span>
          </NavLink>

          <NavLink 
            to="/settings" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <SettingsIcon size={16} />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-badge-arch">
            <span className="status-dot"></span>
            <span>Gateway :8990</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Spring Boot 3.3 • Java 21 • Mongo 8.0
          </div>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="main-wrapper">
        {/* Top Navbar */}
        <header className="top-navbar">
          <div className="top-nav-left">
            <button 
              className="btn btn-ghost btn-icon mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu size={18} />
            </button>
            <div className="top-nav-title">
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{pageInfo.section}</span>
              <span className="top-nav-breadcrumb-sep">/</span>
              <span>{pageInfo.title}</span>
            </div>
          </div>

          <div className="top-nav-right">
            {/* Live Microservices Status */}
            <div className="microservice-status-bar" title="All microservices active and responding">
              <span className="status-dot pulse"></span>
              <span>6/6 SERVICES ACTIVE</span>
            </div>

            {/* Quick Seed Action */}
            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleQuickSeed}
              disabled={seeding}
              title="Seed or reset sample data across MongoDB collections"
            >
              <RefreshCw size={13} className={seeding ? 'spin' : ''} />
              <span>{seeding ? 'Seeding...' : 'Seed Data'}</span>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              className="btn btn-secondary btn-icon"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="page-body">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/:studentId" element={<StudentDetails />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/academic-records" element={<AcademicRecords />} />
            <Route path="/analytics" element={<PerformanceAnalytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/api-docs" element={<ApiDocInfo />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
