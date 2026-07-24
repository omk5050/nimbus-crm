import type { AttendanceRecord, Employee, PerformanceMetric } from '@/types/employee.types';

/**
 * "Jordan Reyes", "Priya Shah", "Marcus Webb", and "Aisha Khan" are the same
 * four sales reps already referenced as `owner` across Customers, Leads,
 * and Deals (see constants/team.constants.ts) — keeping them as real
 * Sales-department employees here is what lets that roster be derived
 * instead of hardcoded, as promised since Phase 5.
 */
export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'emp_001',
    name: 'Jordan Reyes',
    email: 'jordan.reyes@nimbuscrm.com',
    phone: '+1 (415) 555-0101',
    role: 'Account Executive',
    department: 'Sales',
    status: 'active',
    hireDate: '2023-02-14',
  },
  {
    id: 'emp_002',
    name: 'Priya Shah',
    email: 'priya.shah@nimbuscrm.com',
    phone: '+1 (415) 555-0102',
    role: 'Senior Account Executive',
    department: 'Sales',
    status: 'active',
    hireDate: '2021-06-01',
  },
  {
    id: 'emp_003',
    name: 'Marcus Webb',
    email: 'marcus.webb@nimbuscrm.com',
    phone: '+1 (415) 555-0103',
    role: 'Account Executive',
    department: 'Sales',
    status: 'active',
    hireDate: '2022-09-19',
  },
  {
    id: 'emp_004',
    name: 'Aisha Khan',
    email: 'aisha.khan@nimbuscrm.com',
    phone: '+1 (415) 555-0104',
    role: 'Sales Development Rep',
    department: 'Sales',
    status: 'active',
    hireDate: '2024-01-08',
  },
  {
    id: 'emp_005',
    name: 'Owen Fitzgerald',
    email: 'owen.fitzgerald@nimbuscrm.com',
    phone: '+1 (415) 555-0105',
    role: 'Sales Manager',
    department: 'Sales',
    status: 'on_leave',
    hireDate: '2020-03-11',
  },
  {
    id: 'emp_006',
    name: 'Dana Whitfield',
    email: 'dana.whitfield@nimbuscrm.com',
    phone: '+1 (415) 555-0106',
    role: 'Engineering Manager',
    department: 'Engineering',
    status: 'active',
    hireDate: '2019-11-04',
  },
  {
    id: 'emp_007',
    name: 'Leo Nakamura',
    email: 'leo.nakamura@nimbuscrm.com',
    phone: '+1 (415) 555-0107',
    role: 'Senior Frontend Engineer',
    department: 'Engineering',
    status: 'active',
    hireDate: '2021-08-23',
  },
  {
    id: 'emp_008',
    name: 'Sofia Marchetti',
    email: 'sofia.marchetti@nimbuscrm.com',
    phone: '+1 (415) 555-0108',
    role: 'Backend Engineer',
    department: 'Engineering',
    status: 'active',
    hireDate: '2022-05-16',
  },
  {
    id: 'emp_009',
    name: 'Théo Lambert',
    email: 'theo.lambert@nimbuscrm.com',
    phone: '+1 (415) 555-0109',
    role: 'QA Engineer',
    department: 'Engineering',
    status: 'active',
    hireDate: '2023-07-10',
  },
  {
    id: 'emp_010',
    name: 'Nadia Petrov',
    email: 'nadia.petrov@nimbuscrm.com',
    phone: '+1 (415) 555-0110',
    role: 'Marketing Director',
    department: 'Marketing',
    status: 'active',
    hireDate: '2020-10-05',
  },
  {
    id: 'emp_011',
    name: 'Caleb Osei',
    email: 'caleb.osei@nimbuscrm.com',
    phone: '+1 (415) 555-0111',
    role: 'Content Marketing Lead',
    department: 'Marketing',
    status: 'active',
    hireDate: '2022-02-28',
  },
  {
    id: 'emp_012',
    name: 'Ingrid Larsen',
    email: 'ingrid.larsen@nimbuscrm.com',
    phone: '+1 (415) 555-0112',
    role: 'Growth Marketer',
    department: 'Marketing',
    status: 'active',
    hireDate: '2023-04-17',
  },
  {
    id: 'emp_013',
    name: 'Malik Johnson',
    email: 'malik.johnson@nimbuscrm.com',
    phone: '+1 (415) 555-0113',
    role: 'Support Team Lead',
    department: 'Support',
    status: 'active',
    hireDate: '2021-01-19',
  },
  {
    id: 'emp_014',
    name: 'Yuki Tanaka',
    email: 'yuki.tanaka@nimbuscrm.com',
    phone: '+1 (415) 555-0114',
    role: 'Customer Support Specialist',
    department: 'Support',
    status: 'active',
    hireDate: '2023-09-02',
  },
  {
    id: 'emp_015',
    name: 'Rosa Delgado',
    email: 'rosa.delgado@nimbuscrm.com',
    phone: '+1 (415) 555-0115',
    role: 'Customer Support Specialist',
    department: 'Support',
    status: 'on_leave',
    hireDate: '2024-03-25',
  },
  {
    id: 'emp_016',
    name: 'Franklin Osei-Bonsu',
    email: 'franklin.oseibonsu@nimbuscrm.com',
    phone: '+1 (415) 555-0116',
    role: 'Financial Controller',
    department: 'Finance',
    status: 'active',
    hireDate: '2019-06-13',
  },
  {
    id: 'emp_017',
    name: 'Hana Suzuki',
    email: 'hana.suzuki@nimbuscrm.com',
    phone: '+1 (415) 555-0117',
    role: 'Accounts Receivable Analyst',
    department: 'Finance',
    status: 'active',
    hireDate: '2022-11-07',
  },
  {
    id: 'emp_018',
    name: 'Grace Liao',
    email: 'grace.liao@nimbuscrm.com',
    phone: '+1 (415) 555-0118',
    role: 'People Operations Manager',
    department: 'HR',
    status: 'active',
    hireDate: '2020-08-30',
  },
  {
    id: 'emp_019',
    name: 'Connor Blake',
    department: 'HR',
    email: 'connor.blake@nimbuscrm.com',
    phone: '+1 (415) 555-0119',
    role: 'Recruiter',
    status: 'active',
    hireDate: '2023-12-11',
  },
  {
    id: 'emp_020',
    name: 'Petra Novak',
    email: 'petra.novak@nimbuscrm.com',
    phone: '+1 (415) 555-0120',
    role: 'Support Specialist',
    department: 'Support',
    status: 'terminated',
    hireDate: '2021-04-06',
  },
];

