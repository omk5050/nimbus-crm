import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import * as controller from './tasks.controller';

const router = Router();
router.use(authenticate);

router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.get);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);
router.patch('/:id/status', controller.moveStatus);
router.patch('/:id/toggle-done', controller.toggleDone);

export default router;
