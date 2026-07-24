import type { SelectOption, StatusTone } from '@/types/common.types';
import type {
  DealStage,
  InvoiceStatus,
  PaymentMethod,
  PaymentStatus,
  QuotationStatus,
} from '@/types/sales.types';

/* Deals */

export const DEAL_STAGE_LABEL: Record<DealStage, string> = {
  qualifying: 'Qualifying',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
};

export const DEAL_STAGE_TONE: Record<DealStage, StatusTone> = {
  qualifying: 'info',
  proposal: 'warning',
  negotiation: 'warning',
  won: 'success',
  lost: 'danger',
};

/** Left-to-right Kanban column order — includes the two terminal outcomes at the end. */
export const DEAL_STAGE_COLUMNS: DealStage[] = [
  'qualifying',
  'proposal',
  'negotiation',
  'won',
  'lost',
];

export const DEAL_STAGE_OPTIONS: SelectOption<DealStage>[] = DEAL_STAGE_COLUMNS.map((stage) => ({
  value: stage,
  label: DEAL_STAGE_LABEL[stage],
}));

/* Quotations */

export const QUOTATION_STATUS_LABEL: Record<QuotationStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  accepted: 'Accepted',
  declined: 'Declined',
  expired: 'Expired',
};

export const QUOTATION_STATUS_TONE: Record<QuotationStatus, StatusTone> = {
  draft: 'neutral',
  sent: 'info',
  accepted: 'success',
  declined: 'danger',
  expired: 'neutral',
};

export const QUOTATION_STATUS_OPTIONS: SelectOption<QuotationStatus>[] = (
  Object.keys(QUOTATION_STATUS_LABEL) as QuotationStatus[]
).map((status) => ({ value: status, label: QUOTATION_STATUS_LABEL[status] }));

/* Invoices */

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue',
  void: 'Void',
};

export const INVOICE_STATUS_TONE: Record<InvoiceStatus, StatusTone> = {
  draft: 'neutral',
  sent: 'info',
  paid: 'success',
  overdue: 'danger',
  void: 'neutral',
};

export const INVOICE_STATUS_OPTIONS: SelectOption<InvoiceStatus>[] = (
  Object.keys(INVOICE_STATUS_LABEL) as InvoiceStatus[]
).map((status) => ({ value: status, label: INVOICE_STATUS_LABEL[status] }));

/* Payments */

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  card: 'Card',
  bank_transfer: 'Bank Transfer',
  check: 'Check',
  cash: 'Cash',
};

export const PAYMENT_METHOD_OPTIONS: SelectOption<PaymentMethod>[] = (
  Object.keys(PAYMENT_METHOD_LABEL) as PaymentMethod[]
).map((method) => ({ value: method, label: PAYMENT_METHOD_LABEL[method] }));

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  completed: 'Completed',
  pending: 'Pending',
  failed: 'Failed',
};

export const PAYMENT_STATUS_TONE: Record<PaymentStatus, StatusTone> = {
  completed: 'success',
  pending: 'warning',
  failed: 'danger',
};
