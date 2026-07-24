import { BarChart3, Briefcase, CheckCircle2, TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '@/components/cards/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { useEmployeesStore } from '@/store/employees.store';
import type { Employee } from '@/types/employee.types';
import { formatSignedPercent } from '@/utils/format';
import { cn } from '@/utils/cn';

interface PerformanceTabProps {
  employee: Employee;
}

export function PerformanceTab({ employee }: PerformanceTabProps) {
  const metric = useEmployeesStore((state) => state.performanceByEmployeeId[employee.id]);

  if (!metric || employee.status === 'terminated') {
    return <EmptyState icon={BarChart3} title="No performance data" />;
  }

  const isTrendingUp = metric.trend >= 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <BarChart3 size={17} />
          </span>
          <span
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              isTrendingUp ? 'text-success' : 'text-destructive',
            )}
          >
            {isTrendingUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {formatSignedPercent(metric.trend)}
          </span>
        </div>
        <div>
          <p className="text-2xl font-semibold text-card-foreground">{metric.score}</p>
          <p className="text-xs text-muted-foreground">Performance score</p>
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Briefcase size={17} />
        </span>
        <div>
          <p className="text-2xl font-semibold text-card-foreground">{metric.dealsClosed}</p>
          <p className="text-xs text-muted-foreground">
            {employee.department === 'Sales' ? 'Deals closed' : 'Deals closed (n/a)'}
          </p>
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <CheckCircle2 size={17} />
        </span>
        <div>
          <p className="text-2xl font-semibold text-card-foreground">{metric.tasksCompleted}</p>
          <p className="text-xs text-muted-foreground">Tasks completed</p>
        </div>
      </Card>
    </div>
  );
}
