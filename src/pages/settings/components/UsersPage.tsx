import { useMemo } from 'react';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { DataTable } from '@/components/tables/DataTable';
import type { DataTableColumn } from '@/components/tables/DataTable';
import { Avatar } from '@/components/common/Avatar';
import { Select } from '@/components/inputs/Select';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { useEmployeesStore } from '@/store/employees.store';
import { useAccessStore, useUserAccessFor } from '@/store/access.store';
import { toast } from '@/store/toast.store';
import { ROLE_OPTIONS } from '@/constants/settings.constants';
import type { UserRole } from '@/types/auth.types';
import type { Employee } from '@/types/employee.types';

/** One row's role picker + access toggle — reads its own access record so a role change only re-renders this row. */
function UserAccessCell({ employee }: { employee: Employee }) {
  const access = useUserAccessFor(employee.id, employee.department);
  const setUserRole = useAccessStore((state) => state.setUserRole);

  return (
    <div className="w-40" onClick={(event) => event.stopPropagation()}>
      <Select
        value={access.role}
        onChange={(role) => {
          setUserRole(employee.id, role as UserRole);
          toast.success('Role updated', { description: `${employee.name} is now ${role.replace('_', ' ')}.` });
        }}
        options={ROLE_OPTIONS}
      />
    </div>
  );
}

function AccessToggleCell({ employee }: { employee: Employee }) {
  const access = useUserAccessFor(employee.id, employee.department);
  const toggleUserAccess = useAccessStore((state) => state.toggleUserAccess);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        toggleUserAccess(employee.id);
      }}
      className="inline-flex"
    >
      <StatusBadge label={access.hasAccess ? 'Active' : 'Revoked'} tone={access.hasAccess ? 'success' : 'neutral'} />
    </button>
  );
}

export default function UsersPage() {
  const isLoading = useSimulatedLoading();
  const employees = useEmployeesStore((state) => state.employees);

  const columns: DataTableColumn<Employee>[] = useMemo(
    () => [
      {
        id: 'name',
        header: 'Employee',
        hideable: false,
        sortValue: (row) => row.name,
        cell: (row) => (
          <div className="flex items-center gap-2.5">
            <Avatar name={row.name} size="sm" />
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{row.name}</p>
              <p className="truncate text-xs text-muted-foreground">{row.email}</p>
            </div>
          </div>
        ),
      },
      {
        id: 'department',
        header: 'Department',
        sortValue: (row) => row.department,
        cell: (row) => row.department,
      },
      {
        id: 'role',
        header: 'Role',
        cell: (row) => <UserAccessCell employee={row} />,
      },
      {
        id: 'access',
        header: 'Access',
        cell: (row) => <AccessToggleCell employee={row} />,
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Every employee with a system account. Assign a role or revoke access — permissions per role are
        managed in the Roles &amp; Permissions tab.
      </p>

      <DataTable
        isLoading={isLoading}
        data={employees}
        columns={columns}
        getRowId={(row) => row.id}
        getSearchableText={(row) => `${row.name} ${row.email} ${row.department}`}
        searchPlaceholder="Search users…"
        pageSize={8}
        emptyState={{ title: 'No employees yet' }}
      />
    </div>
  );
}
