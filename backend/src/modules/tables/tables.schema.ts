import { z } from 'zod';

export const createTableSchema = z.object({
  name: z.string().min(1, 'Table name is required'),
  capacity: z.number().int().min(1, 'Capacity must be at least 1').default(4),
  gracePeriodMinutes: z.number().int().min(1).default(15),
});

export const reserveTableSchema = z.object({
  reservedBy: z.string().min(1, 'Customer name is required'),
  gracePeriodMinutes: z.number().int().min(1).optional(),
});

export const extendTableSchema = z.object({
  additionalMinutes: z.number().int().min(1).default(10),
});

export type CreateTableInput = z.infer<typeof createTableSchema>;
export type ReserveTableInput = z.infer<typeof reserveTableSchema>;
export type ExtendTableInput = z.infer<typeof extendTableSchema>;
