import type { Request, Response } from 'express';
import * as svc from './tables.service';
import { createTableSchema, reserveTableSchema, extendTableSchema } from './tables.schema';

export async function list(req: Request, res: Response) {
  const tables = await svc.listTables(req.auth.companyId);
  res.json(tables);
}

export async function get(req: Request, res: Response) {
  const table = await svc.getTable(req.auth.companyId, req.params.id);
  res.json(table);
}

export async function create(req: Request, res: Response) {
  const input = createTableSchema.parse(req.body);
  const table = await svc.createTable(req.auth.companyId, input);
  res.status(201).json(table);
}

export async function reserve(req: Request, res: Response) {
  const input = reserveTableSchema.parse(req.body);
  const table = await svc.reserveTable(req.auth.companyId, req.params.id, input);
  res.json(table);
}

export async function extend(req: Request, res: Response) {
  const input = extendTableSchema.parse(req.body);
  const table = await svc.extendGracePeriod(req.auth.companyId, req.params.id, input.additionalMinutes);
  res.json(table);
}

export async function clear(req: Request, res: Response) {
  const table = await svc.clearTable(req.auth.companyId, req.params.id);
  res.json(table);
}

export async function remove(req: Request, res: Response) {
  await svc.deleteTable(req.auth.companyId, req.params.id);
  res.status(204).send();
}
