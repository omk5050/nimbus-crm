import type { Request, Response } from 'express';
import * as svc from './sales.service';
import {
  dealSchema, moveDealStageSchema, dealListQuerySchema,
  quotationSchema, quotationStatusSchema, quotationListQuerySchema,
  invoiceSchema, invoiceStatusSchema, invoiceListQuerySchema,
  paymentSchema,
} from './sales.schema';
import { paginated } from '@/utils/pagination';

// ─── Deals ───────────────────────────────────────────────────

export async function listDeals(req: Request, res: Response) {
  const query = dealListQuerySchema.parse(req.query);
  const { deals, total, page, limit } = await svc.listDeals(req.auth.companyId, query);
  paginated(res, deals, { total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function getDeal(req: Request, res: Response) {
  res.json(await svc.getDeal(req.auth.companyId, req.params.id));
}

export async function createDeal(req: Request, res: Response) {
  res.status(201).json(await svc.createDeal(req.auth.companyId, dealSchema.parse(req.body)));
}

export async function updateDeal(req: Request, res: Response) {
  res.json(await svc.updateDeal(req.auth.companyId, req.params.id, dealSchema.parse(req.body)));
}

export async function deleteDeal(req: Request, res: Response) {
  await svc.deleteDeal(req.auth.companyId, req.params.id);
  res.status(204).send();
}

export async function moveDealStage(req: Request, res: Response) {
  res.json(await svc.moveDealStage(req.auth.companyId, req.params.id, moveDealStageSchema.parse(req.body)));
}

// ─── Quotations ───────────────────────────────────────────────

export async function listQuotations(req: Request, res: Response) {
  const query = quotationListQuerySchema.parse(req.query);
  const { quotations, total, page, limit } = await svc.listQuotations(req.auth.companyId, query);
  paginated(res, quotations, { total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function getQuotation(req: Request, res: Response) {
  res.json(await svc.getQuotation(req.auth.companyId, req.params.id));
}

export async function createQuotation(req: Request, res: Response) {
  res.status(201).json(await svc.createQuotation(req.auth.companyId, quotationSchema.parse(req.body)));
}

export async function updateQuotation(req: Request, res: Response) {
  res.json(await svc.updateQuotation(req.auth.companyId, req.params.id, quotationSchema.parse(req.body)));
}

export async function deleteQuotation(req: Request, res: Response) {
  await svc.deleteQuotation(req.auth.companyId, req.params.id);
  res.status(204).send();
}

export async function setQuotationStatus(req: Request, res: Response) {
  res.json(await svc.setQuotationStatus(req.auth.companyId, req.params.id, quotationStatusSchema.parse(req.body)));
}

// ─── Invoices ─────────────────────────────────────────────────

export async function listInvoices(req: Request, res: Response) {
  const query = invoiceListQuerySchema.parse(req.query);
  const { invoices, total, page, limit } = await svc.listInvoices(req.auth.companyId, query);
  paginated(res, invoices, { total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function getInvoice(req: Request, res: Response) {
  res.json(await svc.getInvoice(req.auth.companyId, req.params.id));
}

export async function createInvoice(req: Request, res: Response) {
  res.status(201).json(await svc.createInvoice(req.auth.companyId, invoiceSchema.parse(req.body)));
}

export async function updateInvoice(req: Request, res: Response) {
  res.json(await svc.updateInvoice(req.auth.companyId, req.params.id, invoiceSchema.parse(req.body)));
}

export async function deleteInvoice(req: Request, res: Response) {
  await svc.deleteInvoice(req.auth.companyId, req.params.id);
  res.status(204).send();
}

export async function setInvoiceStatus(req: Request, res: Response) {
  res.json(await svc.setInvoiceStatus(req.auth.companyId, req.params.id, invoiceStatusSchema.parse(req.body)));
}

// ─── Payments ─────────────────────────────────────────────────

export async function listPayments(req: Request, res: Response) {
  res.json(await svc.listPayments(req.auth.companyId));
}

export async function recordPayment(req: Request, res: Response) {
  const input = paymentSchema.parse(req.body);
  res.status(201).json(await svc.recordPayment(req.auth.companyId, req.params.invoiceId, input));
}
