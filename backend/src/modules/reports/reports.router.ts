import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import * as controller from './reports.controller';

const router = Router();
router.use(authenticate);

router.get('/revenue', controller.revenue);
router.get('/sales', controller.sales);
router.get('/leads', controller.leads);
router.get('/employees', controller.employees);

export default router;
