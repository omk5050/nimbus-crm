import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeFormSchema } from '@/pages/employees/employees.schemas';
import type { EmployeeFormValues } from '@/types/employee.types';
import { TextField } from '@/components/inputs/TextField';
import { Select } from '@/components/inputs/Select';
import { DEPARTMENT_OPTIONS, EMPLOYEE_STATUS_OPTIONS } from '@/constants/employee.constants';

const EMPTY_DEFAULT_VALUES: EmployeeFormValues = {
  name: '',
  email: '',
  phone: '',
  role: '',
  department: 'Sales',
  status: 'active',
  hireDate: '',
};

interface EmployeeFormProps {
  /** Links the <form> to submit buttons rendered outside it (e.g. a Drawer footer) via the HTML `form` attribute. */
  formId: string;
  defaultValues?: EmployeeFormValues;
  onSubmit: (values: EmployeeFormValues) => void;
}

export function EmployeeForm({ formId, defaultValues, onSubmit }: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: defaultValues ?? EMPTY_DEFAULT_VALUES,
  });

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <TextField
        label="Full name"
        placeholder="Jordan Reyes"
        error={errors.name?.message}
        {...register('name')}
      />

      <TextField
        label="Job title"
        placeholder="Account Executive"
        error={errors.role?.message}
        {...register('role')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="Email"
          type="email"
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <TextField
          label="Phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="department"
          control={control}
          render={({ field }) => (
            <Select
              label="Department"
              value={field.value}
              onChange={field.onChange}
              options={DEPARTMENT_OPTIONS}
              error={errors.department?.message}
            />
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              label="Status"
              value={field.value}
              onChange={field.onChange}
              options={EMPLOYEE_STATUS_OPTIONS}
              error={errors.status?.message}
            />
          )}
        />
      </div>

      <TextField
        label="Hire date"
        type="date"
        error={errors.hireDate?.message}
        {...register('hireDate')}
      />
    </form>
  );
}
