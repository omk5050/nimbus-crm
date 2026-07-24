import { useMemo, useState } from 'react';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { useNavigate } from 'react-router';
import { Plus, Trash2, Eye, Pencil } from 'lucide-react';
import { DataTable } from '@/components/tables/DataTable';
import type { DataTableColumn } from '@/components/tables/DataTable';
import { Button } from '@/components/buttons/Button';
import { Avatar } from '@/components/common/Avatar';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { EmployeeFormDrawer } from '@/pages/employees/components/EmployeeFormDrawer';
import { useEmployeesStore } from '@/store/employees.store';
import { toast } from '@/store/toast.store';
import { employeeDetailRoute } from '@/constants/routes.constants';
import {
  DEPARTMENT_OPTIONS,
  EMPLOYEE_STATUS_LABEL,
  EMPLOYEE_STATUS_OPTIONS,
  EMPLOYEE_STATUS_TONE,
} from '@/constants/employee.constants';
import type { Department, Employee, EmployeeStatus } from '@/types/employee.types';
import { formatDate } from '@/utils/format';

export default function EmployeeListPage() {
  const isLoading = useSimulatedLoading();
  const navigate = useNavigate();
  const employees = useEmployeesStore((state) => state.employees);
  const deleteEmployee = useEmployeesStore((state) => state.deleteEmployee);

  const [departmentFilter, setDepartmentFilter] = useState<Department[]>([]);
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus[]>([]);
  const [drawerEmployee, setDrawerEmployee] = useState<Employee | 'new' | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Employee | null>(null);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesDepartment = departmentFilter.length === 0 || departmentFilter.includes(employee.department);
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(employee.status);
      return matchesDepartment && matchesStatus;
    });
  }, [employees, departmentFilter, statusFilter]);

  const columns: DataTableColumn<Employee>[] = [
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
      id: 'role',
      header: 'Role',
      sortValue: (row) => row.role,
      cell: (row) => row.role,
    },
    {
      id: 'department',
      header: 'Department',
      sortValue: (row) => row.department,
      cell: (row) => row.department,
    },
    {
      id: 'status',
      header: 'Status',
      sortValue: (row) => row.status,
      cell: (row) => (
        <StatusBadge label={EMPLOYEE_STATUS_LABEL[row.status]} tone={EMPLOYEE_STATUS_TONE[row.status]} />
      ),
    },
    {
      id: 'hireDate',
      header: 'Hire date',
      align: 'right',
      sortValue: (row) => row.hireDate,
      cell: (row) => formatDate(row.hireDate),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Employees</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {employees.length} team member{employees.length === 1 ? '' : 's'} across your workspace
          </p>
        </div>
        <Button onClick={() => setDrawerEmployee('new')}>
          <Plus size={16} />
          Add employee
        </Button>
      </div>

      <DataTable
        isLoading={isLoading}
        data={filteredEmployees}
        columns={columns}
        getRowId={(row) => row.id}
        getSearchableText={(row) => `${row.name} ${row.email} ${row.role} ${row.department}`}
        searchPlaceholder="Search employees…"
        onRowClick={(row) => navigate(employeeDetailRoute(row.id))}
        pageSize={8}
        emptyState={{
          title: 'No employees match your filters',
          description: 'Try clearing a filter or adding a new employee.',
        }}
        toolbarExtra={
          <>
            <FilterDropdown
              label="Department"
              options={DEPARTMENT_OPTIONS}
              selected={departmentFilter}
              onChange={setDepartmentFilter}
            />
            <FilterDropdown
              label="Status"
              options={EMPLOYEE_STATUS_OPTIONS}
              selected={statusFilter}
              onChange={setStatusFilter}
            />
          </>
        }
        rowActions={(row) => [
          { label: 'View profile', icon: Eye, onSelect: () => navigate(employeeDetailRoute(row.id)) },
          { label: 'Edit', icon: Pencil, onSelect: () => setDrawerEmployee(row) },
          {
            label: 'Delete',
            icon: Trash2,
            tone: 'danger',
            onSelect: () => setPendingDelete(row),
          },
        ]}
      />

      <EmployeeFormDrawer
        isOpen={drawerEmployee !== null}
        onClose={() => setDrawerEmployee(null)}
        employee={drawerEmployee === 'new' || drawerEmployee === null ? undefined : drawerEmployee}
        onCreated={(created) => navigate(employeeDetailRoute(created.id))}
      />

      <ConfirmDialog
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Delete this employee?"
        description={
          pendingDelete
            ? `This removes ${pendingDelete.name} (${pendingDelete.role}) from your workspace. This can't be undone.`
            : undefined
        }
        confirmLabel="Delete employee"
        tone="danger"
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteEmployee(pendingDelete.id);
          toast.success('Employee deleted', { description: `${pendingDelete.name} was removed.` });
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
