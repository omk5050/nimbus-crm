import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/buttons/Button';
import type { Task } from '@/types/task.types';
import { cn } from '@/utils/cn';

interface TaskCalendarViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MAX_VISIBLE_PER_DAY = 3;

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Builds a 6x7 grid of dates covering the given month, including leading/trailing days from adjacent months. */
function buildMonthGrid(monthStart: Date): Date[] {
  const gridStart = new Date(monthStart);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
}

export function TaskCalendarView({ tasks, onTaskClick }: TaskCalendarViewProps) {
  const [monthStart, setMonthStart] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const todayKey = toDateKey(new Date());
  const monthGrid = useMemo(() => buildMonthGrid(monthStart), [monthStart]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of tasks) {
      const list = map.get(task.dueDate) ?? [];
      list.push(task);
      map.set(task.dueDate, list);
    }
    return map;
  }, [tasks]);

  function goToMonth(offset: number) {
    setMonthStart((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex items-center gap-1.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setMonthStart(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}
          >
            Today
          </Button>
          <Button variant="secondary" size="sm" onClick={() => goToMonth(-1)} aria-label="Previous month">
            <ChevronLeft size={14} />
          </Button>
          <Button variant="secondary" size="sm" onClick={() => goToMonth(1)} aria-label="Next month">
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <div className="grid min-w-[640px] grid-cols-7 gap-px bg-border">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="bg-muted/60 px-2 py-1.5 text-center text-xs font-medium text-muted-foreground">
            {label}
          </div>
        ))}

        {monthGrid.map((date) => {
          const dateKey = toDateKey(date);
          const dayTasks = tasksByDate.get(dateKey) ?? [];
          const isCurrentMonth = date.getMonth() === monthStart.getMonth();
          const isToday = dateKey === todayKey;
          const overflowCount = dayTasks.length - MAX_VISIBLE_PER_DAY;

          return (
            <div
              key={dateKey}
              className={cn(
                'flex min-h-[104px] flex-col gap-1 bg-card p-1.5',
                !isCurrentMonth && 'bg-muted/20',
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full text-xs',
                  isToday && 'bg-primary font-semibold text-primary-foreground',
                  !isToday && isCurrentMonth && 'text-foreground',
                  !isToday && !isCurrentMonth && 'text-muted-foreground/50',
                )}
              >
                {date.getDate()}
              </span>

              <div className="flex flex-col gap-1">
                {dayTasks.slice(0, MAX_VISIBLE_PER_DAY).map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => onTaskClick(task.id)}
                    className="flex items-center gap-1 truncate rounded px-1 py-0.5 text-left text-[11px] hover:bg-accent"
                  >
                    <span
                      className={cn(
                        'h-1.5 w-1.5 shrink-0 rounded-full',
                        task.priority === 'high' && 'bg-destructive',
                        task.priority === 'medium' && 'bg-warning',
                        task.priority === 'low' && 'bg-muted-foreground',
                      )}
                    />
                    <span
                      className={cn('truncate', task.status === 'done' && 'text-muted-foreground line-through')}
                    >
                      {task.title}
                    </span>
                  </button>
                ))}
                {overflowCount > 0 && (
                  <span className="px-1 text-[11px] text-muted-foreground">+{overflowCount} more</span>
                )}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-destructive" /> High priority
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-warning" /> Medium
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" /> Low
        </span>
      </div>
    </div>
  );
}
