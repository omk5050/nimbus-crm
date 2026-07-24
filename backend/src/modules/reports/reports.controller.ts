import type { Request, Response } from 'express';
import * as svc from './reports.service';

export async function revenue(req: Request, res: Response) {
  res.json(await svc.getRevenueReport(req.auth.companyId, req.query));
}

export async function sales(req: Request, res: Response) {
  res.json(await svc.getSalesReport(req.auth.companyId, req.query));
}

export async function leads(req: Request, res: Response) {
  res.json(await svc.getLeadsReport(req.auth.companyId, req.query));
}

export async function employees(req: Request, res: Response) {
  res.json(await svc.getEmployeesReport(req.auth.companyId, req.query));
}
