import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

// ATTENDANCE
export const getAttendance = async (req: AuthenticatedRequest, res: Response) => {
  const { studentId, date } = req.query;

  try {
    const where: any = {};
    if (studentId) where.studentId = String(studentId);
    if (date) where.date = new Date(String(date));

    // If student, restrict to own profile
    if (req.user?.role === 'STUDENT') {
      const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
      if (!student) return res.status(404).json({ error: 'Not Found', message: 'Student profile missing' });
      where.studentId = student.id;
    }

    const records = await prisma.attendance.findMany({
      where,
      include: {
        student: { select: { firstName: true, lastName: true, rollNumber: true } }
      },
      orderBy: { date: 'desc' }
    });

    return res.status(200).json(records);
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const submitAttendance = async (req: AuthenticatedRequest, res: Response) => {
  const { date, records } = req.body; // records: [{ studentId: string, status: 'PRESENT'|'ABSENT' }]
  if (!date || !records || !Array.isArray(records)) {
    return res.status(400).json({ error: 'Validation Error', message: 'Date and array of records are required' });
  }

  try {
    const formattedDate = new Date(new Date(date).toISOString().split('T')[0]);
    
    // Process records in a transaction: delete old entries for this date/student to avoid duplicate keys, and write new
    const operations = records.map((rec: any) => {
      return prisma.attendance.create({
        data: {
          studentId: rec.studentId,
          date: formattedDate,
          status: rec.status,
        }
      });
    });

    // Delete existing records for these students on this specific day first
    const studentIds = records.map(r => r.studentId);
    await prisma.attendance.deleteMany({
      where: {
        date: formattedDate,
        studentId: { in: studentIds }
      }
    });

    const results = await prisma.$transaction(operations);
    return res.status(201).json({ message: 'Attendance recorded successfully', count: results.length });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

// MARKS & EXAMS
export const getExams = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await prisma.examination.findMany({ orderBy: { date: 'desc' } });
    return res.status(200).json(list);
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const createExam = async (req: AuthenticatedRequest, res: Response) => {
  const { name, date, type } = req.body;
  if (!name || !date || !type) return res.status(400).json({ error: 'Missing Fields', message: 'Name, Date, and Type are required' });

  try {
    const exam = await prisma.examination.create({
      data: { name, date: new Date(date), type }
    });
    return res.status(201).json(exam);
  } catch (error: any) {
    return res.status(500).json({ error: 'Database Error', message: error.message });
  }
};

export const getStudentMarks = async (req: AuthenticatedRequest, res: Response) => {
  const { studentId, subjectId, examinationId } = req.query;

  try {
    const where: any = {};
    if (subjectId) where.subjectId = String(subjectId);
    if (examinationId) where.examinationId = String(examinationId);

    if (req.user?.role === 'STUDENT') {
      const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
      if (!student) return res.status(404).json({ error: 'Not Found', message: 'Student profile missing' });
      where.studentId = student.id;
    } else if (studentId) {
      where.studentId = String(studentId);
    }

    const marks = await prisma.mark.findMany({
      where,
      include: {
        student: { select: { firstName: true, lastName: true, rollNumber: true } },
        subject: { select: { name: true, code: true } },
        examination: { select: { name: true, date: true } },
      },
    });

    return res.status(200).json(marks);
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const submitMarks = async (req: AuthenticatedRequest, res: Response) => {
  const { studentId, subjectId, examinationId, marksObtained, maxMarks } = req.body;
  
  if (!studentId || !subjectId || !examinationId || marksObtained === undefined || !maxMarks) {
    return res.status(400).json({ error: 'Missing Fields', message: 'Student, Subject, Exam, Score, and Max Score are required' });
  }

  try {
    // Delete existing matching score to prevent uniqueness issues if updating
    await prisma.mark.deleteMany({
      where: { studentId, subjectId, examinationId }
    });

    const mark = await prisma.mark.create({
      data: {
        studentId,
        subjectId,
        examinationId,
        marksObtained: Float32Array.of(marksObtained)[0],
        maxMarks: Float32Array.of(maxMarks)[0],
      }
    });

    return res.status(201).json(mark);
  } catch (error: any) {
    return res.status(500).json({ error: 'Database Error', message: error.message });
  }
};

// ASSIGNMENTS
export const getAssignments = async (req: AuthenticatedRequest, res: Response) => {
  const { subjectId } = req.query;

  try {
    const where: any = {};
    if (subjectId) where.subjectId = String(subjectId);

    // If Student role, find assignments for subjects in their course
    if (req.user?.role === 'STUDENT') {
      const student = await prisma.student.findUnique({
        where: { userId: req.user.id },
        select: { courseId: true }
      });
      if (student) {
        where.subject = { courseId: student.courseId };
      }
    }

    const list = await prisma.assignment.findMany({
      where,
      include: {
        subject: { select: { name: true, code: true } }
      },
      orderBy: { dueDate: 'asc' }
    });

    return res.status(200).json(list);
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const createAssignment = async (req: AuthenticatedRequest, res: Response) => {
  const { title, description, dueDate, fileUrl, subjectId } = req.body;
  if (!title || !dueDate || !subjectId) {
    return res.status(400).json({ error: 'Missing Fields', message: 'Title, Due Date, and Subject ID are required' });
  }

  try {
    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        fileUrl,
        subjectId
      }
    });
    return res.status(201).json(assignment);
  } catch (error: any) {
    return res.status(500).json({ error: 'Database Error', message: error.message });
  }
};

// PAYMENTS & FEES
export const getFeePayments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const where: any = {};
    if (req.user?.role === 'STUDENT') {
      const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
      if (student) where.studentId = student.id;
    } else if (req.user?.role === 'PARENT') {
      const parent = await prisma.parent.findUnique({
        where: { userId: req.user.id },
        include: { students: true }
      });
      if (parent) {
        where.studentId = { in: parent.students.map(s => s.id) };
      }
    }

    const list = await prisma.payment.findMany({
      where,
      include: {
        student: { select: { firstName: true, lastName: true, rollNumber: true } }
      },
      orderBy: { paymentDate: 'desc' }
    });

    return res.status(200).json(list);
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const createPayment = async (req: AuthenticatedRequest, res: Response) => {
  const { amount, category, paymentMethod } = req.body;

  if (!amount || !category || !paymentMethod) {
    return res.status(400).json({ error: 'Validation Error', message: 'Amount, Category, and Payment Method are required' });
  }

  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user?.id }
    });

    if (!student) {
      return res.status(404).json({ error: 'Not Found', message: 'Student profile not found for this user' });
    }

    const invoiceNumber = `INV-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const payment = await prisma.payment.create({
      data: {
        studentId: student.id,
        amount: Float32Array.of(amount)[0],
        category,
        paymentMethod,
        invoiceNumber,
        status: 'SUCCESS', // Simulate automatic checkout success
      }
    });

    return res.status(201).json(payment);
  } catch (error: any) {
    return res.status(500).json({ error: 'Database Error', message: error.message });
  }
};

// COMPLAINTS
export const getComplaints = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await prisma.complaint.findMany({ orderBy: { createdAt: 'desc' } });
    return res.status(200).json(list);
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const createComplaint = async (req: AuthenticatedRequest, res: Response) => {
  const { title, description } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'Missing Fields', message: 'Title and Description are required' });

  try {
    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        submittedBy: req.user?.email || 'Anonymous',
      }
    });
    return res.status(201).json(complaint);
  } catch (error: any) {
    return res.status(500).json({ error: 'Database Error', message: error.message });
  }
};

export const resolveComplaint = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { resolution, status } = req.body; // status: RESOLVED or REJECTED

  try {
    const complaint = await prisma.complaint.update({
      where: { id },
      data: {
        resolution,
        status: status || 'RESOLVED',
      }
    });
    return res.status(200).json(complaint);
  } catch (error: any) {
    return res.status(500).json({ error: 'Database Error', message: error.message });
  }
};

// ANNOUNCEMENTS
export const getAnnouncements = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await prisma.announcement.findMany({ orderBy: { date: 'desc' } });
    return res.status(200).json(list);
  } catch (error: any) {
    return res.status(500).json(list); // fallback
  }
};

export const createAnnouncement = async (req: AuthenticatedRequest, res: Response) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Missing Fields', message: 'Title and Content are required' });

  try {
    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        postedBy: req.user?.role === 'ADMIN' ? 'Administrator' : 'Faculty Member',
      }
    });
    return res.status(201).json(announcement);
  } catch (error: any) {
    return res.status(500).json({ error: 'Database Error', message: error.message });
  }
};

// EVENTS
export const getEvents = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await prisma.event.findMany({ orderBy: { date: 'asc' } });
    return res.status(200).json(list);
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

// LIBRARY
export const getLibraryBooks = async (req: AuthenticatedRequest, res: Response) => {
  const { search } = req.query;

  try {
    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { author: { contains: String(search), mode: 'insensitive' } },
        { isbn: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const books = await prisma.libraryBook.findMany({ where });
    return res.status(200).json(books);
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

// HOSTEL
export const getHostelRooms = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const rooms = await prisma.hostelRoom.findMany();
    return res.status(200).json(rooms);
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

// TRANSPORT
export const getTransportRoutes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const routes = await prisma.transportRoute.findMany();
    return res.status(200).json(routes);
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};
