import type { SelectOption, StatusTone } from '@/types/common.types';
import type { AttendanceStatus, Department, EmployeeStatus } from '@/types/employee.types';

export const DEPARTMENTS: Department[] = [
  'Sales',
  'Engineering',
  'Marketing',
  'Support',
  'Finance',
  'HR',
];

export const DEPARTMENT_OPTIONS: SelectOption<Department>[] = DEPARTMENTS.map((department) => ({
  value: department,
  label: department,
}));

export const EMPLOYEE_STATUS_LABEL: Record<EmployeeStatus, string> = {
  active: 'Active',
  on_leave: 'On Leave',
  terminated: 'Terminated',
};

export const EMPLOYEE_STATUS_TONE: Record<EmployeeStatus, StatusTone> = {
  active: 'success',
  on_leave: 'warning',
  terminated: 'neutral',
};

export const EMPLOYEE_STATUS_OPTIONS: SelectOption<EmployeeStatus>[] = (
  Object.keys(EMPLOYEE_STATUS_LABEL) as EmployeeStatus[]
).map((status) => ({ value: status, label: EMPLOYEE_STATUS_LABEL[status] }));

export const ATTENDANCE_STATUS_LABEL: Record<AttendanceStatus, string> = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  leave: 'On Leave',
};

export const ATTENDANCE_STATUS_TONE: Record<AttendanceStatus, StatusTone> = {
  present: 'success',
  absent: 'danger',
  late: 'warning',
  leave: 'info',
};
