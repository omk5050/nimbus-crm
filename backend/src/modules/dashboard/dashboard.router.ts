import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import * as controller from './dashboard.controller';

const router = Router();
router.use(authenticate);

router.get('/summary', controller.summary);
router.get('/revenue-trend', controller.revenueTrend);
router.get('/lead-source-breakdown', controller.leadSourceBreakdown);
router.get('/recent-activity', controller.recentActivity);

export default router;
