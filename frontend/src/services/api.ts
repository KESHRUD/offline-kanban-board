import type { Task } from '../types';

const API_URL = '/api/sessions';

export const apiService = {
  getAllSessions: async (): Promise<Task[]> => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch sessions');
      return await response.json();
    } catch (error) {
      console.error('API Error (Offline?):', error);
      // Fallback to offline storage logic or return empty
      return [];
    }
  },

  createSession: async (session: Partial<Task>): Promise<Task> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });
    if (!response.ok) throw new Error('Failed to create session');
    return await response.json();
  },

  updateSession: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update session');
    return await response.json();
  },

  deleteSession: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete session');
  }
};