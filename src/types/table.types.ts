import type { EntityId } from '@/types/common.types';

export type TableStatus = 'available' | 'reserved' | 'occupied' | 'cleared';

export interface Table {
  id: EntityId;
  companyId: EntityId;
  name: string;
  capacity: number;
  status: TableStatus;
  reservedBy: string | null;
  reservedAt: string | null;
  gracePeriodMinutes: number;
  graceExpiresAt: string | null;
  autoClearedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReserveTableInput {
  reservedBy: string;
  gracePeriodMinutes?: number;
}

export interface TableFormValues {
  name: string;
  capacity: number;
  gracePeriodMinutes?: number;
}
