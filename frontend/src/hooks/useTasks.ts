import { useState, useEffect } from 'react';
import type { Task } from '../types';
import { apiService } from '../services/api';
import { dbService } from '../services/db';
import { useOnlineStatus } from './useOnlineStatus';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isOnline) {
        // Fetch from API
        const tasksFromApi = await apiService.getTasks();
        setTasks(tasksFromApi);
        // Save to IndexedDB
        await dbService.saveTasks(tasksFromApi);
      } else {
        // Load from IndexedDB
        const tasksFromDb = await dbService.getAllTasks();
        setTasks(tasksFromDb);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
      // Fallback to IndexedDB on error
      const tasksFromDb = await dbService.getAllTasks();
      setTasks(tasksFromDb);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (isOnline) {
        const newTask = await apiService.createTask(taskData);
        setTasks((prev) => [...prev, newTask]);
        await dbService.saveTask(newTask);
      } else {
        // Create offline task
        const tempTask: Task = {
          id: `temp-${Date.now()}`,
          ...taskData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setTasks((prev) => [...prev, tempTask]);
        await dbService.saveTask(tempTask);
        await dbService.addPendingSync({ action: 'create', data: tempTask });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      if (isOnline) {
        const updatedTask = await apiService.updateTask(id, updates);
        setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
        await dbService.saveTask(updatedTask);
      } else {
        const updatedTask = {
          ...tasks.find((t) => t.id === id)!,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
        await dbService.saveTask(updatedTask);
        await dbService.addPendingSync({ action: 'update', taskId: id, data: updates });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      if (isOnline) {
        await apiService.deleteTask(id);
        setTasks((prev) => prev.filter((t) => t.id !== id));
        await dbService.deleteTask(id);
      } else {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        await dbService.deleteTask(id);
        await dbService.addPendingSync({ action: 'delete', taskId: id });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks: loadTasks,
  };
};
