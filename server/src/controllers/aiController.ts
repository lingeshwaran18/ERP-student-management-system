import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { erpKnowledgeBase } from '../utils/aiKnowledgeBase';

const prisma = new PrismaClient();

// AI Chatbot Assistant
export const getAiAssistantResponse = async (req: AuthenticatedRequest, res: Response) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Validation Error', message: 'Message content is required' });

  try {
    const text = message.toLowerCase().trim();
    let reply: string | null = null;

    // ── STAGE 1: Exact question text match ─────────────────────────────────
    for (const item of erpKnowledgeBase) {
      if (text === item.q.toLowerCase() || text.includes(item.q.toLowerCase())) {
        reply = item.a;
        break;
      }
    }

    // ── STAGE 2: Specific multi-word keyword match (only keywords 3+ words) ─
    if (!reply) {
      let bestItem = null;
      let bestLen = 0;
      for (const item of erpKnowledgeBase) {
        for (const kw of item.keywords) {
          if (kw.split(' ').length >= 3 && text.includes(kw)) {
            if (kw.length > bestLen) {
              bestLen = kw.length;
              bestItem = item;
            }
          }
        }
      }
      if (bestItem) reply = bestItem.a;
    }

    // ── STAGE 3: 2-word keyword match with word-overlap guard ───────────────
    if (!reply) {
      let bestItem = null;
      let bestLen = 0;
      for (const item of erpKnowledgeBase) {
        for (const kw of item.keywords) {
          if (kw.split(' ').length === 2 && text.includes(kw)) {
            const qWords = item.q.toLowerCase().split(' ');
            const inputWords = text.split(' ');
            const overlap = qWords.filter((w: string) => w.length > 3 && inputWords.includes(w)).length;
            if (overlap >= 2 && kw.length > bestLen) {
              bestLen = kw.length;
              bestItem = item;
            }
          }
        }
      }
      if (bestItem) reply = bestItem.a;
    }

    // ── FALLBACK: Database aggregation ─────────────────────────────────────
    if (!reply) {
      if (text.includes('attendance') || text.includes('present')) {
        const avgAttendance = await prisma.attendance.groupBy({ by: ['status'], _count: true });
        reply = `Attendance breakdown: ${avgAttendance.map((a: any) => `${a.status}: ${a._count}`).join(', ')}. Standard rate is ~90.4%.`;
      } else if (text.includes('total students') || text.includes('how many students')) {
        const studentCount = await prisma.student.count();
        const facultyCount = await prisma.faculty.count();
        reply = `There are currently ${studentCount} active students and ${facultyCount} faculty members enrolled in the ERP system.`;
      } else {
        reply = "I couldn't find an exact answer for that. Try asking the full question — for example: \"How is attendance percentage calculated?\" or \"Why is JWT used in the project?\"";
      }
    }

    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error('AI assistant error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

// AI Student Performance Predictor
export const getStudentPerformancePrediction = async (req: AuthenticatedRequest, res: Response) => {
  const { studentId } = req.params;

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        attendance: true,
        marks: true,
      }
    });

    if (!student) return res.status(404).json({ error: 'Not Found', message: 'Student not found' });

    // Performance math: Present percentage
    const totalDays = student.attendance.length;
    const presentDays = student.attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 85;

    // Average mark percentage
    const totalMarks = student.marks.reduce((acc, m) => acc + (m.marksObtained / m.maxMarks), 0);
    const markRate = student.marks.length > 0 ? (totalMarks / student.marks.length) * 100 : 75;

    // AI Prediction Rules
    let predictedGPA = 1.0 + (markRate / 30) + (attendanceRate / 200);
    predictedGPA = Math.min(Math.max(predictedGPA, 0.0), 4.0); // Bound between 0.0 - 4.0

    let status = 'EXCELLENT';
    let recommendations = 'Maintain current work ethic. Standard path leads to graduation with honors.';
    if (predictedGPA < 2.0) {
      status = 'CRITICAL_RISK';
      recommendations = 'At high risk of course failure. Recommended action: Mandate remedial classes and notify parents immediately.';
    } else if (predictedGPA < 2.8) {
      status = 'NEEDS_IMPROVEMENT';
      recommendations = 'Borderline performance. Focus on class attendance and complete additional worksheets.';
    }

    return res.status(200).json({
      studentId: student.id,
      rollNumber: student.rollNumber,
      attendancePercentage: attendanceRate.toFixed(1),
      academicPercentage: markRate.toFixed(1),
      predictedGPA: predictedGPA.toFixed(2),
      performanceStatus: status,
      aiRecommendations: recommendations,
      predictionModel: 'ERP-SmartPredict v2.4 (Logistical Regression Mock)'
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

// AI Notice Summarizer
export const getNoticeSummary = async (req: AuthenticatedRequest, res: Response) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Validation Error', message: 'Text is required to summarize' });

  try {
    const sentences = text.split(/[.!?]+/).map((s: string) => s.trim()).filter((s: string) => s.length > 5);
    const bullets = sentences.slice(0, 3).map((s: string) => `• ${s}`);

    return res.status(200).json({
      summary: bullets.join('\n') || '• Announcement posted.',
      reducedLength: `${Math.round((bullets.join(' ').length / text.length) * 100)}%`
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

// Global Search
export const globalSearch = async (req: AuthenticatedRequest, res: Response) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Validation Error', message: 'Search query is required' });

  const q = String(query);

  try {
    // Search Students, Faculty, Courses, Announcements, Events
    const [students, faculty, courses, announcements, events] = await prisma.$transaction([
      prisma.student.findMany({
        where: {
          OR: [
            { firstName: { contains: q, mode: 'insensitive' } },
            { lastName: { contains: q, mode: 'insensitive' } },
            { rollNumber: { contains: q, mode: 'insensitive' } },
          ]
        },
        take: 5
      }),
      prisma.faculty.findMany({
        where: {
          OR: [
            { firstName: { contains: q, mode: 'insensitive' } },
            { lastName: { contains: q, mode: 'insensitive' } },
            { employeeId: { contains: q, mode: 'insensitive' } },
          ]
        },
        take: 5
      }),
      prisma.course.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { code: { contains: q, mode: 'insensitive' } },
          ]
        },
        take: 5
      }),
      prisma.announcement.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { content: { contains: q, mode: 'insensitive' } },
          ]
        },
        take: 5
      }),
      prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ]
        },
        take: 5
      }),
    ]);

    return res.status(200).json({
      query: q,
      results: {
        students,
        faculty,
        courses,
        announcements,
        events
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};
