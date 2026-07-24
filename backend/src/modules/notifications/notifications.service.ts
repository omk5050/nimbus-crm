import { prisma } from '@/config/prisma';
import { AppError } from '@/middleware/error.middleware';

export async function listNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function markAsRead(userId: string, id: string) {
  const exists = await prisma.notification.findFirst({ where: { id, userId }, select: { id: true } });
  if (!exists) throw new AppError(404, 'NOT_FOUND', 'Notification not found');
  return prisma.notification.update({ where: { id }, data: { isRead: true } });
}

export async function markAllAsRead(userId: string) {
  await prisma.notification.updateMany({ where: { userId }, data: { isRead: true } });
}

export async function deleteNotification(userId: string, id: string) {
  const exists = await prisma.notification.findFirst({ where: { id, userId }, select: { id: true } });
  if (!exists) throw new AppError(404, 'NOT_FOUND', 'Notification not found');
  await prisma.notification.delete({ where: { id } });
}

export async function clearAll(userId: string) {
  await prisma.notification.deleteMany({ where: { userId } });
}

/**
 * Helper called by other services to push a notification to one or more users.
 * Import and call this from e.g. leads.service.ts when a lead is assigned.
 */
export async function pushNotification(params: {
  userId: string;
  type: 'lead' | 'deal' | 'invoice' | 'task' | 'customer' | 'system';
  title: string;
  description: string;
  link?: string;
}) {
  return prisma.notification.create({ data: params });
}
