import React, { useEffect, useState } from 'react';
import { studentApi, reportApi } from '../services/api';
import { 
  Code, FileJson, FileCode, CheckCircle, ArrowRight, 
  Copy, Check, RefreshCw, Layers, ShieldCheck, Cpu 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Reports() {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('STU001');
  const [soapXml, setSoapXml] = useState('');
  const [restJson, setRestJson] = useState(null);
  const [loadingSoap, setLoadingSoap] = useState(false);
  const [loadingRest, setLoadingRest] = useState(false);
  const [soapTime, setSoapTime] = useState(null);
  const [restTime, setRestTime] = useState(null);
  const [copiedSoap, setCopiedSoap] = useState(false);
  const [copiedRest, setCopiedRest] = useState(false);

  const { addToast } = useToast();

  useEffect(() => {
    studentApi.getAll().then(res => {
      const list = res.data.data || [];
      setStudents(list);
      if (list.length > 0) {
        setSelectedStudentId(list[0].studentId);
      }
    }).catch(err => {
      console.error('Error fetching students list:', err);
    });
  }, []);

  const handleFetchSoap = async () => {
    setLoadingSoap(true);
    const start = performance.now();
    try {
      const xml = await reportApi.getSoapReport(selectedStudentId);
      setSoapXml(xml);
      setSoapTime(Math.round(performance.now() - start));
      addToast('SOAP XML response received from Port 8084 via Gateway', 'success');
    } catch (err) {
      setSoapXml(`<Error>SOAP Call Failed: ${err.message}</Error>`);
      addToast('SOAP call failed: ' + err.message, 'error');
    } finally {
      setLoadingSoap(false);
    }
  };

  const handleFetchRest = async () => {
    setLoadingRest(true);
    const start = performance.now();
    try {
      const res = await reportApi.getRestReport(selectedStudentId);
      setRestJson(res.data);
      setRestTime(Math.round(performance.now() - start));
      addToast('REST JSON response received from Port 8084 via Gateway', 'success');
    } catch (err) {
      setRestJson({ error: 'REST Call Failed: ' + err.message });
      addToast('REST call failed: ' + err.message, 'error');
    } finally {
      setLoadingRest(false);
    }
  };

  const handleFetchBoth = () => {
    handleFetchSoap();
    handleFetchRest();
  };

  const handleCopySoap = () => {
    if (soapXml) {
      navigator.clipboard.writeText(soapXml);
      setCopiedSoap(true);
      addToast('SOAP XML copied to clipboard', 'info');
      setTimeout(() => setCopiedSoap(false), 2000);
    }
  };

  const handleCopyRest = () => {
    if (restJson) {
      navigator.clipboard.writeText(JSON.stringify(restJson, null, 2));
      setCopiedRest(true);
      addToast('REST JSON copied to clipboard', 'info');
      setTimeout(() => setCopiedRest(false), 2000);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          REST & SOAP Interoperability Hub
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
          Side-by-side protocol benchmarking comparing contract-first XML SOAP Web Services with lightweight JSON REST microservices.
        </p>
      </div>

      {/* Target Selector Card */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <label className="form-label">Select Target Student for Report Generation</label>
            <select
              className="form-select"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              {students.map(s => (
                <option key={s.studentId} value={s.studentId}>
                  {s.studentId} — {s.firstName} {s.lastName} ({s.department}, Sem {s.semester})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.2rem' }}>
            <button className="btn btn-primary" onClick={handleFetchBoth}>
              <Code size={14} />
              <span>Execute Both Protocols</span>
            </button>
            <button className="btn btn-secondary" onClick={handleFetchSoap} disabled={loadingSoap}>
              <FileCode size={14} className={loadingSoap ? 'spin' : ''} />
              <span>Fetch SOAP (XML)</span>
            </button>
            <button className="btn btn-secondary" onClick={handleFetchRest} disabled={loadingRest}>
              <FileJson size={14} className={loadingRest ? 'spin' : ''} />
              <span>Fetch REST (JSON)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Dual Viewers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* SOAP XML Panel */}
        <div className="card">
          <div className="card-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCode size={16} />
                <div className="card-title">SOAP 1.1 Web Service (XML)</div>
              </div>
              <div className="card-description">
                Endpoint: <code>POST /ws</code> • Contract: <code>studentReport.wsdl</code>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {soapTime !== null && (
                <span className="badge badge-outline" style={{ fontFamily: 'JetBrains Mono' }}>
                  {soapTime} ms
                </span>
              )}
              {soapXml && (
                <button className="btn btn-ghost btn-sm btn-icon" onClick={handleCopySoap} title="Copy XML">
                  {copiedSoap ? <Check size={14} /> : <Copy size={14} />}
                </button>
              )}
            </div>
          </div>

          {loadingSoap ? (
            <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
              <RefreshCw size={20} className="spin" style={{ margin: '0 auto 1rem', display: 'block' }} />
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Processing SOAP XML envelope...</div>
            </div>
          ) : soapXml ? (
            <pre className="code-viewer" style={{ maxHeight: '420px' }}>
              {soapXml}
            </pre>
          ) : (
            <div className="empty-state" style={{ padding: '3rem 1rem' }}>
              <div className="empty-state-icon"><FileCode size={20} /></div>
              <div className="empty-state-title">No SOAP Payload Retrieved</div>
              <div className="empty-state-desc">Click "Fetch SOAP (XML)" or "Execute Both" to invoke the Reporting Service.</div>
            </div>
          )}
        </div>

        {/* REST JSON Panel */}
        <div className="card">
          <div className="card-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileJson size={16} />
                <div className="card-title">RESTful Microservice (JSON)</div>
              </div>
              <div className="card-description">
                Endpoint: <code>GET /api/reports/student/{selectedStudentId}</code>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {restTime !== null && (
                <span className="badge badge-outline" style={{ fontFamily: 'JetBrains Mono' }}>
                  {restTime} ms
                </span>
              )}
              {restJson && (
                <button className="btn btn-ghost btn-sm btn-icon" onClick={handleCopyRest} title="Copy JSON">
                  {copiedRest ? <Check size={14} /> : <Copy size={14} />}
                </button>
              )}
            </div>
          </div>

          {loadingRest ? (
            <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
              <RefreshCw size={20} className="spin" style={{ margin: '0 auto 1rem', display: 'block' }} />
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Fetching REST JSON resource...</div>
            </div>
          ) : restJson ? (
            <pre className="code-viewer" style={{ maxHeight: '420px' }}>
              {JSON.stringify(restJson, null, 2)}
            </pre>
          ) : (
            <div className="empty-state" style={{ padding: '3rem 1rem' }}>
              <div className="empty-state-icon"><FileJson size={20} /></div>
              <div className="empty-state-title">No REST Payload Retrieved</div>
              <div className="empty-state-desc">Click "Fetch REST (JSON)" or "Execute Both" to invoke the REST endpoint.</div>
            </div>
          )}
        </div>
      </div>

      {/* Protocol Architecture Comparison Matrix */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Architectural Protocol Evaluation</div>
            <div className="card-description">Comparative engineering trade-offs between SOAP XML and REST JSON</div>
          </div>
          <span className="badge badge-inverted">INTEROPERABILITY MATRIX</span>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Evaluation Metric</th>
                <th>SOAP 1.1 Web Service</th>
                <th>REST Microservice API</th>
                <th>Engineering Recommendation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>Data Encoding</td>
                <td>XML with JAXB / WSDL4J serialization</td>
                <td>JSON (JavaScript Object Notation)</td>
                <td>JSON for web frontends, XML for enterprise legacy</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Contract Schema</td>
                <td>Strict Contract-First (<code>studentReport.wsdl</code>)</td>
                <td>OpenAPI 3.0 / Swagger UI definition</td>
                <td>WSDL enforces compile-time type safety</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Transport Protocol</td>
                <td>HTTP POST with SOAPAction headers</td>
                <td>HTTP GET / POST / PUT / DELETE verbs</td>
                <td>REST utilizes native HTTP caching & idempotency</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Payload Overhead</td>
                <td>High (Envelope, Body, Namespace prefixes)</td>
                <td>Minimal (Key-value pairs only)</td>
                <td>REST saves up to 40% bandwidth over network</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Primary Use-Case</td>
                <td>Official academic transcript certification</td>
                <td>Real-time single-page dashboards and CRUD</td>
                <td>SSIS supports both architectures seamlessly</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
