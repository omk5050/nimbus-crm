import { Route, Routes } from 'react-router';
import CustomerListPage from '@/pages/customers/components/CustomerListPage';
import CustomerDetailPage from '@/pages/customers/components/CustomerDetailPage';

/**
 * Mounted at `/customers/*` by AppRouter. Owns its own sub-routing so the
 * list and detail views can be separate, lazily-independent pages while
 * still sharing this one entry in the top-level route table.
 */
export default function CustomersPage() {
  return (
    <Routes>
      <Route index element={<CustomerListPage />} />
      <Route path=":id" element={<CustomerDetailPage />} />
    </Routes>
  );
}
