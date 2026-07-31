import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '@/store/auth.store';
import { useHasPermission } from '@/hooks/usePermissions';
import { toast } from '@/store/toast.store';
import { ROUTES } from '@/constants/routes.constants';
import { PageLoader } from '@/components/common/PageLoader';

/**
 * Guards protected routes behind a verified session and role-based permissions.
 */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const location = useLocation();

  // Extract top-level module (e.g., /settings/users -> 'settings')
  const pathSegment = location.pathname.split('/')[1] || 'dashboard';
  const hasViewPermission = useHasPermission(pathSegment, 'view');

  useEffect(() => {
    if (isAuthenticated && !isCheckingAuth && !hasViewPermission && pathSegment !== 'dashboard') {
      toast.error('Access Restricted', {
        description: `Your role does not have permission to view the ${pathSegment} module.`,
      });
    }
  }, [isAuthenticated, isCheckingAuth, hasViewPermission, pathSegment]);

  if (isCheckingAuth) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (!hasViewPermission && pathSegment !== 'dashboard') {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}

