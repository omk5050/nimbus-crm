import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import * as controller from './leads.controller';

const router = Router();
router.use(authenticate);

router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.get);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.patch('/:id/stage', controller.moveStage);
router.patch('/:id/owner', controller.assignOwner);
router.get('/:id/activity', controller.listActivity);
router.post('/:id/activity', controller.logActivity);

export default router;
