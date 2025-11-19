import type { Task } from '../types';

export interface Column {
  id: string;
  title: string;
  status: Task['status'];
}

export const COLUMNS: Column[] = [
  {
    id: 'todo',
    title: '📝 To Do',
    status: 'todo',
  },
  {
    id: 'in-progress',
    title: '🔄 In Progress',
    status: 'in-progress',
  },
  {
    id: 'done',
    title: '✅ Done',
    status: 'done',
  },
];
