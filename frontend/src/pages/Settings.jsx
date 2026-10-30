import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { studentApi, courseApi, academicApi } from '../services/api';
import { 
  Sun, Moon, Monitor, RefreshCw, Server, Database, 
  ShieldCheck, Check, Layers, Cpu, Terminal
} from 'lucide-react';

export const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();
  const [seeding, setSeeding] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance');

  const handleSeedAll = async () => {
    setSeeding(true);
    try {
      await Promise.all([
        studentApi.seed(),
        courseApi.seed(),
        academicApi.seed()
      ]);
      addToast('All demo datasets successfully seeded into MongoDB', 'success');
    } catch (err) {
      console.error('Error seeding data:', err);
      addToast('Failed to seed datasets: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSeeding(false);
    }
  };

  const services = [
    { name: 'API Gateway Router', port: '8990', tech: 'Spring Cloud Gateway (WebFlux)', status: 'ACTIVE' },
    { name: 'Student Microservice', port: '8081', tech: 'Spring Boot 3.3 / MongoDB Engine', status: 'ACTIVE' },
    { name: 'Course Microservice', port: '8082', tech: 'Spring Boot 3.3 / MongoDB Engine', status: 'ACTIVE' },
    { name: 'Academic Evaluation Service', port: '8083', tech: 'Spring Boot 3.3 / GPA Engine', status: 'ACTIVE' },
    { name: 'Reporting SOAP Service', port: '8084', tech: 'Spring-WS / WSDL4J XML', status: 'ACTIVE' },
    { name: 'MongoDB Database', port: '27017', tech: 'MongoDB 8.0 Community Edition', status: 'ACTIVE' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          System Settings & Preferences
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Manage monochrome appearance, microservices network routing, and database state.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        <button
          className={`btn btn-ghost ${activeTab === 'appearance' ? 'active' : ''}`}
          style={{
            borderBottom: activeTab === 'appearance' ? '2px solid var(--text-primary)' : '2px solid transparent',
            borderRadius: '0',
            padding: '0.5rem 1rem',
            fontWeight: activeTab === 'appearance' ? 600 : 500,
            color: activeTab === 'appearance' ? 'var(--text-primary)' : 'var(--text-secondary)'
          }}
          onClick={() => setActiveTab('appearance')}
        >
          Appearance & Theme
        </button>
        <button
          className={`btn btn-ghost ${activeTab === 'services' ? 'active' : ''}`}
          style={{
            borderBottom: activeTab === 'services' ? '2px solid var(--text-primary)' : '2px solid transparent',
            borderRadius: '0',
            padding: '0.5rem 1rem',
            fontWeight: activeTab === 'services' ? 600 : 500,
            color: activeTab === 'services' ? 'var(--text-primary)' : 'var(--text-secondary)'
          }}
          onClick={() => setActiveTab('services')}
        >
          Microservices Topology
        </button>
        <button
          className={`btn btn-ghost ${activeTab === 'data' ? 'active' : ''}`}
          style={{
            borderBottom: activeTab === 'data' ? '2px solid var(--text-primary)' : '2px solid transparent',
            borderRadius: '0',
            padding: '0.5rem 1rem',
            fontWeight: activeTab === 'data' ? 600 : 500,
            color: activeTab === 'data' ? 'var(--text-primary)' : 'var(--text-secondary)'
          }}
          onClick={() => setActiveTab('data')}
        >
          Database & Operations
        </button>
      </div>

      {/* Tab: Appearance */}
      {activeTab === 'appearance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Monochrome Color Scheme</div>
                <div className="card-description">
                  Select your interface theme. Both themes use strict black-and-white shades without colored accents.
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {/* Dark Mode Card */}
              <div
                onClick={() => setTheme('dark')}
                style={{
                  border: theme === 'dark' ? '2px solid var(--text-primary)' : '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  backgroundColor: '#141414',
                  color: '#FFFFFF',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <Moon size={20} />
                  {theme === 'dark' && <Check size={16} />}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Dark Monochrome</div>
                <div style={{ fontSize: '0.75rem', color: '#A1A1AA', marginTop: '0.2rem' }}>
                  Pitch black #090909 background with crisp #292929 borders.
                </div>
              </div>

              {/* Light Mode Card */}
              <div
                onClick={() => setTheme('light')}
                style={{
                  border: theme === 'light' ? '2px solid var(--text-primary)' : '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  backgroundColor: '#FFFFFF',
                  color: '#111111',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <Sun size={20} />
                  {theme === 'light' && <Check size={16} />}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Light Monochrome</div>
                <div style={{ fontSize: '0.75rem', color: '#71717A', marginTop: '0.2rem' }}>
                  Clean pure white background with subtle #E4E4E7 borders.
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: '0.5rem' }}>Typography & Font Details</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <div>Primary Font: <strong>Inter</strong> (Variable 300–800)</div>
              <div>Monospace Font: <strong>JetBrains Mono</strong> (Codes, IDs, SOAP Payloads)</div>
              <div>Anti-aliasing: Subpixel & Greyscale enabled</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Services */}
      {activeTab === 'services' && (
        <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Active Microservices Cluster</div>
                <div className="card-description">
                  Independent Spring Boot and MongoDB services running on dedicated ports.
                </div>
              </div>
              <span className="badge badge-inverted">6 OF 6 ONLINE</span>
            </div>

            <div className="table-container" style={{ marginTop: '0.5rem' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Service Name</th>
                    <th>Port</th>
                    <th>Stack</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((svc) => (
                    <tr key={svc.port}>
                      <td style={{ fontWeight: 600 }}>{svc.name}</td>
                      <td>
                        <span className="badge badge-outline" style={{ fontFamily: 'JetBrains Mono' }}>
                          :{svc.port}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{svc.tech}</td>
                      <td>
                        <span className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span className="status-dot" style={{ width: 5, height: 5 }}></span>
                          {svc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Data */}
      {activeTab === 'data' && (
        <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">MongoDB Persistence & Seed Engine</div>
                <div className="card-description">
                  Populate demo students, course catalog, and dynamic marks across microservices.
                </div>
              </div>
            </div>

            <div style={{ padding: '0.5rem 0' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                Triggering a database reset invokes the <code>/seed</code> endpoints on Student Service, Course Service, and Academic Service.
                This will reset the collection with 20 students, 14 accredited courses, and 30 academic records with calculated GPAs.
              </p>

              <button className="btn btn-primary" onClick={handleSeedAll} disabled={seeding}>
                <RefreshCw size={14} className={seeding ? 'spin' : ''} />
                {seeding ? 'Seeding MongoDB Records...' : 'Execute Full Database Seed'}
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: '0.5rem' }}>Database Target Details</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <div>URI: <code>mongodb://localhost:27017</code></div>
              <div>Database: <code>smart_student_information_system</code></div>
              <div>Collections: <code>students</code>, <code>courses</code>, <code>academic_records</code></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
