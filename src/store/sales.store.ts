import { create } from 'zustand';
import type {
  Deal,
  DealFormValues,
  DealStage,
  Invoice,
  InvoiceFormValues,
  InvoiceStatus,
  Payment,
  PaymentFormValues,
  Quotation,
  QuotationFormValues,
  QuotationStatus,
} from '@/types/sales.types';
import { MOCK_DEALS, MOCK_INVOICES, MOCK_PAYMENTS, MOCK_QUOTATIONS } from '@/mock/sales.mock';
import { useCustomersStore } from '@/store/customers.store';
import { calculateLineItemsTotal, generateInvoiceNumber, generateQuoteNumber } from '@/utils/sales';

function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

function resolveCustomer(customerId: string) {
  const customer = useCustomersStore.getState().customers.find((entry) => entry.id === customerId);
  return {
    customerId,
    customerName: customer?.name ?? 'Unknown contact',
    company: customer?.company ?? 'Unknown company',
  };
}

function toLineItems(values: QuotationFormValues['items'] | InvoiceFormValues['items']) {
  return values.map((item, index) => ({ id: `li_${index}_${Date.now()}`, ...item }));
}

interface SalesState {
  deals: Deal[];
  quotations: Quotation[];
  invoices: Invoice[];
  payments: Payment[];

  addDeal: (values: DealFormValues) => Deal;
  updateDeal: (id: string, values: DealFormValues) => void;
  deleteDeal: (id: string) => void;
  moveDealStage: (id: string, stage: DealStage) => void;

  addQuotation: (values: QuotationFormValues) => Quotation;
  updateQuotation: (id: string, values: QuotationFormValues) => void;
  deleteQuotation: (id: string) => void;
  setQuotationStatus: (id: string, status: QuotationStatus) => void;

  addInvoice: (values: InvoiceFormValues) => Invoice;
  updateInvoice: (id: string, values: InvoiceFormValues) => void;
  deleteInvoice: (id: string) => void;
  setInvoiceStatus: (id: string, status: InvoiceStatus) => void;

  /** Records a payment against an invoice and marks the invoice Paid if the payment covers the full balance. */
  recordPayment: (invoiceId: string, values: PaymentFormValues) => void;
}

export const useSalesStore = create<SalesState>()((set, get) => ({
  deals: MOCK_DEALS,
  quotations: MOCK_QUOTATIONS,
  invoices: MOCK_INVOICES,
  payments: MOCK_PAYMENTS,

  addDeal: (values) => {
    const newDeal: Deal = {
      id: generateId('deal'),
      title: values.title,
      ...resolveCustomer(values.customerId),
      stage: values.stage,
      value: values.value,
      owner: values.owner,
      expectedCloseDate: values.expectedCloseDate || undefined,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ deals: [newDeal, ...state.deals] }));
    return newDeal;
  },

  updateDeal: (id, values) => {
    set((state) => ({
      deals: state.deals.map((deal) =>
        deal.id === id
          ? {
              ...deal,
              title: values.title,
              ...resolveCustomer(values.customerId),
              stage: values.stage,
              value: values.value,
              owner: values.owner,
              expectedCloseDate: values.expectedCloseDate || undefined,
            }
          : deal,
      ),
    }));
  },

  deleteDeal: (id) => {
    set((state) => ({ deals: state.deals.filter((deal) => deal.id !== id) }));
  },

  moveDealStage: (id, stage) => {
    set((state) => ({
      deals: state.deals.map((deal) => (deal.id === id ? { ...deal, stage } : deal)),
    }));
  },

  addQuotation: (values) => {
    const newQuotation: Quotation = {
      id: generateId('quo'),
      quoteNumber: generateQuoteNumber(),
      dealId: values.dealId || undefined,
      ...resolveCustomer(values.customerId),
      status: 'draft',
      items: toLineItems(values.items),
      validUntil: values.validUntil,
      notes: values.notes || undefined,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ quotations: [newQuotation, ...state.quotations] }));
    return newQuotation;
  },

  updateQuotation: (id, values) => {
    set((state) => ({
      quotations: state.quotations.map((quotation) =>
        quotation.id === id
          ? {
              ...quotation,
              dealId: values.dealId || undefined,
              ...resolveCustomer(values.customerId),
              items: toLineItems(values.items),
              validUntil: values.validUntil,
              notes: values.notes || undefined,
            }
          : quotation,
      ),
    }));
  },

  deleteQuotation: (id) => {
    set((state) => ({ quotations: state.quotations.filter((quotation) => quotation.id !== id) }));
  },

  setQuotationStatus: (id, status) => {
    set((state) => ({
      quotations: state.quotations.map((quotation) =>
        quotation.id === id ? { ...quotation, status } : quotation,
      ),
    }));
  },

  addInvoice: (values) => {
    const newInvoice: Invoice = {
      id: generateId('inv'),
      invoiceNumber: generateInvoiceNumber(),
      dealId: values.dealId || undefined,
      ...resolveCustomer(values.customerId),
      status: 'draft',
      items: toLineItems(values.items),
      dueDate: values.dueDate,
      notes: values.notes || undefined,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ invoices: [newInvoice, ...state.invoices] }));
    return newInvoice;
  },

  updateInvoice: (id, values) => {
    set((state) => ({
      invoices: state.invoices.map((invoice) =>
        invoice.id === id
          ? {
              ...invoice,
              dealId: values.dealId || undefined,
              ...resolveCustomer(values.customerId),
              items: toLineItems(values.items),
              dueDate: values.dueDate,
              notes: values.notes || undefined,
            }
          : invoice,
      ),
    }));
  },

  deleteInvoice: (id) => {
    set((state) => ({ invoices: state.invoices.filter((invoice) => invoice.id !== id) }));
  },

  setInvoiceStatus: (id, status) => {
    set((state) => ({
      invoices: state.invoices.map((invoice) => (invoice.id === id ? { ...invoice, status } : invoice)),
    }));
  },

  recordPayment: (invoiceId, values) => {
    const invoice = get().invoices.find((entry) => entry.id === invoiceId);
    if (!invoice) return;

    const newPayment: Payment = {
      id: generateId('pay'),
      invoiceId,
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customerName,
      company: invoice.company,
      amount: values.amount,
      method: values.method,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    const invoiceTotal = calculateLineItemsTotal(invoice.items);
    const paidSoFar =
      get()
        .payments.filter((payment) => payment.invoiceId === invoiceId && payment.status === 'completed')
        .reduce((sum, payment) => sum + payment.amount, 0) + values.amount;

    set((state) => ({
      payments: [newPayment, ...state.payments],
      invoices:
        paidSoFar >= invoiceTotal
          ? state.invoices.map((entry) => (entry.id === invoiceId ? { ...entry, status: 'paid' } : entry))
          : state.invoices,
    }));
  },
}));
