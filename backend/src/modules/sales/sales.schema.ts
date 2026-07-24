import { z } from 'zod';

// ─── Shared ───────────────────────────────────────────────────

const lineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.coerce.number().min(0.01),
  unitPrice: z.coerce.number().min(0),
});

// ─── Deals ───────────────────────────────────────────────────

export const dealSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  customerId: z.string().min(1, 'Customer is required'),
  stage: z.enum(['qualifying', 'proposal', 'negotiation', 'won', 'lost']).default('qualifying'),
  value: z.coerce.number().min(0).default(0),
  owner: z.string().default(''),
  expectedCloseDate: z.string().optional(),
});

export const moveDealStageSchema = z.object({
  stage: z.enum(['qualifying', 'proposal', 'negotiation', 'won', 'lost']),
});

export const dealListQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  stage: z.enum(['qualifying', 'proposal', 'negotiation', 'won', 'lost']).optional(),
  owner: z.string().optional(),
  search: z.string().optional(),
});

// ─── Quotations ───────────────────────────────────────────────

export const quotationSchema = z.object({
  customerId: z.string().min(1),
  dealId: z.string().optional(),
  validUntil: z.string().min(1, 'Valid until date is required'),
  notes: z.string().optional(),
  items: z.array(lineItemSchema).min(1, 'At least one line item is required'),
});

export const quotationStatusSchema = z.object({
  status: z.enum(['draft', 'sent', 'accepted', 'declined', 'expired']),
});

export const quotationListQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  status: z.enum(['draft', 'sent', 'accepted', 'declined', 'expired']).optional(),
  customerId: z.string().optional(),
});

// ─── Invoices ─────────────────────────────────────────────────

export const invoiceSchema = z.object({
  customerId: z.string().min(1),
  dealId: z.string().optional(),
  quotationId: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  notes: z.string().optional(),
  items: z.array(lineItemSchema).min(1, 'At least one line item is required'),
});

export const invoiceStatusSchema = z.object({
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'void']),
});

export const invoiceListQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'void']).optional(),
  customerId: z.string().optional(),
});

// ─── Payments ─────────────────────────────────────────────────

export const paymentSchema = z.object({
  amount: z.coerce.number().min(0.01, 'Amount must be positive'),
  method: z.enum(['card', 'bank_transfer', 'check', 'cash']),
});

export type DealInput = z.infer<typeof dealSchema>;
export type MoveDealStageInput = z.infer<typeof moveDealStageSchema>;
export type DealListQuery = z.infer<typeof dealListQuerySchema>;
export type QuotationInput = z.infer<typeof quotationSchema>;
export type QuotationStatusInput = z.infer<typeof quotationStatusSchema>;
export type QuotationListQuery = z.infer<typeof quotationListQuerySchema>;
export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type InvoiceStatusInput = z.infer<typeof invoiceStatusSchema>;
export type InvoiceListQuery = z.infer<typeof invoiceListQuerySchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
