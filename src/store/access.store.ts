import { create } from 'zustand';
import type { UserRole } from '@/types/auth.types';
import type { PermissionAction, PermissionModule, RolePermissions, UserAccess } from '@/types/settings.types';
import { DEFAULT_ROLE_PERMISSIONS } from '@/constants/settings.constants';
import { MOCK_EMPLOYEES } from '@/mock/employees.mock';

/** Deterministic starting role per employee, based on department — editable afterward from Users. */
export function defaultRoleFor(department: string): UserRole {
  if (department === 'Sales') return 'sales_rep';
  if (department === 'Support') return 'support';
  return 'manager';
}

const INITIAL_USER_ACCESS: Record<string, UserAccess> = Object.fromEntries(
  MOCK_EMPLOYEES.map((employee, index) => [
    employee.id,
    {
      employeeId: employee.id,
      // The very first employee (Jordan Reyes) seeds as Admin so there's always at least one,
      // matching the "signed in" mock user's seniority.
      role: index === 0 ? 'admin' : defaultRoleFor(employee.department),
      hasAccess: employee.status !== 'terminated',
    },
  ]),
);

interface AccessState {
  rolePermissions: RolePermissions;
  userAccessByEmployeeId: Record<string, UserAccess>;

  togglePermission: (role: UserRole, module: PermissionModule, action: PermissionAction) => void;
  setUserRole: (employeeId: string, role: UserRole) => void;
  toggleUserAccess: (employeeId: string) => void;
}

export const useAccessStore = create<AccessState>()((set) => ({
  rolePermissions: DEFAULT_ROLE_PERMISSIONS,
  userAccessByEmployeeId: INITIAL_USER_ACCESS,

  togglePermission: (role, module, action) => {
    set((state) => ({
      rolePermissions: {
        ...state.rolePermissions,
        [role]: {
          ...state.rolePermissions[role],
          [module]: {
            ...state.rolePermissions[role][module],
            [action]: !state.rolePermissions[role][module][action],
          },
        },
      },
    }));
  },

  setUserRole: (employeeId, role) => {
    set((state) => ({
      userAccessByEmployeeId: {
        ...state.userAccessByEmployeeId,
        [employeeId]: { ...state.userAccessByEmployeeId[employeeId], employeeId, role },
      },
    }));
  },

  toggleUserAccess: (employeeId) => {
    set((state) => {
      const current = state.userAccessByEmployeeId[employeeId];
      return {
        userAccessByEmployeeId: {
          ...state.userAccessByEmployeeId,
          [employeeId]: {
            ...current,
            employeeId,
            hasAccess: !(current?.hasAccess ?? true),
          },
        },
      };
    });
  },
}));

/** Count of users currently assigned a given role, for the Roles overview cards. */
export function useRoleUserCount(role: UserRole): number {
  return useAccessStore(
    (state) => Object.values(state.userAccessByEmployeeId).filter((entry) => entry.role === role).length,
  );
}

/**
 * Safe accessor for a single employee's access record. Employees added via
 * the Employees module after this store initialized won't have a seeded
 * record yet — this returns a sensible computed default in that case
 * instead of `undefined`, without persisting anything until the user
 * actually changes their role or access.
 */
export function useUserAccessFor(employeeId: string, department: string): UserAccess {
  return useAccessStore(
    (state) =>
      state.userAccessByEmployeeId[employeeId] ?? {
        employeeId,
        role: defaultRoleFor(department),
        hasAccess: true,
      },
  );
}
