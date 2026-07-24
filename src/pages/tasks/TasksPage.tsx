import TasksHomePage from '@/pages/tasks/components/TasksHomePage';

/**
 * Mounted at `/tasks` by AppRouter. Unlike Customers/Leads/Sales/Employees,
 * Tasks has no separate detail route — List/Board/Calendar are a client-side
 * view toggle (like the Leads Kanban/List toggle) and task details open in a
 * modal — so there's no nested `<Routes>` here, just a thin re-export.
 */
export default function TasksPage() {
  return <TasksHomePage />;
}
