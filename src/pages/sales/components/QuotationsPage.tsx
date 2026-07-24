import { useMemo, useState } from 'react';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { Plus, Trash2, Pencil, Eye, Send, Check, X, FileOutput } from 'lucide-react';
import { DataTable } from '@/components/tables/DataTable';
import type { DataTableColumn } from '@/components/tables/DataTable';
import { Button } from '@/components/buttons/Button';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { Drawer } from '@/components/modals/Drawer';
import { QuotationForm } from '@/components/forms/QuotationForm';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { DocumentPreviewModal } from '@/pages/sales/components/DocumentPreviewModal';
import { useSalesStore } from '@/store/sales.store';
import { toast } from '@/store/toast.store';
import {
  QUOTATION_STATUS_LABEL,
  QUOTATION_STATUS_OPTIONS,
  QUOTATION_STATUS_TONE,
} from '@/constants/sales.constants';
import type { Quotation, QuotationFormValues, QuotationStatus } from '@/types/sales.types';
import { formatCurrency, formatDate } from '@/utils/format';
import { calculateLineItemsTotal } from '@/utils/sales';

const FORM_ID = 'quotation-form';

function toFormValues(quotation: Quotation): QuotationFormValues {
  return {
    customerId: quotation.customerId,
    dealId: quotation.dealId ?? '',
    validUntil: quotation.validUntil,
    notes: quotation.notes ?? '',
    items: quotation.items.map(({ description, quantity, unitPrice }) => ({
      description,
      quantity,
      unitPrice,
    })),
  };
}

