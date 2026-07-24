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
import { apiClient } from '@/services/api.client';

interface SalesState {
  deals: Deal[];
  quotations: Quotation[];
  invoices: Invoice[];
  payments: Payment[];
  isLoading: boolean;

  fetchSalesData: () => Promise<void>;
  addDeal: (values: DealFormValues) => Promise<Deal>;
  updateDeal: (id: string, values: DealFormValues) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
  moveDealStage: (id: string, stage: DealStage) => Promise<void>;

  addQuotation: (values: QuotationFormValues) => Promise<Quotation>;
  updateQuotation: (id: string, values: QuotationFormValues) => Promise<void>;
  deleteQuotation: (id: string) => Promise<void>;
  setQuotationStatus: (id: string, status: QuotationStatus) => Promise<void>;

  addInvoice: (values: InvoiceFormValues) => Promise<Invoice>;
  updateInvoice: (id: string, values: InvoiceFormValues) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  setInvoiceStatus: (id: string, status: InvoiceStatus) => Promise<void>;

  recordPayment: (invoiceId: string, values: PaymentFormValues) => Promise<void>;
}

export const useSalesStore = create<SalesState>()((set, get) => ({
  deals: [],
  quotations: [],
  invoices: [],
  payments: [],
  isLoading: false,

  fetchSalesData: async () => {
    set({ isLoading: true });
    try {
      const [dealsRes, quoRes, invRes, payRes] = await Promise.all([
        apiClient.get('/sales/deals').catch(() => ({ data: { data: [] } })),
        apiClient.get('/sales/quotations').catch(() => ({ data: { data: [] } })),
        apiClient.get('/sales/invoices').catch(() => ({ data: { data: [] } })),
        apiClient.get('/sales/payments').catch(() => ({ data: { data: [] } })),
      ]);

      set({
        deals: dealsRes.data.data || dealsRes.data || [],
        quotations: quoRes.data.data || quoRes.data || [],
        invoices: invRes.data.data || invRes.data || [],
        payments: payRes.data.data || payRes.data || [],
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  addDeal: async (values) => {
    const res = await apiClient.post('/sales/deals', values);
    const newDeal: Deal = res.data;
    set((state) => ({ deals: [newDeal, ...state.deals] }));
    return newDeal;
  },

  updateDeal: async (id, values) => {
    const res = await apiClient.put(`/sales/deals/${id}`, values);
    const updated: Deal = res.data;
    set((state) => ({
      deals: state.deals.map((d) => (d.id === id ? updated : d)),
    }));
  },

  deleteDeal: async (id) => {
    await apiClient.delete(`/sales/deals/${id}`);
    set((state) => ({ deals: state.deals.filter((d) => d.id !== id) }));
  },

  moveDealStage: async (id, stage) => {
    const deal = get().deals.find((d) => d.id === id);
    if (!deal) return;
    const updated = { ...deal, stage };

    set((state) => ({
      deals: state.deals.map((d) => (d.id === id ? updated : d)),
    }));

    try {
      await apiClient.put(`/sales/deals/${id}`, { stage });
    } catch {
      set((state) => ({
        deals: state.deals.map((d) => (d.id === id ? deal : d)),
      }));
    }
  },

  addQuotation: async (values) => {
    const res = await apiClient.post('/sales/quotations', values);
    const newQuotation: Quotation = res.data;
    set((state) => ({ quotations: [newQuotation, ...state.quotations] }));
    return newQuotation;
  },

  updateQuotation: async (id, values) => {
    const res = await apiClient.put(`/sales/quotations/${id}`, values);
    const updated: Quotation = res.data;
    set((state) => ({
      quotations: state.quotations.map((q) => (q.id === id ? updated : q)),
    }));
  },

  deleteQuotation: async (id) => {
    await apiClient.delete(`/sales/quotations/${id}`);
    set((state) => ({ quotations: state.quotations.filter((q) => q.id !== id) }));
  },

  setQuotationStatus: async (id, status) => {
    const quotation = get().quotations.find((q) => q.id === id);
    if (!quotation) return;
    set((state) => ({
      quotations: state.quotations.map((q) => (q.id === id ? { ...q, status } : q)),
    }));
    try {
      await apiClient.put(`/sales/quotations/${id}`, { status });
    } catch {
      set((state) => ({
        quotations: state.quotations.map((q) => (q.id === id ? quotation : q)),
      }));
    }
  },

  addInvoice: async (values) => {
    const res = await apiClient.post('/sales/invoices', values);
    const newInvoice: Invoice = res.data;
    set((state) => ({ invoices: [newInvoice, ...state.invoices] }));
    return newInvoice;
  },

  updateInvoice: async (id, values) => {
    const res = await apiClient.put(`/sales/invoices/${id}`, values);
    const updated: Invoice = res.data;
    set((state) => ({
      invoices: state.invoices.map((inv) => (inv.id === id ? updated : inv)),
    }));
  },

  deleteInvoice: async (id) => {
    await apiClient.delete(`/sales/invoices/${id}`);
    set((state) => ({ invoices: state.invoices.filter((inv) => inv.id !== id) }));
  },

  setInvoiceStatus: async (id, status) => {
    const invoice = get().invoices.find((inv) => inv.id === id);
    if (!invoice) return;
    set((state) => ({
      invoices: state.invoices.map((inv) => (inv.id === id ? { ...inv, status } : inv)),
    }));
    try {
      await apiClient.put(`/sales/invoices/${id}`, { status });
    } catch {
      set((state) => ({
        invoices: state.invoices.map((inv) => (inv.id === id ? invoice : inv)),
      }));
    }
  },

  recordPayment: async (invoiceId, values) => {
    const res = await apiClient.post('/sales/payments', { invoiceId, ...values });
    const payment: Payment = res.data;
    set((state) => ({
      payments: [payment, ...state.payments],
    }));
  },
}));
