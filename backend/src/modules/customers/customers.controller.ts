import type { Request, Response } from 'express';
import * as svc from './customers.service';
import { customerSchema, customerNoteSchema, customerListQuerySchema } from './customers.schema';
import { paginated } from '@/utils/pagination';

export async function list(req: Request, res: Response) {
  const query = customerListQuerySchema.parse(req.query);
  const { customers, total, page, limit } = await svc.listCustomers(req.auth.companyId, query);
  paginated(res, customers, { total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function get(req: Request, res: Response) {
  const customer = await svc.getCustomer(req.auth.companyId, req.params.id);
  res.json(customer);
}

export async function create(req: Request, res: Response) {
  const input = customerSchema.parse(req.body);
  const customer = await svc.createCustomer(req.auth.companyId, input, req.auth.employeeId);
  res.status(201).json(customer);
}

export async function update(req: Request, res: Response) {
  const input = customerSchema.parse(req.body);
  const customer = await svc.updateCustomer(req.auth.companyId, req.params.id, input, req.auth.employeeId);
  res.json(customer);
}

export async function remove(req: Request, res: Response) {
  await svc.deleteCustomer(req.auth.companyId, req.params.id);
  res.status(204).send();
}

export async function listNotes(req: Request, res: Response) {
  const notes = await svc.getNotes(req.auth.companyId, req.params.id);
  res.json(notes);
}

export async function addNote(req: Request, res: Response) {
  const input = customerNoteSchema.parse(req.body);
  const note = await svc.addNote(req.auth.companyId, req.params.id, input, req.auth.employeeId);
  res.status(201).json(note);
}

export async function listFiles(req: Request, res: Response) {
  const files = await svc.getFiles(req.auth.companyId, req.params.id);
  res.json(files);
}

export async function uploadFile(req: Request, res: Response) {
  if (!req.file) {
    res.status(400).json({ error: 'BAD_REQUEST', message: 'No file uploaded', statusCode: 400 });
    return;
  }
  const file = await svc.addFile(
    req.auth.companyId,
    req.params.id,
    {
      fileName: req.file.originalname,
      fileType: 'other',
      sizeLabel: `${(req.file.size / 1024).toFixed(1)} KB`,
      storageKey: req.file.filename ?? req.file.path,
    },
    req.auth.employeeId,
  );
  res.status(201).json(file);
}

export async function deleteFile(req: Request, res: Response) {
  await svc.deleteFile(req.auth.companyId, req.params.id, req.params.fileId);
  res.status(204).send();
}

export async function listTimeline(req: Request, res: Response) {
  const events = await svc.getTimeline(req.auth.companyId, req.params.id);
  res.json(events);
}
