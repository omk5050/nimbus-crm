import { useMemo } from 'react';
import { useEmployeesStore } from '@/store/employees.store';
import type { SelectOption } from '@/types/common.types';

/**
 * Sales reps available to own an account, lead, or deal. Derived live from
 * the Employees store (active employees in the Sales department) rather
 * than a hardcoded list — add or deactivate someone in Employees and every
 * owner picker across Customers/Leads/Deals reflects it immediately.
 */
export function useSalesRepOptions(): SelectOption[] {
  const employees = useEmployeesStore((state) => state.employees);
  return useMemo(
    () =>
      employees
        .filter((employee) => employee.department === 'Sales' && employee.status === 'active')
        .map((employee) => ({ value: employee.name, label: employee.name })),
    [employees],
  );
}

/** Any active employee, regardless of department — used for the Task assignee picker. */
export function useActiveEmployeeOptions(): SelectOption[] {
  const employees = useEmployeesStore((state) => state.employees);
  return useMemo(
    () =>
      employees
        .filter((employee) => employee.status === 'active')
        .map((employee) => ({ value: employee.name, label: `${employee.name} — ${employee.role}` })),
    [employees],
  );
}

