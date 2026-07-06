import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export const login = async (req: AuthenticatedRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Validation Error', message: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        adminProfile: true,
        studentProfile: {
          include: {
            department: true,
            course: true,
          }
        },
        facultyProfile: {
          include: {
            department: true,
          }
        },
        parentProfile: {
          include: {
            students: true,
          }
        },
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Auth Error', message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Auth Error', message: 'Invalid email or password' });
    }

    // Generate JWT Token
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const secret = process.env.JWT_SECRET || 'super-secret-key-for-erp-system-2026-management';
    const token = jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        details: `User logged in with role ${user.role}`,
        ipAddress: req.ip || '127.0.0.1',
      },
    });

    // Return profile specific details
    let profileData: any = {};
    if (user.role === 'ADMIN') profileData = user.adminProfile;
    if (user.role === 'STUDENT') profileData = user.studentProfile;
    if (user.role === 'FACULTY') profileData = user.facultyProfile;
    if (user.role === 'PARENT') profileData = user.parentProfile;

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: profileData,
      },
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Not authenticated' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        adminProfile: true,
        studentProfile: {
          include: {
            department: true,
            course: true,
          }
        },
        facultyProfile: {
          include: {
            department: true,
          }
        },
        parentProfile: {
          include: {
            students: {
              include: {
                department: true,
                course: true,
              }
            },
          }
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User Not Found', message: 'Account does not exist' });
    }

    let profileData: any = {};
    if (user.role === 'ADMIN') profileData = user.adminProfile;
    if (user.role === 'STUDENT') profileData = user.studentProfile;
    if (user.role === 'FACULTY') profileData = user.facultyProfile;
    if (user.role === 'PARENT') profileData = user.parentProfile;

    return res.status(200).json({
      id: user.id,
      email: user.email,
      role: user.role,
      profile: profileData,
    });
  } catch (error: any) {
    console.error('getMe Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};
