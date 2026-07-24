import type { EntityId } from '@/types/common.types';

export type Department = 'Sales' | 'Engineering' | 'Marketing' | 'Support' | 'Finance' | 'HR';

export type EmployeeStatus = 'active' | 'on_leave' | 'terminated';

export interface Employee {
  id: EntityId;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: Department;
  status: EmployeeStatus;
  /** ISO date. */
  hireDate: string;
  avatarColor?: string;
}

export interface EmployeeFormValues {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: Department;
  status: EmployeeStatus;
  hireDate: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

export interface AttendanceRecord {
  id: EntityId;
  employeeId: EntityId;
  /** ISO date (day only). */
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
}

export interface PerformanceMetric {
  employeeId: EntityId;
  /** 0–100. */
  score: number;
  dealsClosed: number;
  tasksCompleted: number;
  /** Change vs the prior period, in score points. */
  trend: number;
}
