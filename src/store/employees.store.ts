import { create } from 'zustand';
import type { AttendanceRecord, Employee, EmployeeFormValues, PerformanceMetric } from '@/types/employee.types';
import { apiClient } from '@/services/api.client';

interface EmployeesState {
  employees: Employee[];
  attendanceByEmployeeId: Record<string, AttendanceRecord[]>;
  performanceByEmployeeId: Record<string, PerformanceMetric>;
  isLoading: boolean;

  fetchEmployees: () => Promise<void>;
  fetchEmployee: (id: string) => Promise<Employee | null>;
  fetchEmployeeDetails: (id: string) => Promise<void>;
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

  fetchEmployee: async (id: string) => {
    try {
      const res = await apiClient.get(`/employees/${id}`);
      const fetched: Employee = res.data;
      if (fetched && fetched.id) {
        set((state) => {
          const exists = state.employees.some((e) => e.id === fetched.id);
          return {
            employees: exists
              ? state.employees.map((e) => (e.id === fetched.id ? fetched : e))
              : [fetched, ...state.employees],
          };
        });
        return fetched;
      }
      return null;
    } catch {
      return null;
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

  fetchEmployeeDetails: async (id: string) => {
    try {
      const [attendanceRes, performanceRes] = await Promise.all([
        apiClient.get(`/employees/${id}/attendance`).catch(() => ({ data: [] })),
        apiClient.get(`/employees/${id}/performance`).catch(() => ({ data: null })),
      ]);
      set((state) => ({
        attendanceByEmployeeId: {
          ...state.attendanceByEmployeeId,
          [id]: Array.isArray(attendanceRes.data) ? attendanceRes.data : [],
        },
        performanceByEmployeeId: performanceRes.data
          ? { ...state.performanceByEmployeeId, [id]: performanceRes.data }
          : state.performanceByEmployeeId,
      }));
    } catch {
      // Ignore
    }
  },

  toggleTodayAttendance: async (employeeId) => {
    try {
      await apiClient.patch(`/employees/${employeeId}/attendance/today`, {});
      const res = await apiClient.get(`/employees/${employeeId}/attendance`);
      set((state) => ({
        attendanceByEmployeeId: { ...state.attendanceByEmployeeId, [employeeId]: res.data },
      }));
    } catch {
      // Ignore
    }
  },
}));

export function useEmployee(id: string | undefined) {
  return useEmployeesStore((state) => state.employees.find((employee) => employee.id === id));
}
