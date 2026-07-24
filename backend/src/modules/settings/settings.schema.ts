import { z } from 'zod';

export const companyProfileSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  industry: z.string().default(''),
  website: z.string().default(''),
  address: z.string().default(''),
  timezone: z.string().default('UTC'),
});

export const rolePermissionSchema = z.object({
  module: z.enum(['customers', 'leads', 'sales', 'employees', 'tasks', 'reports', 'settings']),
  action: z.enum(['view', 'edit', 'delete']),
  allowed: z.boolean(),
});

export const setUserRoleSchema = z.object({
  role: z.enum(['admin', 'manager', 'sales_rep', 'support']),
});

export const toggleAccessSchema = z.object({
  hasAccess: z.boolean(),
});

export const preferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  taskReminders: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
  density: z.enum(['comfortable', 'compact']).optional(),
  dateFormat: z.enum(['MDY', 'DMY']).optional(),
});

export type CompanyProfileInput = z.infer<typeof companyProfileSchema>;
export type RolePermissionInput = z.infer<typeof rolePermissionSchema>;
export type SetUserRoleInput = z.infer<typeof setUserRoleSchema>;
export type ToggleAccessInput = z.infer<typeof toggleAccessSchema>;
export type PreferencesInput = z.infer<typeof preferencesSchema>;
