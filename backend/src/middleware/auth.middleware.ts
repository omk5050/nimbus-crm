import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { prisma } from '@/config/prisma';

type UserRole = 'admin' | 'manager' | 'sales_rep' | 'support';

export interface AuthPayload {
  userId: string;
  employeeId: string;
  companyId: string;
  role: UserRole;
}

// Extend Express Request to carry the decoded JWT payload
declare global {
  namespace Express {
    interface Request {
      auth: AuthPayload;
    }
  }
}

/**
 * Verifies the Bearer JWT in the Authorization header, loads the User from
 * the database to confirm the account is still active, and attaches the
 * decoded payload to `req.auth`.
 */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'UNAUTHORIZED', message: 'Missing or invalid Authorization header', statusCode: 401 });
    return;
  }

  const token = header.slice(7);

  let payload: AuthPayload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
  } catch {
    res.status(401).json({ error: 'UNAUTHORIZED', message: 'Token is invalid or expired', statusCode: 401 });
    return;
  }

  // Confirm user still exists and has access
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, hasAccess: true, role: true, employee: { select: { companyId: true } } },
  });

  if (!user || !user.hasAccess) {
    res.status(403).json({ error: 'FORBIDDEN', message: 'Access revoked', statusCode: 403 });
    return;
  }

  req.auth = {
    userId: user.id,
    employeeId: payload.employeeId,
    companyId: user.employee.companyId,
    role: user.role,
  };

  next();
}

/**
 * Role-guard factory. Usage: `router.delete('/:id', authenticate, requireRole('admin'), controller)`
 */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.auth.role)) {
      res.status(403).json({ error: 'FORBIDDEN', message: 'Insufficient permissions', statusCode: 403 });
      return;
    }
    next();
  };
}
