import { create } from 'zustand';
import type { Task, TaskFormValues, TaskStatus } from '@/types/task.types';
import { MOCK_TASKS } from '@/mock/tasks.mock';

function generateId(): string {
  return `task_${crypto.randomUUID().slice(0, 8)}`;
}

interface TasksState {
  tasks: Task[];

  addTask: (values: TaskFormValues) => Task;
  updateTask: (id: string, values: TaskFormValues) => void;
  deleteTask: (id: string) => void;
  /** Used by the Kanban drag-drop, the list checkbox, and the calendar/detail quick actions. */
  moveStatus: (id: string, status: TaskStatus) => void;
  /** Toggles between 'done' and 'todo' — the quick-complete checkbox used in list/dashboard views. */
  toggleDone: (id: string) => void;
}

export const useTasksStore = create<TasksState>()((set) => ({
  tasks: MOCK_TASKS,

  addTask: (values) => {
    const newTask: Task = {
      id: generateId(),
      title: values.title,
      description: values.description || undefined,
      assignee: values.assignee,
      relatedTo: values.relatedTo || undefined,
      dueDate: values.dueDate,
      priority: values.priority,
      status: values.status,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
    return newTask;
  },

  updateTask: (id, values) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title: values.title,
              description: values.description || undefined,
              assignee: values.assignee,
              relatedTo: values.relatedTo || undefined,
              dueDate: values.dueDate,
              priority: values.priority,
              status: values.status,
            }
          : task,
      ),
    }));
  },

  deleteTask: (id) => {
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
  },

  moveStatus: (id, status) => {
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? { ...task, status } : task)),
    }));
  },

  toggleDone: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status: task.status === 'done' ? 'todo' : 'done' } : task,
      ),
    }));
  },
}));
