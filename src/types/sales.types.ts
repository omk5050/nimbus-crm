import type { EntityId } from '@/types/common.types';

/* ------------------------------------------------------------------ */
/* Deals                                                               */
/* ------------------------------------------------------------------ */

export type DealStage = 'qualifying' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface Deal {
  id: EntityId;
  title: string;
  customerId: EntityId;
  customerName: string;
  company: string;
  stage: DealStage;
  value: number;
  owner: string;
  expectedCloseDate?: string;
  createdAt: string;
}

export interface DealFormValues {
  title: string;
  customerId: string;
  stage: DealStage;
  value: number;
  owner: string;
  expectedCloseDate: string;
}

/* ------------------------------------------------------------------ */
/* Shared line-item shape (quotations + invoices)                      */
/* ------------------------------------------------------------------ */

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface LineItemFormValues {
  description: string;
  quantity: number;
  unitPrice: number;
}

/* ------------------------------------------------------------------ */
/* Quotations                                                          */
/* ------------------------------------------------------------------ */

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';

export interface Quotation {
  id: EntityId;
  quoteNumber: string;
  dealId?: EntityId;
  customerId: EntityId;
  customerName: string;
  company: string;
  status: QuotationStatus;
  items: LineItem[];
  validUntil: string;
  notes?: string;
  createdAt: string;
}

export interface QuotationFormValues {
  customerId: string;
  dealId: string;
  validUntil: string;
  notes: string;
  items: LineItemFormValues[];
}

/* ------------------------------------------------------------------ */
/* Invoices                                                            */
/* ------------------------------------------------------------------ */

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'void';

export interface Invoice {
  id: EntityId;
  invoiceNumber: string;
  dealId?: EntityId;
  quotationId?: EntityId;
  customerId: EntityId;
  customerName: string;
  company: string;
  status: InvoiceStatus;
  items: LineItem[];
  dueDate: string;
  notes?: string;
  createdAt: string;
}

export interface InvoiceFormValues {
  customerId: string;
  dealId: string;
  dueDate: string;
  notes: string;
  items: LineItemFormValues[];
}

/* ------------------------------------------------------------------ */
/* Payments                                                            */
/* ------------------------------------------------------------------ */

export type PaymentMethod = 'card' | 'bank_transfer' | 'check' | 'cash';
export type PaymentStatus = 'completed' | 'pending' | 'failed';

export interface Payment {
  id: EntityId;
  invoiceId: EntityId;
  invoiceNumber: string;
  customerName: string;
  company: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
}

export interface PaymentFormValues {
  amount: number;
  method: PaymentMethod;
}
