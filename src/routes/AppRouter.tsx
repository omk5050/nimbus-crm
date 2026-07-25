import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { ROUTES } from '@/constants/routes.constants';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { GuestRoute } from '@/routes/GuestRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { PageLoader } from '@/components/common/PageLoader';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));

const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const CustomersPage = lazy(() => import('@/pages/customers/CustomersPage'));
const LeadsPage = lazy(() => import('@/pages/leads/LeadsPage'));
const SalesPage = lazy(() => import('@/pages/sales/SalesPage'));
const EmployeesPage = lazy(() => import('@/pages/employees/EmployeesPage'));
const TasksPage = lazy(() => import('@/pages/tasks/TasksPage'));
const ReportsPage = lazy(() => import('@/pages/reports/ReportsPage'));
const TablesPage = lazy(() => import('@/pages/tables/TablesPage'));
const NotificationsPage = lazy(() => import('@/pages/notifications/NotificationsPage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));

const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

        {/* Auth — only reachable when signed out */}
        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
          </Route>
        </Route>

        {/* Dashboard shell — only reachable when signed in */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={`${ROUTES.CUSTOMERS}/*`} element={<CustomersPage />} />
            <Route path={`${ROUTES.LEADS}/*`} element={<LeadsPage />} />
            <Route path={`${ROUTES.SALES}/*`} element={<SalesPage />} />
            <Route path={`${ROUTES.EMPLOYEES}/*`} element={<EmployeesPage />} />
            <Route path={`${ROUTES.TASKS}/*`} element={<TasksPage />} />
            <Route path={`${ROUTES.REPORTS}/*`} element={<ReportsPage />} />
            <Route path={ROUTES.TABLES} element={<TablesPage />} />
            <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
            <Route path={`${ROUTES.SETTINGS}/*`} element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
