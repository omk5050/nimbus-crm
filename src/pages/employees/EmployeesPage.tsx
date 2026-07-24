import { Route, Routes } from 'react-router';
import EmployeeListPage from '@/pages/employees/components/EmployeeListPage';
import EmployeeDetailPage from '@/pages/employees/components/EmployeeDetailPage';

/**
 * Mounted at `/employees/*` by AppRouter. Owns its own sub-routing so the
 * directory and profile views can be separate pages while still sharing
 * this one entry in the top-level route table.
 */
export default function EmployeesPage() {
  return (
    <Routes>
      <Route index element={<EmployeeListPage />} />
      <Route path=":id" element={<EmployeeDetailPage />} />
    </Routes>
  );
}
