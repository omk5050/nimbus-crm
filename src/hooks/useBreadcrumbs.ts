import { useLocation } from 'react-router';
import { useMemo } from 'react';
import { PRIMARY_NAV } from '@/constants/nav.constants';
import { ROUTES } from '@/constants/routes.constants';
import { isNavItemActive } from '@/utils/nav.utils';
import type { BreadcrumbItem } from '@/types/common.types';

export function useBreadcrumbs(): BreadcrumbItem[] {
  const { pathname } = useLocation();

  return useMemo(() => {
    const activeItem = PRIMARY_NAV.find((item) => isNavItemActive(pathname, item));
    if (!activeItem) return [{ label: 'Dashboard', path: ROUTES.DASHBOARD }];

    const trail: BreadcrumbItem[] = [{ label: activeItem.label, path: activeItem.path }];

    // Nested route beyond the section root (e.g. /customers/42) — later phases
    // can replace this generic "Details" crumb with the real record name.
    const remainder = pathname.slice(activeItem.path.length).replace(/^\//, '');
    if (remainder) {
      trail.push({ label: 'Details' });
    }

    return trail;
  }, [pathname]);
}
