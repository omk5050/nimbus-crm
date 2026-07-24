import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import * as controller from './auth.controller';

const router = Router();

// Public routes
router.post('/login', controller.login);
router.post('/refresh', controller.refresh);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);

// Protected routes
router.post('/logout', authenticate, controller.logout);
router.get('/me', authenticate, controller.getMe);

export default router;
