import { useEffect, useMemo, useState } from 'react';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { useSearchParams } from 'react-router';
import { Plus, Trash2, Pencil, LayoutGrid, List as ListIcon, CalendarDays } from 'lucide-react';
import { DataTable } from '@/components/tables/DataTable';
import type { DataTableColumn } from '@/components/tables/DataTable';
import { Button } from '@/components/buttons/Button';
import { Avatar } from '@/components/common/Avatar';
import { Checkbox } from '@/components/inputs/Checkbox';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { TaskFormDrawer } from '@/pages/tasks/components/TaskFormDrawer';
import { TaskDetailsModal } from '@/pages/tasks/components/TaskDetailsModal';
import { TaskKanbanBoard } from '@/pages/tasks/components/kanban/TaskKanbanBoard';
import { TaskCalendarView } from '@/pages/tasks/components/TaskCalendarView';
import { useTasksStore } from '@/store/tasks.store';
import { toast } from '@/store/toast.store';
import {
  TASK_PRIORITY_LABEL,
  TASK_PRIORITY_OPTIONS,
  TASK_PRIORITY_TONE,
  TASK_STATUS_LABEL,
  TASK_STATUS_OPTIONS,
  TASK_STATUS_TONE,
} from '@/constants/task.constants';
import type { Task, TaskPriority, TaskStatus } from '@/types/task.types';
import { formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

type ViewMode = 'list' | 'board' | 'calendar';

export default function TasksHomePage() {
  const isLoading = useSimulatedLoading();
  const tasks = useTasksStore((state) => state.tasks);
  const deleteTask = useTasksStore((state) => state.deleteTask);
  const toggleDone = useTasksStore((state) => state.toggleDone);
  const [searchParams, setSearchParams] = useSearchParams();

  const [view, setView] = useState<ViewMode>('board');
  const [statusFilter, setStatusFilter] = useState<TaskStatus[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority[]>([]);
  const [drawerTask, setDrawerTask] = useState<Task | 'new' | null>(null);
  const [detailsTask, setDetailsTask] = useState<Task | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Task | null>(null);

  // Lets the Dashboard's "Schedule Meeting" quick action deep-link straight into this drawer.
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setDrawerTask('new');
      setSearchParams((params) => {
        params.delete('new');
        return params;
      });
    }
  }, [searchParams, setSearchParams]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(task.status);
      const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(task.priority);
      return matchesStatus && matchesPriority;
    });
  }, [tasks, statusFilter, priorityFilter]);

  function openDetails(taskId: string) {
    const task = tasks.find((entry) => entry.id === taskId);
    if (task) setDetailsTask(task);
  }

  const columns: DataTableColumn<Task>[] = [
    {
      id: 'title',
      header: 'Task',
      hideable: false,
      sortValue: (row) => row.title,
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <Checkbox
            checked={row.status === 'done'}
            onChange={(event) => {
              event.stopPropagation();
              toggleDone(row.id);
            }}
            onClick={(event) => event.stopPropagation()}
          />
          <div className="min-w-0">
            <p className={cn('truncate font-medium text-foreground', row.status === 'done' && 'text-muted-foreground line-through')}>
              {row.title}
            </p>
            {row.relatedTo && <p className="truncate text-xs text-muted-foreground">{row.relatedTo}</p>}
          </div>
        </div>
      ),
    },
    {
      id: 'assignee',
      header: 'Assignee',
      sortValue: (row) => row.assignee,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.assignee} size="xs" />
          <span className="truncate">{row.assignee}</span>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      sortValue: (row) => row.status,
      cell: (row) => <StatusBadge label={TASK_STATUS_LABEL[row.status]} tone={TASK_STATUS_TONE[row.status]} />,
    },
    {
      id: 'priority',
      header: 'Priority',
      sortValue: (row) => row.priority,
      cell: (row) => (
        <StatusBadge label={TASK_PRIORITY_LABEL[row.priority]} tone={TASK_PRIORITY_TONE[row.priority]} />
      ),
    },
    {
      id: 'dueDate',
      header: 'Due date',
      align: 'right',
      sortValue: (row) => row.dueDate,
      cell: (row) => formatDate(row.dueDate),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {tasks.length} task{tasks.length === 1 ? '' : 's'} ·{' '}
            {tasks.filter((t) => t.status !== 'done').length} open
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border p-0.5">
            <button
              type="button"
              onClick={() => setView('list')}
              className={cn(
                'flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-colors',
                view === 'list' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <ListIcon size={14} />
              List
            </button>
            <button
              type="button"
              onClick={() => setView('board')}
              className={cn(
                'flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-colors',
                view === 'board' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <LayoutGrid size={14} />
              Board
            </button>
            <button
              type="button"
              onClick={() => setView('calendar')}
              className={cn(
                'flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-colors',
                view === 'calendar' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <CalendarDays size={14} />
              Calendar
            </button>
          </div>
          <Button onClick={() => setDrawerTask('new')}>
            <Plus size={16} />
            Add task
          </Button>
        </div>
      </div>

      {view !== 'calendar' && (
        <div className="flex flex-wrap gap-2">
          <FilterDropdown
            label="Status"
            options={TASK_STATUS_OPTIONS}
            selected={statusFilter}
            onChange={setStatusFilter}
          />
          <FilterDropdown
            label="Priority"
            options={TASK_PRIORITY_OPTIONS}
            selected={priorityFilter}
            onChange={setPriorityFilter}
          />
        </div>
      )}

      {view === 'list' && (
        <DataTable
          isLoading={isLoading}
          data={filteredTasks}
          columns={columns}
          getRowId={(row) => row.id}
          getSearchableText={(row) => `${row.title} ${row.assignee} ${row.relatedTo ?? ''}`}
          searchPlaceholder="Search tasks…"
          onRowClick={(row) => setDetailsTask(row)}
          pageSize={8}
          emptyState={{ title: 'No tasks match your filters', description: 'Try clearing a filter or adding a new task.' }}
          rowActions={(row) => [
            { label: 'Edit', icon: Pencil, onSelect: () => setDrawerTask(row) },
            { label: 'Delete', icon: Trash2, tone: 'danger', onSelect: () => setPendingDelete(row) },
          ]}
        />
      )}

      {view === 'board' && <TaskKanbanBoard tasks={filteredTasks} onCardClick={openDetails} />}

      {view === 'calendar' && <TaskCalendarView tasks={filteredTasks} onTaskClick={openDetails} />}

      <TaskFormDrawer
        isOpen={drawerTask !== null}
        onClose={() => setDrawerTask(null)}
        task={drawerTask === 'new' || drawerTask === null ? undefined : drawerTask}
      />

      <TaskDetailsModal
        task={detailsTask}
        onClose={() => setDetailsTask(null)}
        onEdit={(task) => {
          setDetailsTask(null);
          setDrawerTask(task);
        }}
        onDelete={(task) => setPendingDelete(task)}
      />

      <ConfirmDialog
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Delete this task?"
        description={pendingDelete ? `This removes "${pendingDelete.title}". This can't be undone.` : undefined}
        confirmLabel="Delete task"
        tone="danger"
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteTask(pendingDelete.id);
          toast.success('Task deleted', { description: `"${pendingDelete.title}" was removed.` });
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
