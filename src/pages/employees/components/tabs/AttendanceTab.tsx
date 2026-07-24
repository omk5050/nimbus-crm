import { CalendarCheck } from 'lucide-react';
import { Card, CardHeader } from '@/components/cards/Card';
import { Button } from '@/components/buttons/Button';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { useEmployeesStore } from '@/store/employees.store';
import { ATTENDANCE_STATUS_LABEL, ATTENDANCE_STATUS_TONE } from '@/constants/employee.constants';
import { formatDate } from '@/utils/format';

interface AttendanceTabProps {
  employeeId: string;
}

const TODAY_ISO = new Date().toISOString().slice(0, 10);

export function AttendanceTab({ employeeId }: AttendanceTabProps) {
  const records = useEmployeesStore((state) => state.attendanceByEmployeeId[employeeId] ?? []);
  const toggleTodayAttendance = useEmployeesStore((state) => state.toggleTodayAttendance);

  const todayRecord = records.find((record) => record.date === TODAY_ISO);
  const presentCount = records.filter((record) => record.status === 'present').length;
  const attendanceRate = records.length > 0 ? Math.round((presentCount / records.length) * 100) : 0;

  if (records.length === 0) {
    return <EmptyState icon={CalendarCheck} title="No attendance history" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-card-foreground">Today</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {todayRecord
              ? `Marked ${ATTENDANCE_STATUS_LABEL[todayRecord.status]}${todayRecord.checkIn ? ` · in at ${todayRecord.checkIn}` : ''}`
              : 'Not yet recorded'}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => toggleTodayAttendance(employeeId)}>
          {todayRecord?.status === 'present' ? 'Mark absent' : 'Mark present'}
        </Button>
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-card-foreground">Attendance rate</p>
          <p className="text-xs text-muted-foreground">Last {records.length} days</p>
        </div>
        <p className="text-2xl font-semibold text-card-foreground">{attendanceRate}%</p>
      </Card>

      <Card noPadding>
        <div className="p-5 pb-0">
          <CardHeader title="Recent history" />
        </div>
        <ul className="divide-y divide-border">
          {records.map((record) => (
            <li key={record.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <span className="text-sm text-card-foreground">{formatDate(record.date)}</span>
              <div className="flex items-center gap-3">
                {(record.checkIn || record.checkOut) && (
                  <span className="text-xs text-muted-foreground">
                    {record.checkIn ?? '—'} – {record.checkOut ?? '—'}
                  </span>
                )}
                <StatusBadge
                  label={ATTENDANCE_STATUS_LABEL[record.status]}
                  tone={ATTENDANCE_STATUS_TONE[record.status]}
                />
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
