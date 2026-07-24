import { prisma } from '@/config/prisma';
import { AppError } from '@/middleware/error.middleware';
import type {
  CompanyProfileInput, RolePermissionInput,
  SetUserRoleInput, ToggleAccessInput, PreferencesInput,
} from './settings.schema';

type UserRole = 'admin' | 'manager' | 'sales_rep' | 'support';
type PermissionModule = 'customers' | 'leads' | 'sales' | 'employees' | 'tasks' | 'reports' | 'settings';
type PermissionAction = 'view' | 'edit' | 'delete';

// ─── Company Profile ──────────────────────────────────────────

export async function getCompany(companyId: string) {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) throw new AppError(404, 'NOT_FOUND', 'Company not found');
  return company;
}

export async function updateCompany(companyId: string, input: CompanyProfileInput) {
  return prisma.company.update({ where: { id: companyId }, data: input });
}

// ─── Roles & Permissions ──────────────────────────────────────

const ALL_ROLES: UserRole[] = ['admin', 'manager', 'sales_rep', 'support'];
const ALL_MODULES: PermissionModule[] = ['customers', 'leads', 'sales', 'employees', 'tasks', 'reports', 'settings'];
const ALL_ACTIONS: PermissionAction[] = ['view', 'edit', 'delete'];

export async function getRoles(companyId: string) {
  const permissions = await prisma.rolePermission.findMany({ where: { companyId } });

  const matrix: Record<string, Record<string, Record<string, boolean>>> = {};

  for (const role of ALL_ROLES) {
    matrix[role] = {};
    for (const mod of ALL_MODULES) {
      matrix[role][mod] = {};
      for (const action of ALL_ACTIONS) {
        const perm = permissions.find(
          (p: { role: string; module: string; action: string; allowed: boolean }) =>
            p.role === role && p.module === mod && p.action === action,
        );
        matrix[role][mod][action] = perm?.allowed ?? role === 'admin';
      }
    }
  }

  return matrix;
}

export async function updateRolePermission(companyId: string, role: UserRole, input: RolePermissionInput) {
  return prisma.rolePermission.upsert({
    where: {
      companyId_role_module_action: {
        companyId,
        role: role as any,
        module: input.module as any,
        action: input.action as any,
      },
    },
    update: { allowed: input.allowed },
    create: {
      companyId,
      role: role as any,
      module: input.module as any,
      action: input.action as any,
      allowed: input.allowed,
    },
  });
}

// ─── User Access ─────────────────────────────────────────────

export async function listUsers(companyId: string) {
  const employees = await prisma.employee.findMany({
    where: { companyId },
    include: { user: { select: { role: true, hasAccess: true } } },
  });
  return employees.map((emp: typeof employees[number]) => ({
    employeeId: emp.id,
    name: emp.name,
    email: emp.email,
    department: emp.department,
    role: emp.user?.role ?? null,
    hasAccess: emp.user?.hasAccess ?? false,
  }));
}

export async function setUserRole(employeeId: string, companyId: string, input: SetUserRoleInput) {
  const emp = await prisma.employee.findFirst({ where: { id: employeeId, companyId }, select: { id: true } });
  if (!emp) throw new AppError(404, 'NOT_FOUND', 'Employee not found');

  const user = await prisma.user.findUnique({ where: { employeeId } });
  if (!user) throw new AppError(404, 'NOT_FOUND', 'User account not found for this employee');

  return prisma.user.update({ where: { employeeId }, data: { role: input.role as any } });
}

export async function toggleUserAccess(employeeId: string, companyId: string, input: ToggleAccessInput) {
  const emp = await prisma.employee.findFirst({ where: { id: employeeId, companyId }, select: { id: true } });
  if (!emp) throw new AppError(404, 'NOT_FOUND', 'Employee not found');

  const user = await prisma.user.findUnique({ where: { employeeId } });
  if (!user) throw new AppError(404, 'NOT_FOUND', 'User account not found for this employee');

  return prisma.user.update({ where: { employeeId }, data: { hasAccess: input.hasAccess } });
}

// ─── Preferences ─────────────────────────────────────────────

export async function getPreferences(userId: string) {
  const prefs = await prisma.userPreference.findUnique({ where: { userId } });
  return prefs ?? {
    userId,
    emailNotifications: true,
    taskReminders: true,
    weeklyDigest: false,
    density: 'comfortable',
    dateFormat: 'MDY',
  };
}

export async function updatePreferences(userId: string, input: PreferencesInput) {
  return prisma.userPreference.upsert({
    where: { userId },
    update: input,
    create: { userId, ...input },
  });
}
