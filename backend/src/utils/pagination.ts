import type { Response } from 'express';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function paginated<T>(res: Response, data: T[], meta: PaginationMeta) {
  return res.json({ data, meta });
}

export function parsePagination(query: Record<string, string | string[] | undefined>) {
  const page = Math.max(1, Number(query['page']) || 1);
  const limit = Math.min(100, Math.max(1, Number(query['limit']) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function parseSorting(
  query: Record<string, string | string[] | undefined>,
  allowedFields: string[],
  defaultField = 'createdAt',
): Record<string, 'asc' | 'desc'> {
  const sortRaw = Array.isArray(query['sort']) ? query['sort'][0] : query['sort'];
  const sort = allowedFields.includes(sortRaw ?? '') ? (sortRaw as string) : defaultField;
  const orderRaw = Array.isArray(query['order']) ? query['order'][0] : query['order'];
  const order: 'asc' | 'desc' = orderRaw === 'asc' ? 'asc' : 'desc';
  return { [sort]: order };
}
