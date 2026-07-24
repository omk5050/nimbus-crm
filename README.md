# Nimbus CRM

A modern, enterprise-style CRM frontend — customers, leads, sales, employees, tasks,
reports, notifications, and settings, in one cohesive app.

This is a **frontend-only** build. Every feature runs entirely on realistic mock data
held in Zustand stores; there is no backend, no database, and no real authentication.
The architecture is deliberately shaped so a real API can be dropped in later without
restructuring the app — see [Backend readiness](#backend-readiness) below.

## Tech stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling, with light/dark theme via CSS variables
- **React Router** for routing, with lazy-loaded route-level code splitting
- **Zustand** for state — one store per feature, not a single global store
- **React Hook Form** + **Zod** for every form and its validation
- **Framer Motion** (`motion/react`) for page/overlay/hover transitions
- **Axios** — wired up as a prepared API layer (`src/services/`), not yet connected

## Getting started

```bash
npm install
npm run dev       # starts the Vite dev server
npm run build      # type-checks (tsc -b) and produces a production build
npm run lint       # eslint
npm run preview    # serve the production build locally
```

There's a demo login gate — any email/password combination on the Login screen will
work, since there's no real auth backend to check against.

## Project structure

```
src/
  assets/            static assets
  components/        the shared design system
    common/            Popover, Tabs, Accordion, FilterDropdown, EmptyState, Skeleton...
    layout/            Sidebar, Topbar, Breadcrumbs, MobileDrawer, notification/user menus
    layouts/           DashboardLayout, AuthLayout (the two page shells)
    forms/             one RHF+Zod form component per entity (CustomerForm, DealForm...)
    tables/            DataTable — search, sort, pagination, column visibility, in one place
    cards/             Card, StatCard, ChartCard
    charts/            hand-built SVG/CSS charts (no charting library in the approved stack)
    modals/            Modal, Drawer, ConfirmDialog
    buttons/, inputs/, badges/
  pages/             one folder per feature module (see below), each owning its own
                     types-free UI: schemas, sub-components, and route-level pages
  routes/            AppRouter, ProtectedRoute/GuestRoute guards
  store/             one Zustand store per feature — the single source of truth for
                     that feature's data (customers.store.ts, leads.store.ts, ...)
  mock/              seed data for every store
  types/              one *.types.ts per domain
  constants/          labels, tone maps, option lists, and a couple of derived-data hooks
                     (e.g. team.constants.ts derives the sales-rep roster from Employees)
  hooks/              useDisclosure, useOnClickOutside, useMediaQuery, useBreadcrumbs,
                     useThemeSync, useSimulatedLoading
  services/           the prepared (unconnected) API client + endpoint map
  utils/              cn, format, dateRange, sales-domain helpers
```

## Feature modules

| Module | What's there |
|---|---|
| **Dashboard** | Stats, revenue trend, lead-source breakdown, today's tasks, recent activity, notifications preview, recent customers, quick actions |
| **Customers** | Table + profile page with Overview / Timeline / Notes / Files tabs |
| **Leads** | Kanban pipeline + table view, stage stepper, activity timeline, assign owner |
| **Sales** | Deals (pipeline + table), Quotations, Invoices, Payments — quotes convert to invoices, recording a payment can auto-mark an invoice Paid |
| **Employees** | Directory + profile with Attendance and Performance tabs |
| **Tasks** | List / Kanban / Calendar views of the same data, task details in a modal |
| **Reports** | Revenue, Sales, Leads, and Employees reports, each with its own date-range picker, chart, and table — all computed live from the real stores above, not separate mock data |
| **Notifications** | A real notification center (grouped, filterable, mark-as-read) backing both the topbar bell and the dashboard preview |
| **Settings** | Company profile, user roles/access, an editable permission matrix, theme, and preferences |

Every module that references "who owns this" (Customers, Leads, Deals) or "who's
assigned" (Tasks) pulls that roster live from the Employees store — there's no
independently-hardcoded list of names anywhere.

## Backend readiness

Nothing here talks to a real network, but the shape is ready for it:

- **API layer**: `src/services/api.client.ts` and `endpoints.ts` define the Axios
  instance and endpoint map a real integration would use.
- **Auth**: `ProtectedRoute` / `GuestRoute` already gate the router; swapping the mock
  `auth.store.ts` for real session logic doesn't touch routing.
- **Multi-company / RBAC**: Settings' role→permission matrix and per-employee access
  records are real, editable state — just not yet enforced against actual route access.
- **Pagination**: `types/common.types.ts` includes a `PaginatedResult<T>` shape for
  when list endpoints return paged data instead of a full array.

## Known limitations

- Most data resets on page reload — only auth session, theme, sidebar collapse
  state, and preferences persist (the stores using Zustand's `persist` middleware
  against `localStorage`); everything else (customers, leads, deals, tasks, etc.)
  is in-memory only.
- No real-time collaboration — two browser tabs won't see each other's changes.
- Login accepts anything; there's no account system behind it.
