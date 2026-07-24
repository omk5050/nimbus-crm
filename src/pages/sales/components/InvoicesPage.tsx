import { useMemo, useState } from 'react';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { Plus, Trash2, Pencil, Eye, Send, DollarSign, Ban } from 'lucide-react';
import { DataTable } from '@/components/tables/DataTable';
import type { DataTableColumn } from '@/components/tables/DataTable';
import { Button } from '@/components/buttons/Button';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { Drawer } from '@/components/modals/Drawer';
import { Modal } from '@/components/modals/Modal';
import { InvoiceForm } from '@/components/forms/InvoiceForm';
import { PaymentForm } from '@/components/forms/PaymentForm';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { DocumentPreviewModal } from '@/pages/sales/components/DocumentPreviewModal';
import { useSalesStore } from '@/store/sales.store';
import { toast } from '@/store/toast.store';
import {
  INVOICE_STATUS_LABEL,
  INVOICE_STATUS_OPTIONS,
  INVOICE_STATUS_TONE,
} from '@/constants/sales.constants';
import type { Invoice, InvoiceFormValues, InvoiceStatus, PaymentFormValues } from '@/types/sales.types';
import { formatCurrency, formatDate } from '@/utils/format';
import { calculateLineItemsTotal } from '@/utils/sales';

const FORM_ID = 'invoice-form';
const PAYMENT_FORM_ID = 'payment-form';

function toFormValues(invoice: Invoice): InvoiceFormValues {
  return {
    customerId: invoice.customerId,
    dealId: invoice.dealId ?? '',
    dueDate: invoice.dueDate,
    notes: invoice.notes ?? '',
    items: invoice.items.map(({ description, quantity, unitPrice }) => ({
      description,
      quantity,
      unitPrice,
    })),
  };
}

