import type { NavItem } from '@/types/nav.types';

/**
 * A nav item is active on an exact path match, or — when `matchPrefix`
 * is set — whenever the current path is nested under it (e.g. /customers/42
 * still highlights "Customers").
 */
export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (pathname === item.path) return true;
  if (item.matchPrefix) return pathname.startsWith(`${item.path}/`);
  return false;
}
