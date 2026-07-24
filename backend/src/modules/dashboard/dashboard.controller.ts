import type { Request, Response } from 'express';
import * as svc from './dashboard.service';

export async function summary(req: Request, res: Response) {
  res.json(await svc.getSummary(req.auth.companyId));
}

export async function revenueTrend(req: Request, res: Response) {
  const months = Math.min(24, Math.max(1, Number(req.query.months) || 7));
  res.json(await svc.getRevenueTrend(req.auth.companyId, months));
}

export async function leadSourceBreakdown(req: Request, res: Response) {
  res.json(await svc.getLeadSourceBreakdown(req.auth.companyId));
}

export async function recentActivity(req: Request, res: Response) {
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  res.json(await svc.getRecentActivity(req.auth.companyId, limit));
}
