import { Router } from 'express';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware';
import { 
  getAdminStats, 
  getDepartments, 
  createDepartment, 
  getCourses, 
  createCourse, 
  getStudents, 
  createStudent, 
  getFaculty, 
  createFaculty 
} from '../controllers/academicController';
import {
  getAttendance,
  submitAttendance,
  getExams,
  createExam,
  getStudentMarks,
  submitMarks,
  getAssignments,
  createAssignment,
  getFeePayments,
  createPayment,
  getComplaints,
  createComplaint,
  resolveComplaint,
  getAnnouncements,
  createAnnouncement,
  getEvents,
  getLibraryBooks,
  getHostelRooms,
  getTransportRoutes
} from '../controllers/operationsController';
import {
  getAiAssistantResponse,
  getStudentPerformancePrediction,
  getNoticeSummary,
  globalSearch
} from '../controllers/aiController';

const router = Router();

// Apply auth token validation to all sub-routes
router.use(authenticateToken as any);

// Global Fuzzy Search
router.get('/search', globalSearch as any);

// Administrative Dashboard Summary
router.get('/admin/stats', requireRole(['ADMIN']) as any, getAdminStats as any);

// Department endpoints
router.get('/departments', getDepartments as any);
router.post('/departments', requireRole(['ADMIN']) as any, createDepartment as any);

// Course endpoints
router.get('/courses', getCourses as any);
router.post('/courses', requireRole(['ADMIN']) as any, createCourse as any);

// Student profiles
router.get('/students', requireRole(['ADMIN', 'FACULTY']) as any, getStudents as any);
router.post('/students', requireRole(['ADMIN']) as any, createStudent as any);

// Faculty profiles
router.get('/faculty', requireRole(['ADMIN', 'STUDENT']) as any, getFaculty as any);
router.post('/faculty', requireRole(['ADMIN']) as any, createFaculty as any);

// Attendance Module
router.get('/attendance', getAttendance as any);
router.post('/attendance', requireRole(['FACULTY']) as any, submitAttendance as any);

// Exams endpoints
router.get('/exams', getExams as any);
router.post('/exams', requireRole(['ADMIN']) as any, createExam as any);

// Marks entry
router.get('/marks', getStudentMarks as any);
router.post('/marks', requireRole(['FACULTY']) as any, submitMarks as any);

// Assignments Management
router.get('/assignments', getAssignments as any);
router.post('/assignments', requireRole(['FACULTY']) as any, createAssignment as any);

// Finance & Fee payments
router.get('/payments', getFeePayments as any);
router.post('/payments', requireRole(['STUDENT']) as any, createPayment as any);

// Support Complaints Portal
router.get('/complaints', requireRole(['ADMIN']) as any, getComplaints as any);
router.post('/complaints', createComplaint as any);
router.patch('/complaints/:id/resolve', requireRole(['ADMIN']) as any, resolveComplaint as any);

// Communication: Announcements & Events
router.get('/announcements', getAnnouncements as any);
router.post('/announcements', requireRole(['ADMIN', 'FACULTY']) as any, createAnnouncement as any);
router.get('/events', getEvents as any);

// Auxiliary Modules: Library, Hostel, Transport
router.get('/library/books', getLibraryBooks as any);
router.get('/hostel/rooms', getHostelRooms as any);
router.get('/transport/routes', getTransportRoutes as any);

// AI Features Mocks
router.post('/ai/assistant', getAiAssistantResponse as any);
router.post('/ai/summarize', getNoticeSummary as any);
router.get('/ai/predict/:studentId', requireRole(['ADMIN', 'FACULTY']) as any, getStudentPerformancePrediction as any);

export default router;
