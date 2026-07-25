import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import * as ctrl from './tables.controller';

export const tablesRouter = Router();

tablesRouter.use(authenticate);

tablesRouter.get('/', ctrl.list);
tablesRouter.post('/', ctrl.create);
tablesRouter.get('/:id', ctrl.get);
tablesRouter.patch('/:id/reserve', ctrl.reserve);
tablesRouter.patch('/:id/extend', ctrl.extend);
tablesRouter.patch('/:id/clear', ctrl.clear);
tablesRouter.delete('/:id', ctrl.remove);
