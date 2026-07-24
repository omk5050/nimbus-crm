import type { UserRole } from '@/types/auth.types';

export type CompanyPlan = 'starter' | 'growth' | 'enterprise';

export interface CompanyProfile {
  id: string;
  name: string;
  plan: CompanyPlan;
  industry: string;
  website: string;
  address: string;
  timezone: string;
}

export interface CompanyProfileFormValues {
  name: string;
  industry: string;
  website: string;
  address: string;
  timezone: string;
}

/** The modules a role's access can be scoped to. */
export type PermissionModule =
  | 'customers'
  | 'leads'
  | 'sales'
  | 'employees'
  | 'tasks'
  | 'reports'
  | 'settings';

export type PermissionAction = 'view' | 'edit' | 'delete';

/** e.g. rolePermissions.admin.customers.delete */
export type RolePermissions = Record<UserRole, Record<PermissionModule, Record<PermissionAction, boolean>>>;

export interface RoleDefinition {
  role: UserRole;
  label: string;
  description: string;
}

/** Links an Employee to a system role and whether they currently have app access. */
export interface UserAccess {
  employeeId: string;
  role: UserRole;
  hasAccess: boolean;
}

export type PreferenceDensity = 'comfortable' | 'compact';
export type PreferenceDateFormat = 'MDY' | 'DMY';

export interface Preferences {
  emailNotifications: boolean;
  taskReminders: boolean;
  weeklyDigest: boolean;
  density: PreferenceDensity;
  dateFormat: PreferenceDateFormat;
}
