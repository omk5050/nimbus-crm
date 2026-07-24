import { Route, Routes } from 'react-router';
import { ReportsTabNav } from '@/pages/reports/components/ReportsTabNav';
import RevenueReportPage from '@/pages/reports/components/RevenueReportPage';
import SalesReportPage from '@/pages/reports/components/SalesReportPage';
import LeadsReportPage from '@/pages/reports/components/LeadsReportPage';
import EmployeesReportPage from '@/pages/reports/components/EmployeesReportPage';

/**
 * Mounted at `/reports/*` by AppRouter. Owns its own sub-routing across the
 * four report sub-sections, mirroring SalesPage's pill-tab + nested-routes
 * structure. Every report reads live from the real feature stores and is
 * scoped by its own date-range picker.
 */
export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Revenue, sales, leads, and employee performance across your workspace.
        </p>
      </div>

      <ReportsTabNav />

      <Routes>
        <Route index element={<RevenueReportPage />} />
        <Route path="sales" element={<SalesReportPage />} />
        <Route path="leads" element={<LeadsReportPage />} />
        <Route path="employees" element={<EmployeesReportPage />} />
      </Routes>
    </div>
  );
}
