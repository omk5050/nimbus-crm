import type { Request, Response } from 'express';
import * as svc from './leads.service';
import { leadSchema, moveStageSchema, assignOwnerSchema, logActivitySchema, leadListQuerySchema } from './leads.schema';
import { paginated } from '@/utils/pagination';

export async function list(req: Request, res: Response) {
  const query = leadListQuerySchema.parse(req.query);
  const { leads, total, page, limit } = await svc.listLeads(req.auth.companyId, query);
  paginated(res, leads, { total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function get(req: Request, res: Response) {
  res.json(await svc.getLead(req.auth.companyId, req.params.id));
}

export async function create(req: Request, res: Response) {
  const input = leadSchema.parse(req.body);
  res.status(201).json(await svc.createLead(req.auth.companyId, input, req.auth.employeeId));
}

export async function update(req: Request, res: Response) {
  const input = leadSchema.parse(req.body);
  res.json(await svc.updateLead(req.auth.companyId, req.params.id, input, req.auth.employeeId));
}

export async function remove(req: Request, res: Response) {
  await svc.deleteLead(req.auth.companyId, req.params.id);
  res.status(204).send();
}

export async function moveStage(req: Request, res: Response) {
  const input = moveStageSchema.parse(req.body);
  res.json(await svc.moveStage(req.auth.companyId, req.params.id, input, req.auth.employeeId));
}

export async function assignOwner(req: Request, res: Response) {
  const input = assignOwnerSchema.parse(req.body);
  res.json(await svc.assignOwner(req.auth.companyId, req.params.id, input, req.auth.employeeId));
}

export async function listActivity(req: Request, res: Response) {
  res.json(await svc.getActivity(req.auth.companyId, req.params.id));
}

export async function logActivity(req: Request, res: Response) {
  const input = logActivitySchema.parse(req.body);
  res.status(201).json(await svc.logActivity(req.auth.companyId, req.params.id, input, req.auth.employeeId));
}
