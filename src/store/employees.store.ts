import { create } from 'zustand';
import type { AttendanceRecord, Employee, EmployeeFormValues, PerformanceMetric } from '@/types/employee.types';
import { INITIAL_ATTENDANCE, INITIAL_PERFORMANCE, MOCK_EMPLOYEES } from '@/mock/employees.mock';

function generateId(): string {
  return `emp_${crypto.randomUUID().slice(0, 8)}`;
}

interface EmployeesState {
  employees: Employee[];
  attendanceByEmployeeId: Record<string, AttendanceRecord[]>;
  performanceByEmployeeId: Record<string, PerformanceMetric>;

  addEmployee: (values: EmployeeFormValues) => Employee;
  updateEmployee: (id: string, values: EmployeeFormValues) => void;
  deleteEmployee: (id: string) => void;
  /** Toggles today's attendance between Present and Absent — a lightweight stand-in for a real clock-in system. */
  toggleTodayAttendance: (employeeId: string) => void;
}

const TODAY_ISO = new Date().toISOString().slice(0, 10);

export const useEmployeesStore = create<EmployeesState>()((set) => ({
  employees: MOCK_EMPLOYEES,
  attendanceByEmployeeId: INITIAL_ATTENDANCE,
  performanceByEmployeeId: INITIAL_PERFORMANCE,

  addEmployee: (values) => {
    const newEmployee: Employee = {
      id: generateId(),
      ...values,
    };

    set((state) => ({
      employees: [newEmployee, ...state.employees],
      attendanceByEmployeeId: { ...state.attendanceByEmployeeId, [newEmployee.id]: [] },
      performanceByEmployeeId: {
        ...state.performanceByEmployeeId,
        [newEmployee.id]: { employeeId: newEmployee.id, score: 70, dealsClosed: 0, tasksCompleted: 0, trend: 0 },
      },
    }));

    return newEmployee;
  },

  updateEmployee: (id, values) => {
    set((state) => ({
      employees: state.employees.map((employee) =>
        employee.id === id ? { ...employee, ...values } : employee,
      ),
    }));
  },

  deleteEmployee: (id) => {
    set((state) => {
      const nextAttendance = { ...state.attendanceByEmployeeId };
      delete nextAttendance[id];
      const nextPerformance = { ...state.performanceByEmployeeId };
      delete nextPerformance[id];

      return {
        employees: state.employees.filter((employee) => employee.id !== id),
        attendanceByEmployeeId: nextAttendance,
        performanceByEmployeeId: nextPerformance,
      };
    });
  },

  toggleTodayAttendance: (employeeId) => {
    set((state) => {
      const records = state.attendanceByEmployeeId[employeeId] ?? [];
      const todayRecord = records.find((record) => record.date === TODAY_ISO);

      let nextRecords: AttendanceRecord[];
      if (todayRecord) {
        nextRecords = records.map((record) =>
          record.date === TODAY_ISO
            ? {
                ...record,
                status: record.status === 'present' ? 'absent' : 'present',
                checkIn: record.status === 'present' ? undefined : '09:00 AM',
                checkOut: undefined,
              }
            : record,
        );
      } else {
        nextRecords = [
          { id: `att_${employeeId}_today`, employeeId, date: TODAY_ISO, status: 'present', checkIn: '09:00 AM' },
          ...records,
        ];
      }

      return {
        attendanceByEmployeeId: { ...state.attendanceByEmployeeId, [employeeId]: nextRecords },
      };
    });
  },
}));

export function useEmployee(id: string | undefined) {
  return useEmployeesStore((state) => state.employees.find((employee) => employee.id === id));
}
