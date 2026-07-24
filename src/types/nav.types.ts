import type { LucideIcon } from 'lucide-react';

/**
 * A single entry in the primary sidebar navigation.
 * `matchPrefix` lets a parent item stay highlighted while the user is
 * anywhere under its route tree (e.g. /customers/42 still highlights
 * the "Customers" sidebar item).
 */
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  matchPrefix?: boolean;
  badgeCount?: number;
}
