import {
  LayoutDashboard,
  Contact,
  Target,
  Briefcase,
  ClipboardList,
  Users,
  BarChart3,
  Utensils,
  Bell,
  Settings,
} from 'lucide-react';
import type { NavItem } from '@/types/nav.types';
import { ROUTES } from '@/constants/routes.constants';

/**
 * Primary sidebar navigation. Adding a module later (Phase 4+) is just
 * adding a line here — Sidebar, MobileDrawer and breadcrumb matching
 * all read from this single list.
 */
export const PRIMARY_NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { id: 'customers', label: 'Customers', path: ROUTES.CUSTOMERS, icon: Contact, matchPrefix: true },
  { id: 'leads', label: 'Leads', path: ROUTES.LEADS, icon: Target, matchPrefix: true },
  { id: 'sales', label: 'Sales', path: ROUTES.SALES, icon: Briefcase, matchPrefix: true },
  { id: 'tasks', label: 'Tasks', path: ROUTES.TASKS, icon: ClipboardList, matchPrefix: true },
  { id: 'employees', label: 'Employees', path: ROUTES.EMPLOYEES, icon: Users, matchPrefix: true },
  { id: 'reports', label: 'Reports', path: ROUTES.REPORTS, icon: BarChart3, matchPrefix: true },
  { id: 'tables', label: 'Tables & Grace', path: ROUTES.TABLES, icon: Utensils, matchPrefix: true },
  {
    id: 'notifications',
    label: 'Notifications',
    path: ROUTES.NOTIFICATIONS,
    icon: Bell,
  },
  { id: 'settings', label: 'Settings', path: ROUTES.SETTINGS, icon: Settings, matchPrefix: true },
];
