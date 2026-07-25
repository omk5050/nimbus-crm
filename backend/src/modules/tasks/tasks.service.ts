import { prisma } from '@/config/prisma';
import { AppError } from '@/middleware/error.middleware';
import { parsePagination, parseSorting } from '@/utils/pagination';
import type { TaskInput, MoveStatusInput, TaskListQuery } from './tasks.schema';

export async function listTasks(companyId: string, query: TaskListQuery) {
  const { page, limit, skip } = parsePagination(query as Record<string, string | undefined>);
  const orderBy = parseSorting(query as Record<string, string | undefined>, ['title', 'dueDate', 'priority', 'createdAt']);

  const where = {
    companyId,
    ...(query.status && { status: query.status as any }),
    ...(query.priority && { priority: query.priority as any }),
    ...(query.assignee && { assignee: { contains: query.assignee, mode: 'insensitive' as const } }),
    ...(query.dueDate && { dueDate: { lte: new Date(query.dueDate) } }),
    ...(query.search && {
      OR: [
        { title: { contains: query.search, mode: 'insensitive' as const } },
        { description: { contains: query.search, mode: 'insensitive' as const } },
        { relatedTo: { contains: query.search, mode: 'insensitive' as const } },
      ],
    }),
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({ where, orderBy, skip, take: limit }),
    prisma.task.count({ where }),
  ]);

  return { tasks, total, page, limit };
}

export async function getTask(companyId: string, id: string) {
  const task = await prisma.task.findFirst({ where: { id, companyId } });
  if (!task) throw new AppError(404, 'NOT_FOUND', 'Task not found');
  return task;
}

export async function createTask(companyId: string, input: TaskInput) {
  return prisma.task.create({
    data: {
      companyId,
      title: input.title,
      description: input.description ?? null,
      assignee: input.assignee,
      relatedTo: input.relatedTo ?? null,
      dueDate: new Date(input.dueDate),
      priority: input.priority as any,
      status: input.status as any,
    },
  });
}

export async function updateTask(companyId: string, id: string, input: Partial<TaskInput>) {
  await assertExists(companyId, id);
  const data: Record<string, any> = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;
  if (input.assignee !== undefined) data.assignee = input.assignee;
  if (input.relatedTo !== undefined) data.relatedTo = input.relatedTo;
  if (input.dueDate !== undefined) data.dueDate = new Date(input.dueDate);
  if (input.priority !== undefined) data.priority = input.priority;
  if (input.status !== undefined) data.status = input.status;

  return prisma.task.update({
    where: { id },
    data,
  });
}

export async function deleteTask(companyId: string, id: string) {
  await assertExists(companyId, id);
  await prisma.task.delete({ where: { id } });
}

export async function moveStatus(companyId: string, id: string, input: MoveStatusInput) {
  await assertExists(companyId, id);
  return prisma.task.update({ where: { id }, data: { status: input.status as any } });
}

export async function toggleDone(companyId: string, id: string) {
  const task = await assertExists(companyId, id);
  const nextStatus = task.status === 'done' ? 'todo' : 'done';
  return prisma.task.update({ where: { id }, data: { status: nextStatus as any } });
}

async function assertExists(companyId: string, id: string) {
  const task = await prisma.task.findFirst({ where: { id, companyId } });
  if (!task) throw new AppError(404, 'NOT_FOUND', 'Task not found');
  return task;
}
