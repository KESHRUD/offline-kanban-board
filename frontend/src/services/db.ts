import { openDB } from 'idb';
import type { IDBPDatabase } from 'idb';
import type { Task } from '../types';

interface KanbanDB {
  tasks: {
    key: string;
    value: Task;
    indexes: { 'by-status': string };
  };
  pendingSync: {
    key: number;
    value: {
      id?: number;
      action: 'create' | 'update' | 'delete';
      taskId?: string;
      data?: Partial<Task>;
      timestamp: number;
    };
  };
}

class IndexedDBService {
  private dbPromise: Promise<IDBPDatabase<KanbanDB>>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  private async initDB(): Promise<IDBPDatabase<KanbanDB>> {
    return openDB<KanbanDB>('kanban-db', 1, {
      upgrade(db) {
        // Tasks store
        if (!db.objectStoreNames.contains('tasks')) {
          const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
          taskStore.createIndex('by-status', 'status');
        }

        // Pending sync store
        if (!db.objectStoreNames.contains('pendingSync')) {
          db.createObjectStore('pendingSync', {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      },
    });
  }

  // Tasks operations
  async getAllTasks(): Promise<Task[]> {
    const db = await this.dbPromise;
    return db.getAll('tasks');
  }

  async getTasksByStatus(status: string): Promise<Task[]> {
    const db = await this.dbPromise;
    return db.getAllFromIndex('tasks', 'by-status', status);
  }

  async getTask(id: string): Promise<Task | undefined> {
    const db = await this.dbPromise;
    return db.get('tasks', id);
  }

  async saveTask(task: Task): Promise<void> {
    const db = await this.dbPromise;
    await db.put('tasks', task);
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction('tasks', 'readwrite');
    await Promise.all(tasks.map((task) => tx.store.put(task)));
    await tx.done;
  }

  async deleteTask(id: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('tasks', id);
  }

  async clearTasks(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear('tasks');
  }

  // Pending sync operations
  async addPendingSync(action: {
    action: 'create' | 'update' | 'delete';
    taskId?: string;
    data?: Partial<Task>;
  }): Promise<void> {
    const db = await this.dbPromise;
    await db.add('pendingSync', {
      ...action,
      timestamp: Date.now(),
    });
  }

  async getPendingSync() {
    const db = await this.dbPromise;
    return db.getAll('pendingSync');
  }

  async clearPendingSync(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear('pendingSync');
  }

  async deletePendingSync(id: number): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('pendingSync', id);
  }
}

export const dbService = new IndexedDBService();
