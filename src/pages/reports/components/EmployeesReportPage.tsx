import { useMemo, useState } from 'react';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { Award, TrendingUp, UserCheck, Users } from 'lucide-react';
import { StatCard } from '@/components/cards/StatCard';
import { ChartCard } from '@/components/cards/ChartCard';
import { DataTable } from '@/components/tables/DataTable';
import type { DataTableColumn } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { Avatar } from '@/components/common/Avatar';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import { CategoryBarChart } from '@/components/charts/CategoryBarChart';
import { useEmployeesStore } from '@/store/employees.store';
import {
  DEPARTMENT_OPTIONS,
  EMPLOYEE_STATUS_LABEL,
  EMPLOYEE_STATUS_TONE,
} from '@/constants/employee.constants';
import type { Department, Employee } from '@/types/employee.types';
import { resolveDateRangePreset, isWithinDateRange } from '@/utils/dateRange';
import { formatDate } from '@/utils/format';

export default function EmployeesReportPage() {
  const isLoading = useSimulatedLoading();
  const employees = useEmployeesStore((state) => state.employees);
  const performanceByEmployeeId = useEmployeesStore((state) => state.performanceByEmployeeId);
  const [range, setRange] = useState(() => resolveDateRangePreset('allTime'));
  const [departmentFilter, setDepartmentFilter] = useState<Department[]>([]);

  const hiredInRange = useMemo(
    () => employees.filter((employee) => isWithinDateRange(employee.hireDate, range)),
    [employees, range],
  );

  const filteredEmployees = useMemo(
    () =>
      departmentFilter.length === 0
        ? hiredInRange
        : hiredInRange.filter((employee) => departmentFilter.includes(employee.department)),
    [hiredInRange, departmentFilter],
  );

  const activeCount = hiredInRange.filter((employee) => employee.status === 'active').length;
  const scores = hiredInRange
    .map((employee) => performanceByEmployeeId[employee.id]?.score)
    .filter((score): score is number => typeof score === 'number' && score > 0);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
  const topScore = scores.length > 0 ? Math.max(...scores) : 0;

  const departmentBreakdown = useMemo(() => {
    const counts = new Map<Department, number>();
    for (const employee of hiredInRange) counts.set(employee.department, (counts.get(employee.department) ?? 0) + 1);
    return Array.from(counts, ([department, count]) => ({ label: department, value: count }));
  }, [hiredInRange]);

  const columns: DataTableColumn<Employee>[] = [
    {
      id: 'name',
      header: 'Employee',
      hideable: false,
      sortValue: (row) => row.name,
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{row.name}</p>
            <p className="truncate text-xs text-muted-foreground">{row.role}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'department',
      header: 'Department',
      sortValue: (row) => row.department,
      cell: (row) => row.department,
    },
    {
      id: 'status',
      header: 'Status',
      sortValue: (row) => row.status,
      cell: (row) => (
        <StatusBadge label={EMPLOYEE_STATUS_LABEL[row.status]} tone={EMPLOYEE_STATUS_TONE[row.status]} />
      ),
    },
    {
      id: 'score',
      header: 'Performance',
      align: 'right',
      sortValue: (row) => performanceByEmployeeId[row.id]?.score ?? 0,
      cell: (row) => performanceByEmployeeId[row.id]?.score ?? '—',
    },
    {
      id: 'hireDate',
      header: 'Hire date',
      align: 'right',
      sortValue: (row) => row.hireDate,
      cell: (row) => formatDate(row.hireDate),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <DateRangePicker value={range} onChange={setRange} defaultPreset="allTime" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Headcount" value={String(hiredInRange.length)} icon={Users} />
        <StatCard label="Active" value={String(activeCount)} icon={UserCheck} />
        <StatCard label="Avg performance" value={String(avgScore)} icon={TrendingUp} />
        <StatCard label="Top score" value={String(topScore)} icon={Award} />
      </div>

      <ChartCard title="Headcount by department" description="Employees hired within the selected range">
        <CategoryBarChart data={departmentBreakdown} />
      </ChartCard>

      <DataTable
        isLoading={isLoading}
        data={filteredEmployees}
        columns={columns}
        getRowId={(row) => row.id}
        getSearchableText={(row) => `${row.name} ${row.role} ${row.department}`}
        searchPlaceholder="Search employees…"
        pageSize={8}
        emptyState={{ title: 'No employees in this range', description: 'Try widening the date range or clearing a filter.' }}
        toolbarExtra={
          <FilterDropdown
            label="Department"
            options={DEPARTMENT_OPTIONS}
            selected={departmentFilter}
            onChange={setDepartmentFilter}
          />
        }
      />
    </div>
  );
}
