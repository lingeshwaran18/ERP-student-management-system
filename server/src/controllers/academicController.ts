import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Get Admin Statistics
export const getAdminStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const totalStudents = await prisma.student.count();
    const totalFaculty = await prisma.faculty.count();
    const totalDepartments = await prisma.department.count();
    const totalCourses = await prisma.course.count();

    // Aggregations
    const payments = await prisma.payment.findMany({
      where: { status: 'SUCCESS' },
      select: { amount: true },
    });
    const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

    const pendingPayments = await prisma.payment.findMany({
      where: { status: 'PENDING' },
      select: { amount: true },
    });
    const pendingFees = pendingPayments.reduce((acc, p) => acc + p.amount, 0);

    const hostelCount = await prisma.hostelRoom.aggregate({
      _sum: { occupancy: true, capacity: true },
    });

    const libraryCount = await prisma.libraryBook.count();
    const borrowedBooksCount = await prisma.libraryBook.count({
      where: { available: false },
    });

    const transportCount = await prisma.student.count({
      where: { routeId: { not: null } },
    });

    return res.status(200).json({
      totalStudents,
      totalFaculty,
      totalDepartments,
      totalCourses,
      revenue: totalRevenue,
      pendingFees,
      hostel: {
        occupancy: hostelCount._sum.occupancy || 0,
        capacity: hostelCount._sum.capacity || 0,
      },
      library: {
        totalBooks: libraryCount,
        borrowedBooks: borrowedBooksCount,
      },
      transportUsage: transportCount,
    });
  } catch (error: any) {
    console.error('getAdminStats Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

// Department CRUD
export const getDepartments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await prisma.department.findMany({
      include: {
        _count: {
          select: { students: true, faculty: true, courses: true }
        }
      }
    });
    return res.status(200).json(list);
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const createDepartment = async (req: AuthenticatedRequest, res: Response) => {
  const { name, code } = req.body;
  if (!name || !code) return res.status(400).json({ error: 'Missing Fields', message: 'Name and Code are required' });
  
  try {
    const dept = await prisma.department.create({ data: { name, code } });
    return res.status(201).json(dept);
  } catch (error: any) {
    return res.status(500).json({ error: 'Database Error', message: error.message });
  }
};

// Course CRUD
export const getCourses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await prisma.course.findMany({
      include: {
        department: { select: { name: true, code: true } },
        _count: { select: { students: true, subjects: true } }
      }
    });
    return res.status(200).json(list);
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const createCourse = async (req: AuthenticatedRequest, res: Response) => {
  const { name, code, departmentId } = req.body;
  if (!name || !code || !departmentId) {
    return res.status(400).json({ error: 'Missing Fields', message: 'Name, Code, and Department ID are required' });
  }

  try {
    const course = await prisma.course.create({
      data: { name, code, departmentId }
    });
    return res.status(201).json(course);
  } catch (error: any) {
    return res.status(500).json({ error: 'Database Error', message: error.message });
  }
};

// Student CRUD
export const getStudents = async (req: AuthenticatedRequest, res: Response) => {
  const { page = 1, limit = 50, search = '' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  
  try {
    const where: any = {};
    if (search) {
      where.OR = [
        { firstName: { contains: String(search), mode: 'insensitive' } },
        { lastName: { contains: String(search), mode: 'insensitive' } },
        { rollNumber: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const total = await prisma.student.count({ where });
    const students = await prisma.student.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        user: { select: { email: true } },
        department: { select: { name: true, code: true } },
        course: { select: { name: true, code: true } },
        parent: { select: { firstName: true, lastName: true, phone: true } },
      },
      orderBy: { rollNumber: 'asc' },
    });

    return res.status(200).json({ total, page: Number(page), limit: Number(limit), students });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const createStudent = async (req: AuthenticatedRequest, res: Response) => {
  const { email, password, firstName, lastName, rollNumber, phone, departmentId, courseId, parentEmail, parentFirstName, parentLastName, parentPhone } = req.body;

  if (!email || !password || !firstName || !lastName || !rollNumber || !departmentId || !courseId) {
    return res.status(400).json({ error: 'Missing Fields', message: 'Credentials, Name, Roll Number, Department, and Course are required' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Dynamic Parent lookup or creation
    let parentId: string | undefined = undefined;
    if (parentEmail) {
      const parentUser = await prisma.user.upsert({
        where: { email: parentEmail },
        update: {},
        create: {
          email: parentEmail,
          passwordHash: await bcrypt.hash('parent123', salt),
          role: 'PARENT',
          parentProfile: {
            create: {
              firstName: parentFirstName || 'ParentFN',
              lastName: parentLastName || lastName,
              phone: parentPhone || '9999999999',
            }
          }
        },
        include: { parentProfile: true }
      });
      parentId = parentUser.parentProfile?.id;
    }

    const studentUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'STUDENT',
        studentProfile: {
          create: {
            firstName,
            lastName,
            rollNumber,
            phone,
            departmentId,
            courseId,
            parentId,
          }
        }
      },
      include: { studentProfile: true }
    });

    return res.status(201).json(studentUser.studentProfile);
  } catch (error: any) {
    return res.status(500).json({ error: 'Database Error', message: error.message });
  }
};

// Faculty CRUD
export const getFaculty = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await prisma.faculty.findMany({
      include: {
        user: { select: { email: true } },
        department: { select: { name: true, code: true } },
        subjects: { select: { name: true, code: true } }
      }
    });
    return res.status(200).json(list);
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const createFaculty = async (req: AuthenticatedRequest, res: Response) => {
  const { email, password, firstName, lastName, employeeId, designation, phone, departmentId } = req.body;

  if (!email || !password || !firstName || !lastName || !employeeId || !designation || !departmentId) {
    return res.status(400).json({ error: 'Missing Fields', message: 'All core details are required' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const facultyUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'FACULTY',
        facultyProfile: {
          create: {
            firstName,
            lastName,
            employeeId,
            designation,
            phone,
            departmentId,
          }
        }
      },
      include: { facultyProfile: true }
    });

    return res.status(201).json(facultyUser.facultyProfile);
  } catch (error: any) {
    return res.status(500).json({ error: 'Database Error', message: error.message });
  }
};
