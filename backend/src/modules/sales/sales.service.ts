import { prisma } from '@/config/prisma';
import { AppError } from '@/middleware/error.middleware';
import { parsePagination, parseSorting } from '@/utils/pagination';
import type {
  DealInput, MoveDealStageInput, DealListQuery,
  QuotationInput, QuotationStatusInput, QuotationListQuery,
  InvoiceInput, InvoiceStatusInput, InvoiceListQuery,
  PaymentInput,
} from './sales.schema';

// ─── Counter helpers ──────────────────────────────────────────

async function nextQuoteNumber(): Promise<string> {
  const count = await prisma.quotation.count();
  return `QUO-${String(count + 1).padStart(4, '0')}`;
}

async function nextInvoiceNumber(): Promise<string> {
  const count = await prisma.invoice.count();
  return `INV-${String(count + 1).padStart(4, '0')}`;
}

async function resolveCustomer(customerId: string) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { name: true, company: true },
  });
  return {
    customerName: customer?.name ?? 'Unknown',
    company: customer?.company ?? 'Unknown',
  };
}

// ─────────────────────────────────────────────────────────────
// DEALS
// ─────────────────────────────────────────────────────────────

export async function listDeals(companyId: string, query: DealListQuery) {
  const { page, limit, skip } = parsePagination(query as Record<string, string | undefined>);
  const orderBy = parseSorting(query as Record<string, string | undefined>, ['title', 'value', 'createdAt']);

  const where = {
    companyId,
    ...(query.stage && { stage: query.stage as any }),
    ...(query.owner && { owner: { contains: query.owner, mode: 'insensitive' as const } }),
    ...(query.search && {
      OR: [
        { title: { contains: query.search, mode: 'insensitive' as const } },
        { customerName: { contains: query.search, mode: 'insensitive' as const } },
        { company: { contains: query.search, mode: 'insensitive' as const } },
      ],
    }),
  };

  const [deals, total] = await Promise.all([
    prisma.deal.findMany({ where, orderBy, skip, take: limit }),
    prisma.deal.count({ where }),
  ]);
  return { deals, total, page, limit };
}

export async function getDeal(companyId: string, id: string) {
  const deal = await prisma.deal.findFirst({ where: { id, companyId } });
  if (!deal) throw new AppError(404, 'NOT_FOUND', 'Deal not found');
  return deal;
}

export async function createDeal(companyId: string, input: DealInput) {
  const { customerName, company } = await resolveCustomer(input.customerId);
  return prisma.deal.create({
    data: {
      companyId,
      title: input.title,
      customerId: input.customerId,
      customerName,
      company,
      stage: input.stage as any,
      value: input.value,
      owner: input.owner,
      expectedCloseDate: input.expectedCloseDate ? new Date(input.expectedCloseDate) : null,
    },
  });
}

export async function updateDeal(companyId: string, id: string, input: DealInput) {
  await assertDealExists(companyId, id);
  const { customerName, company } = await resolveCustomer(input.customerId);
  return prisma.deal.update({
    where: { id },
    data: {
      title: input.title,
      customerId: input.customerId,
      customerName,
      company,
      stage: input.stage as any,
      value: input.value,
      owner: input.owner,
      expectedCloseDate: input.expectedCloseDate ? new Date(input.expectedCloseDate) : null,
    },
  });
}

export async function deleteDeal(companyId: string, id: string) {
  await assertDealExists(companyId, id);
  await prisma.deal.delete({ where: { id } });
}

export async function moveDealStage(companyId: string, id: string, input: MoveDealStageInput) {
  await assertDealExists(companyId, id);
  return prisma.deal.update({ where: { id }, data: { stage: input.stage as any } });
}

// ─────────────────────────────────────────────────────────────
// QUOTATIONS
// ─────────────────────────────────────────────────────────────

export async function listQuotations(companyId: string, query: QuotationListQuery) {
  const { page, limit, skip } = parsePagination(query as Record<string, string | undefined>);
  const orderBy = parseSorting(query as Record<string, string | undefined>, ['quoteNumber', 'createdAt', 'validUntil']);
  const where = {
    companyId,
    ...(query.status && { status: query.status as any }),
    ...(query.customerId && { customerId: query.customerId }),
  };
  const [quotations, total] = await Promise.all([
    prisma.quotation.findMany({ where, include: { items: true }, orderBy, skip, take: limit }),
    prisma.quotation.count({ where }),
  ]);
  return { quotations, total, page, limit };
}

export async function getQuotation(companyId: string, id: string) {
  const q = await prisma.quotation.findFirst({
    where: { id, companyId },
    include: { items: true },
  });
  if (!q) throw new AppError(404, 'NOT_FOUND', 'Quotation not found');
  return q;
}

export async function createQuotation(companyId: string, input: QuotationInput) {
  const { customerName, company } = await resolveCustomer(input.customerId);
  const quoteNumber = await nextQuoteNumber();
  return prisma.quotation.create({
    data: {
      companyId,
      quoteNumber,
      dealId: input.dealId || null,
      customerId: input.customerId,
      customerName,
      company,
      status: 'draft',
      validUntil: new Date(input.validUntil),
      notes: input.notes || null,
      items: { create: input.items },
    },
    include: { items: true },
  });
}

