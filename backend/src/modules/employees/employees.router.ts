import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import * as controller from './employees.controller';

const router = Router();
router.use(authenticate);

router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.get);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.get('/:id/attendance', controller.listAttendance);
router.patch('/:id/attendance/today', controller.toggleAttendance);
router.get('/:id/performance', controller.getPerformance);

export default router;
