import type { ReactNode } from 'react';
import { Modal } from '@/components/modals/Modal';
import { useCompanyStore } from '@/store/company.store';
import type { LineItem } from '@/types/sales.types';
import { formatCurrency, formatDate } from '@/utils/format';
import { calculateLineItemsTotal } from '@/utils/sales';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentLabel: string;
  documentNumber: string;
  statusBadge: ReactNode;
  customerName: string;
  company: string;
  dateLabel: string;
  dateValue: string;
  items: LineItem[];
  notes?: string;
  footer?: ReactNode;
}

/** A read-only, printable-looking preview of a quote or invoice — same layout, different labels/data. */
export function DocumentPreviewModal({
  isOpen,
  onClose,
  documentLabel,
  documentNumber,
  statusBadge,
  customerName,
  company,
  dateLabel,
  dateValue,
  items,
  notes,
  footer,
}: DocumentPreviewModalProps) {
  const total = calculateLineItemsTotal(items);
  const ourCompany = useCompanyStore((state) => state.company);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" footer={footer}>
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {documentLabel}
            </p>
            <h2 className="mt-0.5 text-lg font-semibold text-foreground">{documentNumber}</h2>
          </div>
          {statusBadge}
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-md bg-muted/40 p-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">{ourCompany.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bill to</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">{customerName}</p>
            <p className="text-xs text-muted-foreground">{company}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{dateLabel}</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">{formatDate(dateValue)}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-2 font-medium">Description</th>
                <th className="py-2 text-right font-medium">Qty</th>
                <th className="py-2 text-right font-medium">Unit price</th>
                <th className="py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="py-2.5 text-foreground">{item.description}</td>
                  <td className="py-2.5 text-right text-muted-foreground">{item.quantity}</td>
                  <td className="py-2.5 text-right text-muted-foreground">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="py-2.5 text-right font-medium text-foreground">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="flex w-48 items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-medium text-muted-foreground">Total</span>
            <span className="text-base font-semibold text-foreground">{formatCurrency(total)}</span>
          </div>
        </div>

        {notes && (
          <div className="rounded-md border border-border p-3">
            <p className="text-xs font-medium text-muted-foreground">Notes</p>
            <p className="mt-1 text-sm text-foreground">{notes}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
