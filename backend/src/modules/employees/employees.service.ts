import { prisma } from '@/config/prisma';
import { AppError } from '@/middleware/error.middleware';
import { parsePagination, parseSorting } from '@/utils/pagination';
import type { EmployeeInput, EmployeeListQuery } from './employees.schema';

const ALLOWED_SORT = ['name', 'email', 'department', 'hireDate', 'createdAt'];

export async function listEmployees(companyId: string, query: EmployeeListQuery) {
  const { page, limit, skip } = parsePagination(query as Record<string, string | undefined>);
  const orderBy = parseSorting(query as Record<string, string | undefined>, ALLOWED_SORT);

  const where = {
    companyId,
    ...(query.department && { department: query.department }),
    ...(query.status && { status: query.status }),
    ...(query.search && {
      OR: [
        { name: { contains: query.search, mode: 'insensitive' as const } },
        { email: { contains: query.search, mode: 'insensitive' as const } },
        { role: { contains: query.search, mode: 'insensitive' as const } },
      ],
    }),
  };

  const [employees, total] = await Promise.all([
    prisma.employee.findMany({ where, orderBy, skip, take: limit }),
    prisma.employee.count({ where }),
  ]);

  return { employees, total, page, limit };
}

export async function getEmployee(companyId: string, id: string) {
  const employee = await prisma.employee.findFirst({
    where: { id, companyId },
    include: {
      attendance: { orderBy: { date: 'desc' }, take: 30 },
      performance: true,
    },
  });
  if (!employee) throw new AppError(404, 'NOT_FOUND', 'Employee not found');
  return employee;
}

export async function createEmployee(companyId: string, input: EmployeeInput) {
  const employee = await prisma.employee.create({
    data: {
      companyId,
      name: input.name,
      email: input.email,
      phone: input.phone,
      role: input.role,
      department: input.department,
      status: input.status,
      hireDate: new Date(input.hireDate),
      avatarColor: input.avatarColor,
      performance: {
        create: { score: 70, dealsClosed: 0, tasksCompleted: 0, trend: 0 },
      },
    },
  });
  return employee;
}

export async function updateEmployee(companyId: string, id: string, input: EmployeeInput) {
  await assertExists(companyId, id);
  return prisma.employee.update({
    where: { id },
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      role: input.role,
      department: input.department,
      status: input.status,
      hireDate: new Date(input.hireDate),
      avatarColor: input.avatarColor,
    },
  });
}

export async function deleteEmployee(companyId: string, id: string) {
  await assertExists(companyId, id);
  await prisma.employee.delete({ where: { id } });
}

export async function getAttendance(companyId: string, employeeId: string) {
  await assertExists(companyId, employeeId);
  return prisma.attendanceRecord.findMany({
    where: { employeeId },
    orderBy: { date: 'desc' },
  });
}

export async function toggleTodayAttendance(companyId: string, employeeId: string) {
  await assertExists(companyId, employeeId);
  const todayISO = new Date().toISOString().slice(0, 10);

  const existing = await prisma.attendanceRecord.findUnique({
    where: { employeeId_date: { employeeId, date: todayISO } },
  });

  if (existing) {
    return prisma.attendanceRecord.update({
      where: { id: existing.id },
      data: {
        status: existing.status === 'present' ? 'absent' : 'present',
        checkIn: existing.status === 'present' ? null : '09:00 AM',
        checkOut: null,
      },
    });
  } else {
    return prisma.attendanceRecord.create({
      data: { employeeId, date: todayISO, status: 'present', checkIn: '09:00 AM' },
    });
  }
}

export async function getPerformance(companyId: string, employeeId: string) {
  await assertExists(companyId, employeeId);
  return prisma.performanceMetric.findUnique({ where: { employeeId } });
}

async function assertExists(companyId: string, id: string) {
  const exists = await prisma.employee.findFirst({ where: { id, companyId }, select: { id: true } });
  if (!exists) throw new AppError(404, 'NOT_FOUND', 'Employee not found');
}