export default function QuotationsPage() {
  const isLoading = useSimulatedLoading();
  const quotations = useSalesStore((state) => state.quotations);
  const addQuotation = useSalesStore((state) => state.addQuotation);
  const updateQuotation = useSalesStore((state) => state.updateQuotation);
  const deleteQuotation = useSalesStore((state) => state.deleteQuotation);
  const setQuotationStatus = useSalesStore((state) => state.setQuotationStatus);
  const addInvoice = useSalesStore((state) => state.addInvoice);

  const [drawerQuotation, setDrawerQuotation] = useState<Quotation | 'new' | null>(null);
  const [previewQuotation, setPreviewQuotation] = useState<Quotation | null>(null);
  const [statusFilter, setStatusFilter] = useState<QuotationStatus[]>([]);

  const filteredQuotations = useMemo(
    () => (statusFilter.length === 0 ? quotations : quotations.filter((q) => statusFilter.includes(q.status))),
    [quotations, statusFilter],
  );
  const [pendingDelete, setPendingDelete] = useState<Quotation | null>(null);

  function handleFormSubmit(values: QuotationFormValues) {
    if (drawerQuotation && drawerQuotation !== 'new') {
      updateQuotation(drawerQuotation.id, values);
      toast.success('Quote updated');
    } else {
      const created = addQuotation(values);
      toast.success('Quote created', { description: `${created.quoteNumber} was saved as a draft.` });
    }
    setDrawerQuotation(null);
  }

  function handleConvertToInvoice(quotation: Quotation) {
    const created = addInvoice({
      customerId: quotation.customerId,
      dealId: quotation.dealId ?? '',
      dueDate: quotation.validUntil,
      notes: quotation.notes ?? '',
      items: quotation.items.map(({ description, quantity, unitPrice }) => ({
        description,
        quantity,
        unitPrice,
      })),
    });
    toast.success('Invoice created', { description: `${created.invoiceNumber} was generated from ${quotation.quoteNumber}.` });
  }

  const columns: DataTableColumn<Quotation>[] = [
    {
      id: 'quoteNumber',
      header: 'Quote #',
      hideable: false,
      sortValue: (row) => row.quoteNumber,
      cell: (row) => <span className="font-medium text-foreground">{row.quoteNumber}</span>,
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
        <StatusBadge label={QUOTATION_STATUS_LABEL[row.status]} tone={QUOTATION_STATUS_TONE[row.status]} />
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
      id: 'validUntil',
      header: 'Valid until',
      align: 'right',
      sortValue: (row) => row.validUntil,
      cell: (row) => formatDate(row.validUntil),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end">
        <Button onClick={() => setDrawerQuotation('new')}>
          <Plus size={16} />
          New quote
        </Button>
      </div>

      <DataTable
        isLoading={isLoading}
        data={filteredQuotations}
        columns={columns}
        getRowId={(row) => row.id}
        getSearchableText={(row) => `${row.quoteNumber} ${row.customerName} ${row.company}`}
        searchPlaceholder="Search quotes…"
        onRowClick={setPreviewQuotation}
        pageSize={8}
        emptyState={{ title: 'No quotations match your filters', description: 'Try clearing a filter or creating a new quote.' }}
        toolbarExtra={
          <FilterDropdown
            label="Status"
            options={QUOTATION_STATUS_OPTIONS}
            selected={statusFilter}
            onChange={setStatusFilter}
          />
        }
        rowActions={(row) => [
          { label: 'Preview', icon: Eye, onSelect: () => setPreviewQuotation(row) },
          { label: 'Edit', icon: Pencil, onSelect: () => setDrawerQuotation(row) },
          ...(row.status === 'draft'
            ? [{ label: 'Mark as Sent', icon: Send, onSelect: () => setQuotationStatus(row.id, 'sent') }]
            : []),
          ...(row.status === 'sent'
            ? [
                { label: 'Mark Accepted', icon: Check, onSelect: () => setQuotationStatus(row.id, 'accepted') },
                { label: 'Mark Declined', icon: X, onSelect: () => setQuotationStatus(row.id, 'declined') },
              ]
            : []),
          ...(row.status === 'accepted'
            ? [{ label: 'Convert to invoice', icon: FileOutput, onSelect: () => handleConvertToInvoice(row) }]
            : []),
          { label: 'Delete', icon: Trash2, tone: 'danger', onSelect: () => setPendingDelete(row) },
        ]}
      />

      <Drawer
        isOpen={drawerQuotation !== null}
        onClose={() => setDrawerQuotation(null)}
        title={drawerQuotation && drawerQuotation !== 'new' ? 'Edit quote' : 'New quote'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDrawerQuotation(null)}>
              Cancel
            </Button>
            <Button type="submit" form={FORM_ID}>
              {drawerQuotation && drawerQuotation !== 'new' ? 'Save changes' : 'Create quote'}
            </Button>
          </>
        }
      >
        <QuotationForm
          key={drawerQuotation === 'new' || drawerQuotation === null ? 'new' : drawerQuotation.id}
          formId={FORM_ID}
          defaultValues={
            drawerQuotation && drawerQuotation !== 'new' ? toFormValues(drawerQuotation) : undefined
          }
          onSubmit={handleFormSubmit}
        />
      </Drawer>

      {previewQuotation && (
        <DocumentPreviewModal
          isOpen={previewQuotation !== null}
          onClose={() => setPreviewQuotation(null)}
          documentLabel="Quotation"
          documentNumber={previewQuotation.quoteNumber}
          statusBadge={
            <StatusBadge
              label={QUOTATION_STATUS_LABEL[previewQuotation.status]}
              tone={QUOTATION_STATUS_TONE[previewQuotation.status]}
            />
          }
          customerName={previewQuotation.customerName}
          company={previewQuotation.company}
          dateLabel="Valid until"
          dateValue={previewQuotation.validUntil}
          items={previewQuotation.items}
          notes={previewQuotation.notes}
          footer={
            <Button variant="secondary" onClick={() => setPreviewQuotation(null)}>
              Close
            </Button>
          }
        />
      )}

      <ConfirmDialog
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Delete this quote?"
        description={pendingDelete ? `This removes ${pendingDelete.quoteNumber}. This can't be undone.` : undefined}
        confirmLabel="Delete quote"
        tone="danger"
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteQuotation(pendingDelete.id);
          toast.success('Quote deleted');
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
