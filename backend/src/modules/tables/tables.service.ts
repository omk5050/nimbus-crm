import { prisma } from '@/config/prisma';
import { AppError } from '@/middleware/error.middleware';
import { pushNotification } from '@/modules/notifications/notifications.service';
import type { CreateTableInput, ReserveTableInput } from './tables.schema';

const SEED_TABLES = [
  { name: 'Table 1 (Window)', capacity: 2, gracePeriodMinutes: 15 },
  { name: 'Table 2 (Main Hall)', capacity: 4, gracePeriodMinutes: 15 },
  { name: 'Table 3 (Main Hall)', capacity: 4, gracePeriodMinutes: 15 },
  { name: 'Table 4 (VIP Booth)', capacity: 6, gracePeriodMinutes: 15 },
  { name: 'Table 5 (Patio)', capacity: 4, gracePeriodMinutes: 15 },
  { name: 'Table 6 (Patio)', capacity: 8, gracePeriodMinutes: 20 },
];

export async function listTables(companyId: string) {
  let tables = await prisma.table.findMany({
    where: { companyId },
    orderBy: { createdAt: 'asc' },
  });

  // Seed default tables if workspace has none
  if (tables.length === 0) {
    await prisma.table.createMany({
      data: SEED_TABLES.map((t) => ({ ...t, companyId })),
    });
    tables = await prisma.table.findMany({
      where: { companyId },
      orderBy: { createdAt: 'asc' },
    });
  }

  return tables;
}

export async function getTable(companyId: string, id: string) {
  const table = await prisma.table.findFirst({ where: { id, companyId } });
  if (!table) throw new AppError(404, 'NOT_FOUND', 'Table not found');
  return table;
}

export async function createTable(companyId: string, input: CreateTableInput) {
  return prisma.table.create({
    data: {
      companyId,
      name: input.name,
      capacity: input.capacity,
      gracePeriodMinutes: input.gracePeriodMinutes ?? 15,
      status: 'available',
    },
  });
}

export async function reserveTable(companyId: string, id: string, input: ReserveTableInput) {
  const table = await getTable(companyId, id);

  const graceMinutes = input.gracePeriodMinutes ?? table.gracePeriodMinutes ?? 15;
  const now = new Date();
  const graceExpiresAt = new Date(now.getTime() + graceMinutes * 60 * 1000);

  return prisma.table.update({
    where: { id },
    data: {
      status: 'reserved',
      reservedBy: input.reservedBy,
      reservedAt: now,
      gracePeriodMinutes: graceMinutes,
      graceExpiresAt,
      autoClearedAt: null,
    },
  });
}

export async function extendGracePeriod(companyId: string, id: string, additionalMinutes: number = 10) {
  const table = await getTable(companyId, id);
  if (table.status !== 'reserved' || !table.graceExpiresAt) {
    throw new AppError(400, 'BAD_REQUEST', 'Table is not currently reserved');
  }

  const currentExpires = new Date(table.graceExpiresAt).getTime();
  const newGraceExpiresAt = new Date(currentExpires + additionalMinutes * 60 * 1000);
  const newTotalGrace = (table.gracePeriodMinutes || 15) + additionalMinutes;

  return prisma.table.update({
    where: { id },
    data: {
      graceExpiresAt: newGraceExpiresAt,
      gracePeriodMinutes: newTotalGrace,
    },
  });
}

export async function clearTable(companyId: string, id: string) {
  await getTable(companyId, id);

  return prisma.table.update({
    where: { id },
    data: {
      status: 'available',
      reservedBy: null,
      reservedAt: null,
      graceExpiresAt: null,
      autoClearedAt: new Date(),
    },
  });
}

export async function deleteTable(companyId: string, id: string) {
  await getTable(companyId, id);
  await prisma.table.delete({ where: { id } });
}

/**
 * Background worker task: Scans for tables whose grace period has expired.
 * Resets table to available status and dispatches a bell notification to all users.
 */
export async function checkGracePeriodExpirations() {
  try {
    const now = new Date();
    const expiredTables = await prisma.table.findMany({
      where: {
        status: 'reserved',
        graceExpiresAt: { lte: now },
      },
    });

    if (expiredTables.length === 0) return;

    for (const table of expiredTables) {
      // 1. Reset table to available
      await prisma.table.update({
        where: { id: table.id },
        data: {
          status: 'available',
          reservedBy: null,
          reservedAt: null,
          graceExpiresAt: null,
          autoClearedAt: now,
        },
      });

      // 2. Fetch company employees/users to notify
      const users = await prisma.user.findMany({
        where: { employee: { companyId: table.companyId } },
        select: { id: true },
      });

      // 3. Push real-time notification
      for (const user of users) {
        await pushNotification({
          userId: user.id,
          type: 'table' as any,
          title: `Table Auto-Cleared (${table.name})`,
          description: `${table.name} reserved for "${table.reservedBy || 'Customer'}" was automatically cleared after the ${table.gracePeriodMinutes}-min grace period expired.`,
          link: '/tables',
        });
      }
    }
  } catch (err) {
    console.error('Error checking table grace period expirations:', err);
  }
}