export async function updateQuotation(companyId: string, id: string, input: QuotationInput) {
  await assertQuotationExists(companyId, id);
  const { customerName, company } = await resolveCustomer(input.customerId);
  return prisma.quotation.update({
    where: { id },
    data: {
      dealId: input.dealId || null,
      customerId: input.customerId,
      customerName,
      company,
      validUntil: new Date(input.validUntil),
      notes: input.notes || null,
      items: { deleteMany: {}, create: input.items },
    },
    include: { items: true },
  });
}

export async function deleteQuotation(companyId: string, id: string) {
  await assertQuotationExists(companyId, id);
  await prisma.quotation.delete({ where: { id } });
}

export async function setQuotationStatus(companyId: string, id: string, input: QuotationStatusInput) {
  await assertQuotationExists(companyId, id);
  return prisma.quotation.update({ where: { id }, data: { status: input.status as any } });
}

// ─────────────────────────────────────────────────────────────
// INVOICES
// ─────────────────────────────────────────────────────────────

export async function listInvoices(companyId: string, query: InvoiceListQuery) {
  const { page, limit, skip } = parsePagination(query as Record<string, string | undefined>);
  const orderBy = parseSorting(query as Record<string, string | undefined>, ['invoiceNumber', 'createdAt', 'dueDate']);
  const where = {
    companyId,
    ...(query.status && { status: query.status as any }),
    ...(query.customerId && { customerId: query.customerId }),
  };
  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({ where, include: { items: true }, orderBy, skip, take: limit }),
    prisma.invoice.count({ where }),
  ]);
  return { invoices, total, page, limit };
}

export async function getInvoice(companyId: string, id: string) {
  const inv = await prisma.invoice.findFirst({
    where: { id, companyId },
    include: { items: true, payments: true },
  });
  if (!inv) throw new AppError(404, 'NOT_FOUND', 'Invoice not found');
  return inv;
}

export async function createInvoice(companyId: string, input: InvoiceInput) {
  const { customerName, company } = await resolveCustomer(input.customerId);
  const invoiceNumber = await nextInvoiceNumber();
  return prisma.invoice.create({
    data: {
      companyId,
      invoiceNumber,
      dealId: input.dealId || null,
      quotationId: input.quotationId || null,
      customerId: input.customerId,
      customerName,
      company,
      status: 'draft',
      dueDate: new Date(input.dueDate),
      notes: input.notes || null,
      items: { create: input.items },
    },
    include: { items: true },
  });
}

export async function updateInvoice(companyId: string, id: string, input: InvoiceInput) {
  await assertInvoiceExists(companyId, id);
  const { customerName, company } = await resolveCustomer(input.customerId);
  return prisma.invoice.update({
    where: { id },
    data: {
      dealId: input.dealId || null,
      quotationId: input.quotationId || null,
      customerId: input.customerId,
      customerName,
      company,
      dueDate: new Date(input.dueDate),
      notes: input.notes || null,
      items: { deleteMany: {}, create: input.items },
    },
    include: { items: true },
  });
}

export async function deleteInvoice(companyId: string, id: string) {
  await assertInvoiceExists(companyId, id);
  await prisma.invoice.delete({ where: { id } });
}

export async function setInvoiceStatus(companyId: string, id: string, input: InvoiceStatusInput) {
  await assertInvoiceExists(companyId, id);
  return prisma.invoice.update({ where: { id }, data: { status: input.status as any } });
}

// ─────────────────────────────────────────────────────────────
// PAYMENTS
// ─────────────────────────────────────────────────────────────

export async function listPayments(companyId: string) {
  return prisma.payment.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function recordPayment(companyId: string, invoiceId: string, input: PaymentInput) {
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, companyId },
    include: { items: true, payments: { where: { status: 'completed' } } },
  });
  if (!invoice) throw new AppError(404, 'NOT_FOUND', 'Invoice not found');

  const total = invoice.items.reduce((sum: number, item: { quantity: number; unitPrice: number }) => sum + item.quantity * item.unitPrice, 0);
  const paidSoFar = invoice.payments.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0) + input.amount;

  const payment = await prisma.payment.create({
    data: {
      companyId,
      invoiceId,
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customerName,
      company: invoice.company,
      amount: input.amount,
      method: input.method as any,
      status: 'completed',
    },
  });

  if (paidSoFar >= total) {
    await prisma.invoice.update({ where: { id: invoiceId }, data: { status: 'paid' } });
  }

  return payment;
}

// ─── Private ─────────────────────────────────────────────────

async function assertDealExists(companyId: string, id: string) {
  const exists = await prisma.deal.findFirst({ where: { id, companyId }, select: { id: true } });
  if (!exists) throw new AppError(404, 'NOT_FOUND', 'Deal not found');
}

async function assertQuotationExists(companyId: string, id: string) {
  const exists = await prisma.quotation.findFirst({ where: { id, companyId }, select: { id: true } });
  if (!exists) throw new AppError(404, 'NOT_FOUND', 'Quotation not found');
}

async function assertInvoiceExists(companyId: string, id: string) {
  const exists = await prisma.invoice.findFirst({ where: { id, companyId }, select: { id: true } });
  if (!exists) throw new AppError(404, 'NOT_FOUND', 'Invoice not found');
}