export default function InvoicesPage() {
  const isLoading = useSimulatedLoading();
  const invoices = useSalesStore((state) => state.invoices);
  const payments = useSalesStore((state) => state.payments);
  const addInvoice = useSalesStore((state) => state.addInvoice);
  const updateInvoice = useSalesStore((state) => state.updateInvoice);
  const deleteInvoice = useSalesStore((state) => state.deleteInvoice);
  const setInvoiceStatus = useSalesStore((state) => state.setInvoiceStatus);
  const recordPayment = useSalesStore((state) => state.recordPayment);

  const [drawerInvoice, setDrawerInvoice] = useState<Invoice | 'new' | null>(null);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Invoice | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus[]>([]);

  const filteredInvoices = useMemo(
    () => (statusFilter.length === 0 ? invoices : invoices.filter((invoice) => statusFilter.includes(invoice.status))),
    [invoices, statusFilter],
  );

  const outstandingBalance = useMemo(() => {
    if (!paymentInvoice) return 0;
    const total = calculateLineItemsTotal(paymentInvoice.items);
    const paid = payments
      .filter((payment) => payment.invoiceId === paymentInvoice.id && payment.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0);
    return Math.max(total - paid, 0);
  }, [paymentInvoice, payments]);

  function handleFormSubmit(values: InvoiceFormValues) {
    if (drawerInvoice && drawerInvoice !== 'new') {
      updateInvoice(drawerInvoice.id, values);
      toast.success('Invoice updated');
    } else {
      const created = addInvoice(values);
      toast.success('Invoice created', { description: `${created.invoiceNumber} was saved as a draft.` });
    }
    setDrawerInvoice(null);
  }

  function handlePaymentSubmit(values: PaymentFormValues) {
    if (!paymentInvoice) return;
    recordPayment(paymentInvoice.id, values);
    toast.success('Payment recorded', {
      description: `${formatCurrency(values.amount)} recorded against ${paymentInvoice.invoiceNumber}.`,
    });
    setPaymentInvoice(null);
  }

  const columns: DataTableColumn<Invoice>[] = [
    {
      id: 'invoiceNumber',
      header: 'Invoice #',
      hideable: false,
      sortValue: (row) => row.invoiceNumber,
      cell: (row) => <span className="font-medium text-foreground">{row.invoiceNumber}</span>,
    },
    {
      id: 'customer',
      header: 'Customer',
      sortValue: (row) => row.customerName,
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate text-foreground">{row.customerName}</p>
          <p className="truncate text-xs text-muted-foreground">{row.company}</p>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      sortValue: (row) => row.status,
      cell: (row) => (
        <StatusBadge label={INVOICE_STATUS_LABEL[row.status]} tone={INVOICE_STATUS_TONE[row.status]} />
      ),
    },
    {
      id: 'total',
      header: 'Total',
      align: 'right',
      sortValue: (row) => calculateLineItemsTotal(row.items),
      cell: (row) => formatCurrency(calculateLineItemsTotal(row.items)),
    },
    {
      id: 'dueDate',
      header: 'Due date',
      align: 'right',
      sortValue: (row) => row.dueDate,
      cell: (row) => formatDate(row.dueDate),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end">
        <Button onClick={() => setDrawerInvoice('new')}>
          <Plus size={16} />
          New invoice
        </Button>
      </div>

      <DataTable
        isLoading={isLoading}
        data={filteredInvoices}
        columns={columns}
        getRowId={(row) => row.id}
        getSearchableText={(row) => `${row.invoiceNumber} ${row.customerName} ${row.company}`}
        searchPlaceholder="Search invoices…"
        onRowClick={setPreviewInvoice}
        pageSize={8}
        emptyState={{ title: 'No invoices match your filters', description: 'Try clearing a filter or creating a new invoice.' }}
        toolbarExtra={
          <FilterDropdown
            label="Status"
            options={INVOICE_STATUS_OPTIONS}
            selected={statusFilter}
            onChange={setStatusFilter}
          />
        }
        rowActions={(row) => [
          { label: 'Preview', icon: Eye, onSelect: () => setPreviewInvoice(row) },
          { label: 'Edit', icon: Pencil, onSelect: () => setDrawerInvoice(row) },
          ...(row.status === 'draft'
            ? [{ label: 'Mark as Sent', icon: Send, onSelect: () => setInvoiceStatus(row.id, 'sent') }]
            : []),
          ...(row.status === 'sent' || row.status === 'overdue'
            ? [{ label: 'Record payment', icon: DollarSign, onSelect: () => setPaymentInvoice(row) }]
            : []),
          ...(row.status !== 'paid' && row.status !== 'void'
            ? [{ label: 'Void invoice', icon: Ban, tone: 'danger' as const, onSelect: () => setInvoiceStatus(row.id, 'void') }]
            : []),
          { label: 'Delete', icon: Trash2, tone: 'danger', onSelect: () => setPendingDelete(row) },
        ]}
      />

      <Drawer
        isOpen={drawerInvoice !== null}
        onClose={() => setDrawerInvoice(null)}
        title={drawerInvoice && drawerInvoice !== 'new' ? 'Edit invoice' : 'New invoice'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDrawerInvoice(null)}>
              Cancel
            </Button>
            <Button type="submit" form={FORM_ID}>
              {drawerInvoice && drawerInvoice !== 'new' ? 'Save changes' : 'Create invoice'}
            </Button>
          </>
        }
      >
        <InvoiceForm
          key={drawerInvoice === 'new' || drawerInvoice === null ? 'new' : drawerInvoice.id}
          formId={FORM_ID}
          defaultValues={drawerInvoice && drawerInvoice !== 'new' ? toFormValues(drawerInvoice) : undefined}
          onSubmit={handleFormSubmit}
        />
      </Drawer>

      {previewInvoice && (
        <DocumentPreviewModal
          isOpen={previewInvoice !== null}
          onClose={() => setPreviewInvoice(null)}
          documentLabel="Invoice"
          documentNumber={previewInvoice.invoiceNumber}
          statusBadge={
            <StatusBadge
              label={INVOICE_STATUS_LABEL[previewInvoice.status]}
              tone={INVOICE_STATUS_TONE[previewInvoice.status]}
            />
          }
          customerName={previewInvoice.customerName}
          company={previewInvoice.company}
          dateLabel="Due date"
          dateValue={previewInvoice.dueDate}
          items={previewInvoice.items}
          notes={previewInvoice.notes}
          footer={
            <Button variant="secondary" onClick={() => setPreviewInvoice(null)}>
              Close
            </Button>
          }
        />
      )}

      <Modal
        isOpen={paymentInvoice !== null}
        onClose={() => setPaymentInvoice(null)}
        title="Record payment"
        description={paymentInvoice ? `Against ${paymentInvoice.invoiceNumber} · outstanding ${formatCurrency(outstandingBalance)}` : undefined}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPaymentInvoice(null)}>
              Cancel
            </Button>
            <Button type="submit" form={PAYMENT_FORM_ID}>
              Record payment
            </Button>
          </>
        }
      >
        {paymentInvoice && (
          <PaymentForm
            formId={PAYMENT_FORM_ID}
            defaultAmount={outstandingBalance}
            onSubmit={handlePaymentSubmit}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Delete this invoice?"
        description={pendingDelete ? `This removes ${pendingDelete.invoiceNumber}. This can't be undone.` : undefined}
        confirmLabel="Delete invoice"
        tone="danger"
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteInvoice(pendingDelete.id);
          toast.success('Invoice deleted');
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
