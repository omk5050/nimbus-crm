import type { Request, Response } from 'express';
import * as svc from './tasks.service';
import { taskSchema, moveStatusSchema, taskListQuerySchema } from './tasks.schema';
import { paginated } from '@/utils/pagination';

export async function list(req: Request, res: Response) {
  const query = taskListQuerySchema.parse(req.query);
  const { tasks, total, page, limit } = await svc.listTasks(req.auth.companyId, query);
  paginated(res, tasks, { total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function get(req: Request, res: Response) {
  res.json(await svc.getTask(req.auth.companyId, req.params.id));
}

export async function create(req: Request, res: Response) {
  res.status(201).json(await svc.createTask(req.auth.companyId, taskSchema.parse(req.body)));
}

export async function update(req: Request, res: Response) {
  res.json(await svc.updateTask(req.auth.companyId, req.params.id, taskSchema.parse(req.body)));
}

export async function remove(req: Request, res: Response) {
  await svc.deleteTask(req.auth.companyId, req.params.id);
  res.status(204).send();
}

export async function moveStatus(req: Request, res: Response) {
  res.json(await svc.moveStatus(req.auth.companyId, req.params.id, moveStatusSchema.parse(req.body)));
}

export async function toggleDone(req: Request, res: Response) {
  res.json(await svc.toggleDone(req.auth.companyId, req.params.id));
}
