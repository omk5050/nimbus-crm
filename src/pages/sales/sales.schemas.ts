import { z } from 'zod';

export const dealFormSchema = z.object({
  title: z.string().min(2, 'Enter a deal name'),
  customerId: z.string().min(1, 'Select a customer'),
  stage: z.enum(['qualifying', 'proposal', 'negotiation', 'won', 'lost'], 'Select a stage'),
  value: z.number().min(0, 'Enter a valid deal value'),
  owner: z.string().min(1, 'Assign an owner'),
  expectedCloseDate: z.string(),
});

const lineItemSchema = z.object({
  description: z.string().min(1, 'Enter a description'),
  quantity: z.number().min(1, 'Qty must be at least 1'),
  unitPrice: z.number().min(0, 'Enter a valid price'),
});

export const quotationFormSchema = z.object({
  customerId: z.string().min(1, 'Select a customer'),
  dealId: z.string(),
  validUntil: z.string().min(1, 'Set a valid-until date'),
  notes: z.string(),
  items: z.array(lineItemSchema).min(1, 'Add at least one line item'),
});

export const invoiceFormSchema = z.object({
  customerId: z.string().min(1, 'Select a customer'),
  dealId: z.string(),
  dueDate: z.string().min(1, 'Set a due date'),
  notes: z.string(),
  items: z.array(lineItemSchema).min(1, 'Add at least one line item'),
});

export const paymentFormSchema = z.object({
  amount: z.number().min(0.01, 'Enter a valid amount'),
  method: z.enum(['card', 'bank_transfer', 'check', 'cash'], 'Select a method'),
});
