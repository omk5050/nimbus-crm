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

  function handleSubmit(values: EmployeeFormValues) {
    if (employee) {
      updateEmployee(employee.id, values);
      toast.success('Employee updated', { description: `${values.name}'s profile was saved.` });
    } else {
      const created = addEmployee(values);
      toast.success('Employee added', { description: `${created.name} joined ${created.department}.` });
      onCreated?.(created);
    }
    onClose();
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
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID}>
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
