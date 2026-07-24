import type { Request, Response } from 'express';
import * as svc from './employees.service';
import { employeeSchema, employeeListQuerySchema } from './employees.schema';
import { paginated } from '@/utils/pagination';

export async function list(req: Request, res: Response) {
  const query = employeeListQuerySchema.parse(req.query);
  const { employees, total, page, limit } = await svc.listEmployees(req.auth.companyId, query);
  paginated(res, employees, { total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function get(req: Request, res: Response) {
  res.json(await svc.getEmployee(req.auth.companyId, req.params.id));
}

export async function create(req: Request, res: Response) {
  res.status(201).json(await svc.createEmployee(req.auth.companyId, employeeSchema.parse(req.body)));
}

export async function update(req: Request, res: Response) {
  res.json(await svc.updateEmployee(req.auth.companyId, req.params.id, employeeSchema.parse(req.body)));
}

export async function remove(req: Request, res: Response) {
  await svc.deleteEmployee(req.auth.companyId, req.params.id);
  res.status(204).send();
}

export async function listAttendance(req: Request, res: Response) {
  res.json(await svc.getAttendance(req.auth.companyId, req.params.id));
}

export async function toggleAttendance(req: Request, res: Response) {
  res.json(await svc.toggleTodayAttendance(req.auth.companyId, req.params.id));
}

export async function getPerformance(req: Request, res: Response) {
  res.json(await svc.getPerformance(req.auth.companyId, req.params.id));
}
