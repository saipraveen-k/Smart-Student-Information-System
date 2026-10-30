const http = require('http');

function postJson(path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 8990,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

const students = [
  {
    studentId: 'STU011',
    firstName: 'Kavya',
    lastName: 'Subramanian',
    email: 'kavya.subramanian@ssis.edu',
    phone: '+919876543221',
    dateOfBirth: '2003-09-14',
    gender: 'FEMALE',
    department: 'AIML',
    program: 'B.Tech',
    year: 3,
    semester: 6,
    enrollmentDate: '2022-08-01',
    address: 'Bangalore, Karnataka',
    status: 'ACTIVE'
  },
  {
    studentId: 'STU012',
    firstName: 'Arjun',
    lastName: 'Nambiar',
    email: 'arjun.nambiar@ssis.edu',
    phone: '+919876543222',
    dateOfBirth: '2004-03-22',
    gender: 'MALE',
    department: 'CSE',
    program: 'B.Tech',
    year: 2,
    semester: 4,
    enrollmentDate: '2023-08-01',
    address: 'Kochi, Kerala',
    status: 'ACTIVE'
  },
  {
    studentId: 'STU013',
    firstName: 'Pooja',
    lastName: 'Hegde',
    email: 'pooja.hegde@ssis.edu',
    phone: '+919876543223',
    dateOfBirth: '2003-11-05',
    gender: 'FEMALE',
    department: 'IT',
    program: 'B.Tech',
    year: 3,
    semester: 5,
    enrollmentDate: '2022-08-01',
    address: 'Mangalore, Karnataka',
    status: 'ACTIVE'
  },
  {
    studentId: 'STU014',
    firstName: 'Siddharth',
    lastName: 'Mehta',
    email: 'siddharth.mehta@ssis.edu',
    phone: '+919876543224',
    dateOfBirth: '2002-06-18',
    gender: 'MALE',
    department: 'MECH',
    program: 'B.Tech',
    year: 4,
    semester: 8,
    enrollmentDate: '2021-08-01',
    address: 'Ahmedabad, Gujarat',
    status: 'ACTIVE'
  },
  {
    studentId: 'STU015',
    firstName: 'Ananya',
    lastName: 'Pandey',
    email: 'ananya.pandey@ssis.edu',
    phone: '+919876543225',
    dateOfBirth: '2004-08-30',
    gender: 'FEMALE',
    department: 'AIML',
    program: 'B.Tech',
    year: 2,
    semester: 3,
    enrollmentDate: '2023-08-01',
    address: 'Mumbai, Maharashtra',
    status: 'ACTIVE'
  },
  {
    studentId: 'STU016',
    firstName: 'Harish',
    lastName: 'Kumar',
    email: 'harish.kumar@ssis.edu',
    phone: '+919876543226',
    dateOfBirth: '2003-02-12',
    gender: 'MALE',
    department: 'ECE',
    program: 'B.Tech',
    year: 3,
    semester: 6,
    enrollmentDate: '2022-08-01',
    address: 'Chennai, Tamil Nadu',
    status: 'ACTIVE'
  },
  {
    studentId: 'STU017',
    firstName: 'Tanvi',
    lastName: 'Kulkarni',
    email: 'tanvi.kulkarni@ssis.edu',
    phone: '+919876543227',
    dateOfBirth: '2005-01-19',
    gender: 'FEMALE',
    department: 'CSE',
    program: 'B.Tech',
    year: 1,
    semester: 2,
    enrollmentDate: '2024-08-01',
    address: 'Pune, Maharashtra',
    status: 'ACTIVE'
  },
  {
    studentId: 'STU018',
    firstName: 'Aditya',
    lastName: 'Joshi',
    email: 'aditya.joshi@ssis.edu',
    phone: '+919876543228',
    dateOfBirth: '2004-07-25',
    gender: 'MALE',
    department: 'CIVIL',
    program: 'B.Tech',
    year: 2,
    semester: 4,
    enrollmentDate: '2023-08-01',
    address: 'Jaipur, Rajasthan',
    status: 'ACTIVE'
  },
  {
    studentId: 'STU019',
    firstName: 'Ritu',
    lastName: 'Sen',
    email: 'ritu.sen@ssis.edu',
    phone: '+919876543229',
    dateOfBirth: '2003-12-08',
    gender: 'FEMALE',
    department: 'EEE',
    program: 'B.Tech',
    year: 3,
    semester: 5,
    enrollmentDate: '2022-08-01',
    address: 'Kolkata, West Bengal',
    status: 'ACTIVE'
  },
  {
    studentId: 'STU020',
    firstName: 'Nikhil',
    lastName: 'Deshmukh',
    email: 'nikhil.deshmukh@ssis.edu',
    phone: '+919876543230',
    dateOfBirth: '2002-10-14',
    gender: 'MALE',
    department: 'AIML',
    program: 'B.Tech',
    year: 4,
    semester: 7,
    enrollmentDate: '2021-08-01',
    address: 'Nagpur, Maharashtra',
    status: 'ACTIVE'
  }
];

const courses = [
  {
    courseId: 'C109',
    courseCode: 'CS501',
    courseName: 'Cybersecurity & Network Defense',
    description: 'Principles of threat modeling, cryptography, penetration testing, and zero-trust security.',
    department: 'CSE',
    credits: 4,
    semester: 6,
    facultyName: 'Dr. Aris Thorne',
    status: 'ACTIVE'
  },
  {
    courseId: 'C110',
    courseCode: 'AI405',
    courseName: 'Natural Language Processing & LLMs',
    description: 'Transformers, attention mechanisms, tokenization, fine-tuning, and prompt engineering.',
    department: 'AIML',
    credits: 4,
    semester: 6,
    facultyName: 'Dr. Preeti Varma',
    status: 'ACTIVE'
  },
  {
    courseId: 'C111',
    courseCode: 'IT304',
    courseName: 'Full-Stack Distributed Systems',
    description: 'Modern frontend frameworks, microservices, containerization, and REST/gRPC architectures.',
    department: 'IT',
    credits: 3,
    semester: 5,
    facultyName: 'Prof. Rajesh Krishnan',
    status: 'ACTIVE'
  },
  {
    courseId: 'C112',
    courseCode: 'DS202',
    courseName: 'Big Data Analytics & Spark',
    description: 'MapReduce paradigm, Apache Spark, stream processing, and distributed data lakes.',
    department: 'CSE',
    credits: 4,
    semester: 4,
    facultyName: 'Dr. Sunita Menon',
    status: 'ACTIVE'
  },
  {
    courseId: 'C113',
    courseCode: 'ME401',
    courseName: 'Robotics Kinematics & Autonomous Systems',
    description: 'Forward and inverse kinematics, path planning, ROS2, and LiDAR perception.',
    department: 'MECH',
    credits: 4,
    semester: 8,
    facultyName: 'Prof. Alok Gupta',
    status: 'ACTIVE'
  },
  {
    courseId: 'C114',
    courseCode: 'EC305',
    courseName: 'VLSI Design & Embedded IoT',
    description: 'CMOS circuit design, verilog HDL, FPGA prototyping, and IoT edge devices.',
    department: 'ECE',
    credits: 4,
    semester: 6,
    facultyName: 'Dr. Venkatesh Iyer',
    status: 'ACTIVE'
  }
];

const academicRecords = [
  { recordId: 'AR017', studentId: 'STU011', courseId: 'C110', academicYear: '2024-2025', semester: 6, internalMarks: 38.0, externalMarks: 57.0, attendancePercentage: 95.0, remarks: 'Outstanding grasp of Transformer architectures' },
  { recordId: 'AR018', studentId: 'STU011', courseId: 'C101', academicYear: '2024-2025', semester: 6, internalMarks: 35.0, externalMarks: 53.0, attendancePercentage: 91.0, remarks: 'Consistent high performance in AI labs' },
  { recordId: 'AR019', studentId: 'STU012', courseId: 'C109', academicYear: '2024-2025', semester: 4, internalMarks: 37.0, externalMarks: 54.0, attendancePercentage: 89.0, remarks: 'Excellent cryptography and ethical hacking labs' },
  { recordId: 'AR020', studentId: 'STU012', courseId: 'C112', academicYear: '2024-2025', semester: 4, internalMarks: 34.0, externalMarks: 50.0, attendancePercentage: 88.0, remarks: 'Solid work on Spark distributed pipeline' },
  { recordId: 'AR021', studentId: 'STU013', courseId: 'C111', academicYear: '2024-2025', semester: 5, internalMarks: 36.0, externalMarks: 55.0, attendancePercentage: 94.0, remarks: 'Exceptional full stack project implementation' },
  { recordId: 'AR022', studentId: 'STU014', courseId: 'C113', academicYear: '2024-2025', semester: 8, internalMarks: 39.0, externalMarks: 58.0, attendancePercentage: 97.0, remarks: 'Built an autonomous rover with ROS2 navigation' },
  { recordId: 'AR023', studentId: 'STU015', courseId: 'C101', academicYear: '2024-2025', semester: 3, internalMarks: 32.0, externalMarks: 46.0, attendancePercentage: 86.0, remarks: 'Good conceptual clarity in search algorithms' },
  { recordId: 'AR024', studentId: 'STU016', courseId: 'C114', academicYear: '2024-2025', semester: 6, internalMarks: 36.0, externalMarks: 52.0, attendancePercentage: 90.0, remarks: 'Impressive FPGA synthesis project' },
  { recordId: 'AR025', studentId: 'STU017', courseId: 'C102', academicYear: '2024-2025', semester: 2, internalMarks: 33.0, externalMarks: 48.0, attendancePercentage: 85.0, remarks: 'Solid understanding of graph algorithms' },
  { recordId: 'AR026', studentId: 'STU018', courseId: 'C108', academicYear: '2024-2025', semester: 4, internalMarks: 31.0, externalMarks: 45.0, attendancePercentage: 84.0, remarks: 'Well documented thermodynamics experiments' },
  { recordId: 'AR027', studentId: 'STU019', courseId: 'C107', academicYear: '2024-2025', semester: 5, internalMarks: 34.0, externalMarks: 49.0, attendancePercentage: 88.0, remarks: 'Good performance in control systems analysis' },
  { recordId: 'AR028', studentId: 'STU020', courseId: 'C110', academicYear: '2024-2025', semester: 7, internalMarks: 39.0, externalMarks: 59.0, attendancePercentage: 98.0, remarks: 'Top ranking research paper submission in NLP' },
  { recordId: 'AR029', studentId: 'STU001', courseId: 'C110', academicYear: '2024-2025', semester: 6, internalMarks: 38.0, externalMarks: 58.0, attendancePercentage: 96.0, remarks: 'Pioneering LLM fine-tuning capstone' },
  { recordId: 'AR030', studentId: 'STU002', courseId: 'C109', academicYear: '2024-2025', semester: 6, internalMarks: 36.0, externalMarks: 53.0, attendancePercentage: 92.0, remarks: 'Robust vulnerability assessment submission' }
];

async function seed() {
  console.log('Seeding Students...');
  for (const s of students) {
    try {
      const res = await postJson('/api/students', s);
      console.log(`Student ${s.studentId}: ${res.status}`);
    } catch (e) {
      console.error(`Error student ${s.studentId}:`, e.message);
    }
  }

  console.log('\nSeeding Courses...');
  for (const c of courses) {
    try {
      const res = await postJson('/api/courses', c);
      console.log(`Course ${c.courseId} (${c.courseCode}): ${res.status}`);
    } catch (e) {
      console.error(`Error course ${c.courseId}:`, e.message);
    }
  }

  console.log('\nSeeding Academic Records...');
  for (const a of academicRecords) {
    try {
      const res = await postJson('/api/academic-records', a);
      console.log(`Record ${a.recordId} (${a.studentId} - ${a.courseId}): ${res.status}`);
    } catch (e) {
      console.error(`Error record ${a.recordId}:`, e.message);
    }
  }

  console.log('\nAll data seeded successfully!');
}

seed();
