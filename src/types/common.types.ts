/** Branded-ish alias so IDs read clearly in signatures without being `string` everywhere. */
export type EntityId = string;

/** Shared shape for anything rendered as a colored status pill (leads, tasks, invoices…). */
export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface SelectOption<T extends string = string> {
  label: string;
  value: T;
}

/** Generic wrapper future paginated API endpoints will return. Unused until Phase 4+. */
export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

/** Breadcrumb trail entry consumed by <Breadcrumbs />. */
export interface BreadcrumbItem {
  label: string;
  path?: string;
}
