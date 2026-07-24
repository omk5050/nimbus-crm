import { useState } from 'react';
import { Drawer } from '@/components/modals/Drawer';
import { Button } from '@/components/buttons/Button';
import { EmployeeForm } from '@/components/forms/EmployeeForm';
import { useEmployeesStore } from '@/store/employees.store';
import { toast } from '@/store/toast.store';
import type { Employee, EmployeeFormValues } from '@/types/employee.types';

const FORM_ID = 'employee-form';

interface EmployeeFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee;
  onCreated?: (employee: Employee) => void;
}

function toFormValues(employee: Employee): EmployeeFormValues {
  return {
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    role: employee.role,
    department: employee.department,
    status: employee.status,
    hireDate: employee.hireDate,
  };
}

export function EmployeeFormDrawer({ isOpen, onClose, employee, onCreated }: EmployeeFormDrawerProps) {
  const addEmployee = useEmployeesStore((state) => state.addEmployee);
  const updateEmployee = useEmployeesStore((state) => state.updateEmployee);
  const isEditMode = Boolean(employee);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: EmployeeFormValues) {
    setIsSubmitting(true);
    try {
      if (employee) {
        await updateEmployee(employee.id, values);
        toast.success('Employee updated', { description: `${values.name}'s profile was saved.` });
      } else {
        const created = await addEmployee(values);
        toast.success('Employee added', { description: `${created.name} joined ${created.department}.` });
        onCreated?.(created);
      }
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save employee';
      toast.error('Error saving employee', { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit employee' : 'Add employee'}
      description={isEditMode ? "Update this employee's details." : 'Add a new team member.'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} isLoading={isSubmitting}>
            {isEditMode ? 'Save changes' : 'Add employee'}
          </Button>
        </>
      }
    >
      <EmployeeForm
        key={employee?.id ?? 'new'}
        formId={FORM_ID}
        defaultValues={employee ? toFormValues(employee) : undefined}
        onSubmit={handleSubmit}
      />
    </Drawer>
  );
}
