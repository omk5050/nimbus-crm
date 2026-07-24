import type { Request, Response } from 'express';
import * as svc from './settings.service';
import {
  companyProfileSchema, rolePermissionSchema,
  setUserRoleSchema, toggleAccessSchema, preferencesSchema,
} from './settings.schema';

type UserRole = 'admin' | 'manager' | 'sales_rep' | 'support';

export async function getCompany(req: Request, res: Response) {
  res.json(await svc.getCompany(req.auth.companyId));
}

export async function updateCompany(req: Request, res: Response) {
  res.json(await svc.updateCompany(req.auth.companyId, companyProfileSchema.parse(req.body)));
}

export async function getRoles(req: Request, res: Response) {
  res.json(await svc.getRoles(req.auth.companyId));
}

export async function updateRolePermission(req: Request, res: Response) {
  const role = req.params.role as UserRole;
  res.json(await svc.updateRolePermission(req.auth.companyId, role, rolePermissionSchema.parse(req.body)));
}

export async function listUsers(req: Request, res: Response) {
  res.json(await svc.listUsers(req.auth.companyId));
}

export async function setUserRole(req: Request, res: Response) {
  res.json(await svc.setUserRole(req.params.employeeId, req.auth.companyId, setUserRoleSchema.parse(req.body)));
}

export async function toggleUserAccess(req: Request, res: Response) {
  res.json(await svc.toggleUserAccess(req.params.employeeId, req.auth.companyId, toggleAccessSchema.parse(req.body)));
}

export async function getPreferences(req: Request, res: Response) {
  res.json(await svc.getPreferences(req.auth.userId));
}

export async function updatePreferences(req: Request, res: Response) {
  res.json(await svc.updatePreferences(req.auth.userId, preferencesSchema.parse(req.body)));
}
