import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, BarChart3, Building2, CalendarCheck, Mail, Pencil, Phone, Trash2, UserRound } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { Button } from '@/components/buttons/Button';
import { IconButton } from '@/components/buttons/IconButton';
import { Card, CardHeader } from '@/components/cards/Card';
import { Tabs } from '@/components/common/Tabs';
import type { TabItem } from '@/components/common/Tabs';
import { EmptyState } from '@/components/common/EmptyState';
import { PageLoader } from '@/components/common/PageLoader';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { EmployeeFormDrawer } from '@/pages/employees/components/EmployeeFormDrawer';
import { AttendanceTab } from '@/pages/employees/components/tabs/AttendanceTab';
import { PerformanceTab } from '@/pages/employees/components/tabs/PerformanceTab';
import { useEmployee, useEmployeesStore } from '@/store/employees.store';
import { toast } from '@/store/toast.store';
import { ROUTES } from '@/constants/routes.constants';
import { EMPLOYEE_STATUS_LABEL, EMPLOYEE_STATUS_TONE } from '@/constants/employee.constants';
import { formatDate } from '@/utils/format';

type DetailTab = 'profile' | 'attendance' | 'performance';

const TABS: TabItem<DetailTab>[] = [
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
];

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const employee = useEmployee(id);
  const isLoading = useEmployeesStore((state) => state.isLoading);
  const fetchEmployees = useEmployeesStore((state) => state.fetchEmployees);
  const fetchEmployeeDetails = useEmployeesStore((state) => state.fetchEmployeeDetails);
  const deleteEmployee = useEmployeesStore((state) => state.deleteEmployee);

  const [activeTab, setActiveTab] = useState<DetailTab>('profile');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [detailsFetched, setDetailsFetched] = useState(false);

  // Ensure employees list is loaded (covers direct URL navigation / page refresh)
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Fetch attendance and performance once the employee id is known
  useEffect(() => {
    if (id && !detailsFetched) {
      fetchEmployeeDetails(id).then(() => setDetailsFetched(true));
    }
  }, [id, fetchEmployeeDetails, detailsFetched]);

  if (!employee) {
    if (isLoading) return <PageLoader />;
    return (
      <EmptyState
        icon={UserRound}
        title="Employee not found"
        description="This employee may have been removed."
        action={
          <Button variant="secondary" onClick={() => navigate(ROUTES.EMPLOYEES)}>
            Back to employees
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <IconButton
        icon={<ArrowLeft size={16} />}
        label="Back to employees"
        onClick={() => navigate(ROUTES.EMPLOYEES)}
        className="-ml-2"
      />

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-center gap-4">
          <Avatar name={employee.name} size="lg" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">{employee.name}</h1>
              <StatusBadge
                label={EMPLOYEE_STATUS_LABEL[employee.status]}
                tone={EMPLOYEE_STATUS_TONE[employee.status]}
              />
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {employee.role} · {employee.department}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
            <Pencil size={15} />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 size={15} />
            Delete
          </Button>
        </div>
      </div>

      <Tabs tabs={TABS} value={activeTab} onChange={setActiveTab} />

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="flex flex-col gap-4">
            <CardHeader title="Contact information" />
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <Mail size={14} />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="mt-0.5 truncate text-sm font-medium text-card-foreground">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <Phone size={14} />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="mt-0.5 truncate text-sm font-medium text-card-foreground">{employee.phone}</p>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col gap-4">
            <CardHeader title="Department" />
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <Building2 size={14} />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Department</p>
                <p className="mt-0.5 text-sm font-medium text-card-foreground">{employee.department}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div>
                <p className="text-xs text-muted-foreground">Job title</p>
                <p className="mt-0.5 text-sm font-semibold text-card-foreground">{employee.role}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Hire date</p>
                <p className="mt-0.5 text-sm font-semibold text-card-foreground">
                  {formatDate(employee.hireDate)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'attendance' && <AttendanceTab employeeId={employee.id} />}
      {activeTab === 'performance' && <PerformanceTab employee={employee} />}

      <EmployeeFormDrawer isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} employee={employee} />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete this employee?"
        description={`This removes ${employee.name} (${employee.role}) from your workspace. This can't be undone.`}
        confirmLabel="Delete employee"
        tone="danger"
        onConfirm={async () => {
          try {
            await deleteEmployee(employee.id);
            toast.success('Employee deleted', { description: `${employee.name} was removed.` });
            navigate(ROUTES.EMPLOYEES);
          } catch (err: any) {
            toast.error('Failed to delete employee', { description: err.response?.data?.message || 'Delete operation failed.' });
          } finally {
            setIsDeleteOpen(false);
          }
        }}
      />
    </div>
  );
}
