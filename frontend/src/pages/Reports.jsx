import React, { useEffect, useState } from 'react';
import { studentApi, reportApi } from '../services/api';
import { Code, FileJson, FileCode, CheckCircle, ArrowRight, Info } from 'lucide-react';

export default function Reports() {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('STU001');
  const [soapXml, setSoapXml] = useState('');
  const [restJson, setRestJson] = useState(null);
  const [loadingSoap, setLoadingSoap] = useState(false);
  const [loadingRest, setLoadingRest] = useState(false);

  useEffect(() => {
    studentApi.getAll().then(res => {
      const list = res.data.data || [];
      setStudents(list);
      if (list.length > 0) {
        setSelectedStudentId(list[0].studentId);
      }
    });
  }, []);

  const handleFetchSoap = async () => {
    setLoadingSoap(true);
    try {
      const xml = await reportApi.getSoapReport(selectedStudentId);
      setSoapXml(xml);
    } catch (err) {
      setSoapXml(`<Error>SOAP Call Failed: ${err.message}</Error>`);
    } finally {
      setLoadingSoap(false);
    }
  };

  const handleFetchRest = async () => {
    setLoadingRest(true);
    try {
      const res = await reportApi.getRestReport(selectedStudentId);
      setRestJson(res.data);
    } catch (err) {
      setRestJson({ error: 'REST Call Failed: ' + err.message });
    } finally {
      setLoadingRest(false);
    }
  };

  const handleFetchBoth = () => {
    handleFetchSoap();
    handleFetchRest();
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>REST vs SOAP Interoperability Hub</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Demonstrates enterprise integration with structured XML SOAP Web Service and lightweight REST JSON APIs.
        </p>
      </div>

      {/* Student Selector Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <label className="form-label">Select Student for Academic Report Generation</label>
            <select
              className="form-select"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              {students.map(s => (
                <option key={s.studentId} value={s.studentId}>
                  {s.studentId} - {s.firstName} {s.lastName} ({s.department}, Sem {s.semester})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.4rem' }}>
            <button className="btn btn-primary" onClick={handleFetchBoth}>
              <Code size={16} /> Execute Both Protocols
            </button>
            <button className="btn btn-secondary" onClick={handleFetchSoap}>
              <FileCode size={16} /> Fetch SOAP XML
            </button>
            <button className="btn btn-secondary" onClick={handleFetchRest}>
              <FileJson size={16} /> Fetch REST JSON
            </button>
          </div>
        </div>
      </div>

      {/* Side by side comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* SOAP Panel */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCode size={20} color="#38bdf8" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>SOAP Web Service (XML)</h3>
            </div>
            <span className="badge badge-info">WSDL: /ws/studentReport.wsdl</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Used for enterprise integrations, rigid schema compliance, legacy ERP interoperability, and automated report exchanges.
          </p>
          {loadingSoap ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Executing SOAP Request to Port 8084...</div>
          ) : (
            <pre className="code-preview">
              {soapXml || '<!-- Click "Fetch SOAP XML" or "Execute Both Protocols" to invoke SOAP Service -->'}
            </pre>
          )}
        </div>

        {/* REST Panel */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileJson size={20} color="#34d399" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>REST API (JSON)</h3>
            </div>
            <span className="badge badge-success">Endpoint: /api/reports/student/{selectedStudentId}</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Used for modern web frontends, mobile applications, fast lightweight payload transport, and quick CRUD operations.
          </p>
          {loadingRest ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Executing REST Request via Gateway...</div>
          ) : (
            <pre className="code-preview" style={{ color: '#34d399' }}>
              {restJson ? JSON.stringify(restJson, null, 2) : '// Click "Fetch REST JSON" or "Execute Both Protocols" to invoke REST Endpoint'}
            </pre>
          )}
        </div>
      </div>

      {/* Architectural Explanation Card */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-accent)', fontWeight: 700, marginBottom: '0.5rem' }}>
          <Info size={18} /> REST vs SOAP Architectural Rationale
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          In the <strong>Smart Student Information System (SSIS)</strong> microservices architecture:
          <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li><strong>REST APIs</strong> are utilized across <code>Student Service</code>, <code>Course Service</code>, and <code>Academic Service</code> for CRUD operations, search filters, interactive UI forms, and mobile app interactions due to low overhead and seamless JSON parsing.</li>
            <li><strong>SOAP Web Services</strong> are implemented in <code>Reporting Service</code> to provide contract-first, WSDL-described XML reporting interfaces required by external university accreditation bodies, bank loan verification systems, and legacy institutional software.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
