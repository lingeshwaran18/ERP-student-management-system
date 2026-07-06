import { Router } from 'express';
import { login, getMe } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/login', login);
router.get('/me', authenticateToken as any, getMe as any);

export default router;
