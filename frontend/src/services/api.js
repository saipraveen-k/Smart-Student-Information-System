import axios from 'axios';

const API_BASE = ''; // Gateway proxy on relative /api

export const studentApi = {
  getAll: () => axios.get('/api/students'),
  getById: (id) => axios.get(`/api/students/${id}`),
  search: (keyword) => axios.get(`/api/students/search?keyword=${encodeURIComponent(keyword)}`),
  getByDepartment: (dept) => axios.get(`/api/students/department/${dept}`),
  create: (data) => axios.post('/api/students', data),
  update: (id, data) => axios.put(`/api/students/${id}`, data),
  delete: (id) => axios.delete(`/api/students/${id}`),
  seed: () => axios.post('/api/students/seed')
};

export const courseApi = {
  getAll: () => axios.get('/api/courses'),
  getById: (id) => axios.get(`/api/courses/${id}`),
  search: (keyword) => axios.get(`/api/courses/search?keyword=${encodeURIComponent(keyword)}`),
  getByDepartment: (dept) => axios.get(`/api/courses/department/${dept}`),
  create: (data) => axios.post('/api/courses', data),
  update: (id, data) => axios.put(`/api/courses/${id}`, data),
  delete: (id) => axios.delete(`/api/courses/${id}`),
  seed: () => axios.post('/api/courses/seed')
};

export const academicApi = {
  getAll: () => axios.get('/api/academic-records'),
  getById: (id) => axios.get(`/api/academic-records/${id}`),
  getByStudentId: (studentId) => axios.get(`/api/academic-records/student/${studentId}`),
  getStudentPerformance: (studentId) => axios.get(`/api/academic-records/student/${studentId}/performance`),
  getSystemOverview: () => axios.get('/api/academic-records/analytics/overview'),
  create: (data) => axios.post('/api/academic-records', data),
  update: (id, data) => axios.put(`/api/academic-records/${id}`, data),
  delete: (id) => axios.delete(`/api/academic-records/${id}`),
  seed: () => axios.post('/api/academic-records/seed')
};

export const reportApi = {
  getRestReport: (studentId) => axios.get(`/api/reports/student/${studentId}`),
  getSoapReport: async (studentId) => {
    const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://ssis.com/reporting/soap">
   <soapenv:Header/>
   <soapenv:Body>
      <soap:getStudentReportRequest>
         <soap:studentId>${studentId}</soap:studentId>
      </soap:getStudentReportRequest>
   </soapenv:Body>
</soapenv:Envelope>`;

    const res = await axios.post('/ws', soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': ''
      }
    });
    return res.data;
  }
};
