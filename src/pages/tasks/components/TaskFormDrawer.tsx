import { useState } from 'react';
import { Drawer } from '@/components/modals/Drawer';
import { Button } from '@/components/buttons/Button';
import { TaskForm } from '@/components/forms/TaskForm';
import { useTasksStore } from '@/store/tasks.store';
import { toast } from '@/store/toast.store';
import type { Task, TaskFormValues } from '@/types/task.types';

const FORM_ID = 'task-form';

interface TaskFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  onCreated?: (task: Task) => void;
}

function toFormValues(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description ?? '',
    assignee: task.assignee,
    relatedTo: task.relatedTo ?? '',
    dueDate: task.dueDate,
    priority: task.priority,
    status: task.status,
  };
}

export function TaskFormDrawer({ isOpen, onClose, task, onCreated }: TaskFormDrawerProps) {
  const addTask = useTasksStore((state) => state.addTask);
  const updateTask = useTasksStore((state) => state.updateTask);
  const isEditMode = Boolean(task);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: TaskFormValues) {
    setIsSubmitting(true);
    try {
      if (task) {
        await updateTask(task.id, values);
        toast.success('Task updated', { description: `"${values.title}" was saved.` });
      } else {
        const created = await addTask(values);
        toast.success('Task added', { description: `"${created.title}" was added to your tasks.` });
        onCreated?.(created);
      }
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save task';
      toast.error('Error saving task', { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit task' : 'Add task'}
      description={isEditMode ? "Update this task's details." : 'Create a new task.'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} isLoading={isSubmitting}>
            {isEditMode ? 'Save changes' : 'Add task'}
          </Button>
        </>
      }
    >
      <TaskForm
        key={task?.id ?? 'new'}
        formId={FORM_ID}
        defaultValues={task ? toFormValues(task) : undefined}
        onSubmit={handleSubmit}
      />
    </Drawer>
  );
}
