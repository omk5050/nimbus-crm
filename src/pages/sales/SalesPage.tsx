import { Route, Routes } from 'react-router';
import { SalesTabNav } from '@/pages/sales/components/SalesTabNav';
import DealsPage from '@/pages/sales/components/DealsPage';
import QuotationsPage from '@/pages/sales/components/QuotationsPage';
import InvoicesPage from '@/pages/sales/components/InvoicesPage';
import PaymentsPage from '@/pages/sales/components/PaymentsPage';

/**
 * Mounted at `/sales/*` by AppRouter. Owns its own sub-routing across the
 * four Sales sub-sections (Deals — table + pipeline, Quotations, Invoices,
 * Payments), sharing one pill sub-nav so switching feels like tabs while
 * still giving each section a real, shareable URL.
 */
export default function SalesPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Sales</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Deals, quotations, invoices, and payments in one place.
        </p>
      </div>

      <SalesTabNav />

      <Routes>
        <Route index element={<DealsPage />} />
        <Route path="quotations" element={<QuotationsPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="payments" element={<PaymentsPage />} />
      </Routes>
    </div>
  );
}
