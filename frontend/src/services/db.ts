import type { Task } from '../types';
import { db } from './storage';

interface PendingSync {
  action: 'create' | 'update' | 'delete';
  taskId?: string;
  data?: Partial<Task>;
}

export const dbService = {
  async getAllTasks(): Promise<Task[]> {
    return db.getAllTasks();
  },

  async saveTask(task: Task): Promise<void> {
    return db.saveTask(task);
  },

  async saveTasks(tasks: Task[]): Promise<void> {
    for (const task of tasks) {
      await db.saveTask(task);
    }
  },

  async deleteTask(id: string): Promise<void> {
    return db.deleteTask(id);
  },

  async addPendingSync(_sync: PendingSync): Promise<void> {
    // Queue sync operation for when back online
    // For now, just store in localStorage
    const pending = JSON.parse(localStorage.getItem('pendingSync') || '[]');
    pending.push(_sync);
    localStorage.setItem('pendingSync', JSON.stringify(pending));
  },

  async getPendingSync(): Promise<PendingSync[]> {
    return JSON.parse(localStorage.getItem('pendingSync') || '[]');
  },

  async clearPendingSync(): Promise<void> {
    localStorage.removeItem('pendingSync');
  },
};
