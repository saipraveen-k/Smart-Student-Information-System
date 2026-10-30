import React from 'react';
import { 
  ExternalLink, Database, Server, FileText, 
  Layers, Terminal, Copy, Check, ShieldCheck, ArrowUpRight 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function ApiDocInfo() {
  const { addToast } = useToast();

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    addToast(`${label} copied to clipboard`, 'info');
  };

  const swaggerLinks = [
    { name: 'Student Service Swagger', url: 'http://localhost:8081/swagger-ui.html', port: '8081', desc: 'REST endpoints for student lifecycle & BSON persistence' },
    { name: 'Course Service Swagger', url: 'http://localhost:8082/swagger-ui.html', port: '8082', desc: 'Syllabus, credits, and faculty allocations' },
    { name: 'Academic Service Swagger', url: 'http://localhost:8083/swagger-ui.html', port: '8083', desc: 'Dynamic mark evaluation, GPA, and statistical aggregation' },
    { name: 'API Gateway Actuator Routes', url: 'http://localhost:8990/actuator/gateway/routes', port: '8990', desc: 'Spring Cloud Gateway reactive routing engine' }
  ];

  const soapLinks = [
    { name: 'Reporting Service WSDL', url: 'http://localhost:8084/ws/studentReport.wsdl', port: '8084', desc: 'Contract-first SOAP 1.1 WSDL definition file' }
  ];

  const apiEndpoints = [
    { method: 'GET', path: '/api/students', desc: 'Fetch all student profiles', port: '8990 -> 8081' },
    { method: 'POST', path: '/api/students', desc: 'Create and register a new student', port: '8990 -> 8081' },
    { method: 'GET', path: '/api/students/search?keyword={q}', desc: 'Full-text search by name or ID', port: '8990 -> 8081' },
    { method: 'GET', path: '/api/courses', desc: 'List accredited courses catalog', port: '8990 -> 8082' },
    { method: 'POST', path: '/api/courses', desc: 'Add new subject offering', port: '8990 -> 8082' },
    { method: 'GET', path: '/api/academic-records', desc: 'Fetch continuous assessments', port: '8990 -> 8083' },
    { method: 'GET', path: '/api/academic-records/student/{id}/performance', desc: 'Dynamic CGPA & grades calculation', port: '8990 -> 8083' },
    { method: 'POST', path: '/ws', desc: 'SOAP XML getStudentReportRequest', port: '8990 -> 8084' }
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          API Documentation & System Architecture
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
          Interactive OpenAPI 3.0 Swagger specs, contract-first WSDL descriptors, and MongoDB connection parameters.
        </p>
      </div>

      {/* Docs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Swagger OpenAPI Docs */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server size={18} />
              <div className="card-title">OpenAPI 3.0 (Swagger UI)</div>
            </div>
            <span className="badge badge-inverted">REST SPEC</span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Interactive Swagger documentation running directly on each Spring Boot microservice:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {swaggerLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ justifyContent: 'space-between', padding: '0.65rem 0.85rem' }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{link.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{link.desc}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-outline" style={{ fontFamily: 'JetBrains Mono' }}>
                    :{link.port}
                  </span>
                  <ExternalLink size={13} />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* SOAP WSDL Specification */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} />
              <div className="card-title">SOAP WSDL 1.1 Specification</div>
            </div>
            <span className="badge badge-outline">XML SCHEMA</span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Contract-first XML WSDL descriptor automatically published by Spring-WS Reporting Microservice:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {soapLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ justifyContent: 'space-between', padding: '0.65rem 0.85rem' }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{link.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{link.desc}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-outline" style={{ fontFamily: 'JetBrains Mono' }}>
                    :{link.port}
                  </span>
                  <ExternalLink size={13} />
                </div>
              </a>
            ))}
          </div>

          {/* Database Connection Info Box */}
          <div style={{
            marginTop: '1.25rem',
            padding: '1rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Database size={15} />
              <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>MongoDB Compass Parameters</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <div>URI: <code>mongodb://localhost:27017</code></div>
              <div>Database: <code>smart_student_information_system</code></div>
              <div>Collections: <code>students</code>, <code>courses</code>, <code>academic_records</code></div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete API Endpoint Routing Matrix */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">API Gateway Routing Directory</div>
            <div className="card-description">Standardized REST and SOAP endpoints proxied through Port 8990</div>
          </div>
          <span className="badge badge-outline">SPRING CLOUD ROUTER</span>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Gateway URI Path</th>
                <th>Target Microservice</th>
                <th>Functionality Description</th>
              </tr>
            </thead>
            <tbody>
              {apiEndpoints.map((ep, idx) => (
                <tr key={idx}>
                  <td>
                    <span 
                      className="badge" 
                      style={{ 
                        fontFamily: 'JetBrains Mono', 
                        fontWeight: 700,
                        backgroundColor: ep.method === 'GET' ? 'var(--bg-secondary)' : 'var(--btn-primary-bg)',
                        color: ep.method === 'GET' ? 'var(--text-primary)' : 'var(--btn-primary-text)'
                      }}
                    >
                      {ep.method}
                    </span>
                  </td>
                  <td>
                    <code style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem' }}>{ep.path}</code>
                  </td>
                  <td>
                    <span className="badge badge-outline" style={{ fontFamily: 'JetBrains Mono' }}>
                      {ep.port}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {ep.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
