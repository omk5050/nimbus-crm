import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import * as controller from './sales.controller';

const router = Router();
router.use(authenticate);

// Deals
router.get('/deals', controller.listDeals);
router.post('/deals', controller.createDeal);
router.get('/deals/:id', controller.getDeal);
router.put('/deals/:id', controller.updateDeal);
router.delete('/deals/:id', controller.deleteDeal);
router.patch('/deals/:id/stage', controller.moveDealStage);

// Quotations
router.get('/quotations', controller.listQuotations);
router.post('/quotations', controller.createQuotation);
router.get('/quotations/:id', controller.getQuotation);
router.put('/quotations/:id', controller.updateQuotation);
router.delete('/quotations/:id', controller.deleteQuotation);
router.patch('/quotations/:id/status', controller.setQuotationStatus);

// Invoices
router.get('/invoices', controller.listInvoices);
router.post('/invoices', controller.createInvoice);
router.get('/invoices/:id', controller.getInvoice);
router.put('/invoices/:id', controller.updateInvoice);
router.delete('/invoices/:id', controller.deleteInvoice);
router.patch('/invoices/:id/status', controller.setInvoiceStatus);

// Payments
router.get('/payments', controller.listPayments);
router.post('/invoices/:invoiceId/payments', controller.recordPayment);

export default router;
