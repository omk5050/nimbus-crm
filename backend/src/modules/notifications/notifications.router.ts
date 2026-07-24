import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import * as controller from './notifications.controller';

const router = Router();
router.use(authenticate);

router.get('/', controller.list);
router.patch('/read-all', controller.markAllAsRead);
router.delete('/', controller.clearAll);
router.patch('/:id/read', controller.markAsRead);
router.delete('/:id', controller.deleteOne);

export default router;
