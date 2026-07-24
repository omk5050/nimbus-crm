import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskFormSchema } from '@/pages/tasks/tasks.schemas';
import type { TaskFormValues } from '@/types/task.types';
import { TextField } from '@/components/inputs/TextField';
import { Textarea } from '@/components/inputs/Textarea';
import { Select } from '@/components/inputs/Select';
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from '@/constants/task.constants';
import { useActiveEmployeeOptions } from '@/constants/team.constants';

const EMPTY_DEFAULT_VALUES: TaskFormValues = {
  title: '',
  description: '',
  assignee: '',
  relatedTo: '',
  dueDate: '',
  priority: 'medium',
  status: 'todo',
};

interface TaskFormProps {
  /** Links the <form> to submit buttons rendered outside it (e.g. a Drawer footer) via the HTML `form` attribute. */
  formId: string;
  defaultValues?: TaskFormValues;
  onSubmit: (values: TaskFormValues) => void;
}

export function TaskForm({ formId, defaultValues, onSubmit }: TaskFormProps) {
  const assigneeOptions = useActiveEmployeeOptions();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: defaultValues ?? { ...EMPTY_DEFAULT_VALUES, assignee: assigneeOptions[0]?.value ?? '' },
  });

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <TextField
        label="Title"
        placeholder="Follow up call with…"
        error={errors.title?.message}
        {...register('title')}
      />

      <Textarea
        label="Description"
        rows={3}
        placeholder="Add any context or next steps…"
        hint="Optional"
        {...register('description')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="assignee"
          control={control}
          render={({ field }) => (
            <Select
              label="Assignee"
              value={field.value || null}
              onChange={field.onChange}
              options={assigneeOptions}
              placeholder="Select an assignee…"
              error={errors.assignee?.message}
            />
          )}
        />
        <TextField
          label="Related to"
          placeholder="Company or account name"
          hint="Optional"
          {...register('relatedTo')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TextField
          label="Due date"
          type="date"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <Select
              label="Priority"
              value={field.value}
              onChange={field.onChange}
              options={TASK_PRIORITY_OPTIONS}
              error={errors.priority?.message}
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
              options={TASK_STATUS_OPTIONS}
              error={errors.status?.message}
            />
          )}
        />
      </div>
    </form>
  );
}
