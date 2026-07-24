import { useMemo } from 'react';
import { Link } from 'react-router';
import { Card, CardHeader } from '@/components/cards/Card';
import { Checkbox } from '@/components/inputs/Checkbox';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { ROUTES } from '@/constants/routes.constants';
import { TASK_PRIORITY_LABEL, TASK_PRIORITY_TONE } from '@/constants/task.constants';
import { useTasksStore } from '@/store/tasks.store';
import { cn } from '@/utils/cn';
import { CheckCircle2 } from 'lucide-react';

const TODAY_ISO = new Date().toISOString().slice(0, 10);

/**
 * Shows tasks due today, pulled live from the real Tasks store (Phase 8) —
 * toggling here uses the same `toggleDone` action the Tasks module itself
 * uses, so checking a box here is reflected there too, not just visually.
 */
export function TodaysTasks() {
  const allTasks = useTasksStore((state) => state.tasks);
  const toggleDone = useTasksStore((state) => state.toggleDone);

  const todaysTasks = useMemo(
    () => allTasks.filter((task) => task.dueDate === TODAY_ISO),
    [allTasks],
  );
  const remaining = todaysTasks.filter((task) => task.status !== 'done').length;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        title="Today's tasks"
        description={`${remaining} remaining`}
        action={
          <Link to={ROUTES.TASKS} className="text-xs font-medium text-primary hover:underline">
            View all
          </Link>
        }
      />

      {todaysTasks.length === 0 ? (
        <EmptyState icon={CheckCircle2} title="Nothing due today" />
      ) : (
        <ul className="flex flex-col gap-1">
          {todaysTasks.map((task) => {
            const isDone = task.status === 'done';
            return (
              <li key={task.id} className="flex items-start gap-3 rounded-md px-1 py-2 hover:bg-accent/40">
                <Checkbox
                  checked={isDone}
                  onChange={() => toggleDone(task.id)}
                  className="mt-0.5"
                  aria-label={`Mark "${task.title}" as ${isDone ? 'not done' : 'done'}`}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      'text-sm font-medium text-card-foreground',
                      isDone && 'text-muted-foreground line-through',
                    )}
                  >
                    {task.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {task.relatedTo ?? task.assignee}
                  </p>
                </div>
                <StatusBadge label={TASK_PRIORITY_LABEL[task.priority]} tone={TASK_PRIORITY_TONE[task.priority]} />
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
