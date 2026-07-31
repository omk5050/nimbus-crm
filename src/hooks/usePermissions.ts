import { useAuthStore } from '@/store/auth.store';
import { useAccessStore } from '@/store/access.store';
import type { PermissionAction, PermissionModule } from '@/types/settings.types';

/**
 * Checks whether the current authenticated user has permission to perform `action`
 * ('view' | 'edit' | 'delete') on the specified `module`.
 * 
 * - 'admin' role ALWAYS returns true for all modules & actions (full authority over everything).
 * - Other roles ('manager', 'sales_rep', 'support') are evaluated against the dynamic permission matrix
 *   configured by the Admin in Settings -> Roles & Permissions.
 */
export function useHasPermission(module: PermissionModule | string, action: PermissionAction = 'view'): boolean {
  const user = useAuthStore((state) => state.user);
  const rolePermissions = useAccessStore((state) => state.rolePermissions);

  if (!user) return false;

  // Base navigation items open to all logged-in workspace members
  if (module === 'dashboard' || module === 'notifications') return true;

  // Admin role has full authority over all modules and actions
  if (user.role === 'admin') return true;

  const role = user.role;
  const mod = module as PermissionModule;
  if (!rolePermissions[role] || !rolePermissions[role][mod]) return false;

  return Boolean(rolePermissions[role][mod][action]);
}

/**
 * Returns true if the logged-in user is an Admin with company-wide administrative authority.
 */
export function useIsAdmin(): boolean {
  const user = useAuthStore((state) => state.user);
  return user?.role === 'admin';
}
