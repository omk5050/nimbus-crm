import { create } from 'zustand';
import type { AttendanceRecord, Employee, EmployeeFormValues, PerformanceMetric } from '@/types/employee.types';
import { apiClient } from '@/services/api.client';

interface EmployeesState {
  employees: Employee[];
  attendanceByEmployeeId: Record<string, AttendanceRecord[]>;
  performanceByEmployeeId: Record<string, PerformanceMetric>;
  isLoading: boolean;

  fetchEmployees: () => Promise<void>;
  addEmployee: (values: EmployeeFormValues) => Promise<Employee>;
  updateEmployee: (id: string, values: EmployeeFormValues) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  toggleTodayAttendance: (employeeId: string) => Promise<void>;
}

export const useEmployeesStore = create<EmployeesState>()((set) => ({
  employees: [],
  attendanceByEmployeeId: {},
  performanceByEmployeeId: {},
  isLoading: false,

  fetchEmployees: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient.get('/employees');
      const data = res.data.data || res.data || [];
      set({ employees: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addEmployee: async (values) => {
    const res = await apiClient.post('/employees', values);
    const newEmployee: Employee = res.data;
    set((state) => ({ employees: [newEmployee, ...state.employees] }));
    return newEmployee;
  },

  updateEmployee: async (id, values) => {
    const res = await apiClient.put(`/employees/${id}`, values);
    const updated: Employee = res.data;
    set((state) => ({
      employees: state.employees.map((emp) => (emp.id === id ? updated : emp)),
    }));
  },

  deleteEmployee: async (id) => {
    await apiClient.delete(`/employees/${id}`);
    set((state) => ({
      employees: state.employees.filter((emp) => emp.id !== id),
    }));
  },

  toggleTodayAttendance: async (_employeeId) => {
    // Attendance backend sync placeholder
  },
}));

export function useEmployee(id: string | undefined) {
  return useEmployeesStore((state) => state.employees.find((employee) => employee.id === id));
}