function seedFrom(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return hash;
}

function daysAgoIso(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

const ATTENDANCE_CYCLE: AttendanceRecord['status'][] = ['present', 'present', 'present', 'present', 'late', 'present', 'absent'];

/** Last 10 weekdays-ish of attendance per employee — deterministic from a seed so it's stable across reloads. */
function buildAttendanceFor(employee: Employee): AttendanceRecord[] {
  const seed = seedFrom(employee.id);

  if (employee.status === 'terminated') return [];

  return Array.from({ length: 10 }, (_, index) => {
    const status =
      employee.status === 'on_leave' && index < 3
        ? 'leave'
        : ATTENDANCE_CYCLE[(seed + index) % ATTENDANCE_CYCLE.length];

    const isPresentLike = status === 'present' || status === 'late';

    return {
      id: `att_${employee.id}_${index}`,
      employeeId: employee.id,
      date: daysAgoIso(index),
      status,
      checkIn: isPresentLike ? (status === 'late' ? '09:42 AM' : '08:55 AM') : undefined,
      checkOut: isPresentLike ? '05:30 PM' : undefined,
    };
  });
}

export const INITIAL_ATTENDANCE: Record<string, AttendanceRecord[]> = Object.fromEntries(
  MOCK_EMPLOYEES.map((employee) => [employee.id, buildAttendanceFor(employee)]),
);

function buildPerformanceFor(employee: Employee): PerformanceMetric {
  const seed = seedFrom(employee.id);
  const score = employee.status === 'terminated' ? 0 : 62 + (seed % 34);
  const trend = ((seed % 21) - 10);

  return {
    employeeId: employee.id,
    score,
    dealsClosed: employee.department === 'Sales' ? seed % 14 : 0,
    tasksCompleted: 8 + (seed % 40),
    trend,
  };
}

export const INITIAL_PERFORMANCE: Record<string, PerformanceMetric> = Object.fromEntries(
  MOCK_EMPLOYEES.map((employee) => [employee.id, buildPerformanceFor(employee)]),
);
