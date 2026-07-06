import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding database...');

  // Helper to hash passwords
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const facultyPassword = await bcrypt.hash('faculty123', salt);
  const studentPassword = await bcrypt.hash('student123', salt);
  const parentPassword = await bcrypt.hash('parent123', salt);

  // 1. Create System Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@erp.com' },
    update: {},
    create: {
      email: 'admin@erp.com',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      adminProfile: {
        create: {
          firstName: 'System',
          lastName: 'Administrator',
          phone: '9876543210',
        },
      },
    },
  });
  console.log('Admin user seeded:', adminUser.email);

  // 2. Create 25 Departments
  const departmentsData = [];
  const deptNames = [
    'Computer Science', 'Information Technology', 'Electronics & Comm', 'Electrical & Electronics',
    'Mechanical Eng', 'Civil Eng', 'Chemical Eng', 'Aerospace Eng', 'Biotechnology',
    'Physics', 'Chemistry', 'Mathematics', 'Humanities', 'Business Administration',
    'Data Science', 'Artificial Intelligence', 'Cyber Security', 'Software Engineering',
    'Robotics & Automation', 'Metallurgical Eng', 'Mining Eng', 'Petroleum Eng',
    'Agricultural Eng', 'Food Technology', 'Textile Eng'
  ];

  for (let i = 0; i < 25; i++) {
    const name = deptNames[i] || `Department of Engineering ${i + 1}`;
    const code = name.split(' ').map(w => w[0]).join('').toUpperCase() + (i + 1);
    departmentsData.push({ name, code });
  }

  // Create departments
  const departments = [];
  for (const dept of departmentsData) {
    const createdDept = await prisma.department.upsert({
      where: { code: dept.code },
      update: {},
      create: dept,
    });
    departments.push(createdDept);
  }
  console.log('Seeded 25 Departments.');

  // 3. Create 200 Courses (8 courses per department)
  const courses = [];
  let courseCounter = 1;
  for (const dept of departments) {
    for (let c = 1; c <= 8; c++) {
      const code = `${dept.code}-C${c}`;
      const name = `Bachelor of Science in ${dept.name} - Specialization ${c}`;
      const createdCourse = await prisma.course.upsert({
        where: { code },
        update: {},
        create: {
          name,
          code,
          departmentId: dept.id,
        },
      });
      courses.push(createdCourse);
      courseCounter++;
    }
  }
  console.log(`Seeded ${courses.length} Courses (200 targeted).`);

  // 4. Create Subjects for Courses
  // For each course, create 4 subjects (total 800 subjects)
  const subjects = [];
  for (const course of courses) {
    for (let s = 1; s <= 4; s++) {
      const code = `${course.code}-SUB${s}`;
      const name = `${course.name.replace('Bachelor of Science in ', '')} Core Subject ${s}`;
      const createdSub = await prisma.subject.upsert({
        where: { code },
        update: {},
        create: {
          name,
          code,
          credits: 3,
          courseId: course.id,
        },
      });
      subjects.push(createdSub);
    }
  }
  console.log(`Seeded ${subjects.length} Subjects.`);

  // 5. Create 60 Faculty Members
  const facultyList = [];
  for (let f = 1; f <= 60; f++) {
    const email = `faculty${f}@erp.com`;
    const employeeId = `EMP${1000 + f}`;
    const deptIndex = (f - 1) % departments.length;
    const dept = departments[deptIndex];

    const createdFacultyUser = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash: facultyPassword,
        role: UserRole.FACULTY,
        facultyProfile: {
          create: {
            firstName: `FacultyFirstName${f}`,
            lastName: `LastName${f}`,
            employeeId,
            designation: f % 5 === 0 ? 'Professor' : f % 3 === 0 ? 'Associate Professor' : 'Assistant Professor',
            phone: `90000000${f.toString().padStart(2, '0')}`,
            departmentId: dept.id,
          },
        },
      },
      include: { facultyProfile: true },
    });
    if (createdFacultyUser.facultyProfile) {
      facultyList.push(createdFacultyUser.facultyProfile);
    }
  }
  console.log('Seeded 60 Faculty Members.');

  // Assign faculty to subjects
  // Go through subjects and link a faculty member matching the department
  for (let i = 0; i < subjects.length; i++) {
    const subject = subjects[i];
    const course = courses.find(c => c.id === subject.courseId);
    if (course) {
      const deptFaculty = facultyList.filter(f => f.departmentId === course.departmentId);
      if (deptFaculty.length > 0) {
        const assignedFac = deptFaculty[i % deptFaculty.length];
        await prisma.subject.update({
          where: { id: subject.id },
          data: { facultyId: assignedFac.id },
        });
      }
    }
  }
  console.log('Assigned Faculty to Subjects.');

  // 6. Create 500 Students and 500 Parents
  const studentsList = [];
  for (let s = 1; s <= 500; s++) {
    const studentEmail = `student${s}@erp.com`;
    const parentEmail = `parent${s}@erp.com`;
    const rollNumber = `ROLL${2026000 + s}`;
    
    // Distribute among courses
    const courseIndex = (s - 1) % courses.length;
    const course = courses[courseIndex];

    // Create Parent first
    const parentUser = await prisma.user.upsert({
      where: { email: parentEmail },
      update: {},
      create: {
        email: parentEmail,
        passwordHash: parentPassword,
        role: UserRole.PARENT,
        parentProfile: {
          create: {
            firstName: `ParentFN${s}`,
            lastName: `LN${s}`,
            phone: `91111111${s.toString().padStart(3, '0')}`,
          },
        },
      },
      include: { parentProfile: true },
    });

    // Create Student
    const studentUser = await prisma.user.upsert({
      where: { email: studentEmail },
      update: {},
      create: {
        email: studentEmail,
        passwordHash: studentPassword,
        role: UserRole.STUDENT,
        studentProfile: {
          create: {
            firstName: `StudentFN${s}`,
            lastName: `LN${s}`,
            rollNumber,
            phone: `92222222${s.toString().padStart(3, '0')}`,
            departmentId: course.departmentId,
            courseId: course.id,
            parentId: parentUser.parentProfile?.id,
          },
        },
      },
      include: { studentProfile: true },
    });

    if (studentUser.studentProfile) {
      studentsList.push(studentUser.studentProfile);
    }
  }
  console.log('Seeded 500 Students & 500 Linked Parents.');

  // 7. Seed 2500 Attendance Records (5 records per student)
  console.log('Seeding 2,500 Attendance Records...');
  const attendanceBatches = [];
  const today = new Date();
  for (let r = 0; r < 5; r++) {
    const attendanceDate = new Date();
    attendanceDate.setDate(today.getDate() - r);
    for (const student of studentsList) {
      // 90% Present, 10% Absent/Late
      const rand = Math.random();
      const status = rand > 0.1 ? 'PRESENT' : rand > 0.03 ? 'ABSENT' : 'LATE';
      attendanceBatches.push({
        studentId: student.id,
        date: new Date(attendanceDate.toISOString().split('T')[0]),
        status,
      });
    }
  }
  
  // Batch insert
  await prisma.attendance.createMany({
    data: attendanceBatches,
  });
  console.log('Attendance Records seeded.');

  // 8. Seed 1500 Fee Transactions (3 payments per student)
  console.log('Seeding 1,500 Fee Transactions...');
  const paymentBatches = [];
  const feeCategories = ['TUITION', 'HOSTEL', 'TRANSPORT'];
  const feeAmounts = [3500.0, 1500.0, 500.0];
  for (let p = 0; p < 3; p++) {
    let invoiceCounter = 1;
    for (const student of studentsList) {
      const amount = feeAmounts[p];
      const category = feeCategories[p];
      const status = Math.random() > 0.15 ? 'SUCCESS' : 'PENDING';
      const paymentMethod = ['CARD', 'UPI', 'NET_BANKING'][Math.floor(Math.random() * 3)];
      paymentBatches.push({
        studentId: student.id,
        amount,
        category,
        status,
        paymentMethod,
        invoiceNumber: `INV-2026-${student.rollNumber}-${p}`,
        paymentDate: new Date(),
      });
      invoiceCounter++;
    }
  }

  await prisma.payment.createMany({
    data: paymentBatches,
  });
  console.log('Fee Transactions seeded.');

  // 9. Seed 800 Assignments
  console.log('Seeding 800 Assignments...');
  const assignmentBatches = [];
  // Gather unique subjects from the database to create assignments for
  const allDbSubjects = await prisma.subject.findMany({ select: { id: true } });
  
  // Assign 1 assignment to each subject (total ~800 subjects)
  for (let i = 0; i < allDbSubjects.length; i++) {
    const subject = allDbSubjects[i];
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 7);
    assignmentBatches.push({
      title: `Core Assignment Task ${i + 1}`,
      description: `Complete all questions and submit the PDF. Covers module 1 & 2 topics.`,
      dueDate,
      subjectId: subject.id,
      fileUrl: `https://res.cloudinary.com/mock/pdf/assignment-${i + 1}.pdf`,
    });
  }

  await prisma.assignment.createMany({
    data: assignmentBatches,
  });
  console.log('Assignments seeded.');

  // 10. Seed Hostel Rooms, Transport Routes, Announcements
  console.log('Seeding Room, Route & Notices...');
  await prisma.hostelRoom.createMany({
    data: [
      { roomNumber: 'H101', blockName: 'A-Block', capacity: 4, occupancy: 0, fee: 1500.0 },
      { roomNumber: 'H102', blockName: 'A-Block', capacity: 4, occupancy: 0, fee: 1500.0 },
      { roomNumber: 'H201', blockName: 'B-Block', capacity: 2, occupancy: 0, fee: 2500.0 },
    ],
  });

  await prisma.transportRoute.createMany({
    data: [
      { name: 'Route-A (Central Metro Line)', vehicleNumber: 'KA-01-E-1234', driverName: 'Ramesh Kumar', fee: 500.0 },
      { name: 'Route-B (North Suburbs)', vehicleNumber: 'KA-01-E-5678', driverName: 'Suresh Patil', fee: 600.0 },
    ],
  });

  await prisma.announcement.createMany({
    data: [
      { title: 'Semester Exams Registration Open', content: 'Register for final year exams before the deadline of 15th July.', postedBy: 'Dean Academics' },
      { title: 'Annual Cultural Festival - Milange 2026', content: 'Milange will start from 20th August. Get your registrations done at student council desk.', postedBy: 'Student Affairs' },
    ],
  });

  console.log('Database Seeding Completed Successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
