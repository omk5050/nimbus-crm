import type { UserRole } from '@/types/auth.types';
import type {
  PermissionAction,
  PermissionModule,
  PreferenceDateFormat,
  PreferenceDensity,
  RoleDefinition,
  RolePermissions,
} from '@/types/settings.types';
import type { SelectOption } from '@/types/common.types';

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    role: 'admin',
    label: 'Admin',
    description: 'Full access to every module, including billing, roles, and permissions.',
  },
  {
    role: 'manager',
    label: 'Manager',
    description: 'Manages team pipelines and records, but cannot change roles or permissions.',
  },
  {
    role: 'sales_rep',
    label: 'Sales Rep',
    description: 'Works their own customers, leads, and deals; read-only elsewhere.',
  },
  {
    role: 'support',
    label: 'Support',
    description: 'Handles customer-facing tasks and tickets; no access to sales figures.',
  },
];

export const ROLE_OPTIONS: SelectOption<UserRole>[] = ROLE_DEFINITIONS.map((def) => ({
  value: def.role,
  label: def.label,
}));

export const PERMISSION_MODULES: PermissionModule[] = [
  'customers',
  'leads',
  'sales',
  'employees',
  'tasks',
  'reports',
  'settings',
];

export const PERMISSION_MODULE_LABEL: Record<PermissionModule, string> = {
  customers: 'Customers',
  leads: 'Leads',
  sales: 'Sales',
  employees: 'Employees',
  tasks: 'Tasks',
  reports: 'Reports',
  settings: 'Settings',
};

export const PERMISSION_ACTIONS: PermissionAction[] = ['view', 'edit', 'delete'];

export const PERMISSION_ACTION_LABEL: Record<PermissionAction, string> = {
  view: 'View',
  edit: 'Edit',
  delete: 'Delete',
};

function buildModulePermissions(view: boolean, edit: boolean, del: boolean) {
  return Object.fromEntries(
    PERMISSION_MODULES.map((module) => [module, { view, edit, delete: del }]),
  ) as Record<PermissionModule, Record<PermissionAction, boolean>>;
}

/**
 * Sensible starting matrix per role. Fully editable afterward from the
 * Roles & Permissions tab — this is just the seed, not a hardcoded rule.
 */
export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
  admin: buildModulePermissions(true, true, true),
  manager: {
    ...buildModulePermissions(true, true, false),
    settings: { view: true, edit: false, delete: false },
  },
  sales_rep: {
    customers: { view: true, edit: true, delete: false },
    leads: { view: true, edit: true, delete: false },
    sales: { view: true, edit: true, delete: false },
    employees: { view: false, edit: false, delete: false },
    tasks: { view: true, edit: true, delete: false },
    reports: { view: true, edit: false, delete: false },
    settings: { view: false, edit: false, delete: false },
  },
  support: {
    customers: { view: true, edit: true, delete: false },
    leads: { view: false, edit: false, delete: false },
    sales: { view: false, edit: false, delete: false },
    employees: { view: false, edit: false, delete: false },
    tasks: { view: true, edit: true, delete: false },
    reports: { view: false, edit: false, delete: false },
    settings: { view: false, edit: false, delete: false },
  },
};

export const TIMEZONE_OPTIONS: SelectOption[] = [
  { value: 'America/Los_Angeles', label: 'Pacific Time (US)' },
  { value: 'America/Denver', label: 'Mountain Time (US)' },
  { value: 'America/Chicago', label: 'Central Time (US)' },
  { value: 'America/New_York', label: 'Eastern Time (US)' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Berlin', label: 'Berlin' },
  { value: 'Asia/Kolkata', label: 'Mumbai / Delhi' },
  { value: 'Asia/Singapore', label: 'Singapore' },
  { value: 'Australia/Sydney', label: 'Sydney' },
];

export const DENSITY_OPTIONS: SelectOption<PreferenceDensity>[] = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
];

export const DATE_FORMAT_OPTIONS: SelectOption<PreferenceDateFormat>[] = [
  { value: 'MDY', label: 'MM/DD/YYYY' },
  { value: 'DMY', label: 'DD/MM/YYYY' },
];
