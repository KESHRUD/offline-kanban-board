import type { Task, CreateTaskDTO, UpdateTaskDTO } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }

      if (response.status === 204) {
        return { data: null as T };
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    const response = await this.request<Task[]>('/api/tasks');
    return response.data;
  }

  async getTask(id: string): Promise<Task> {
    const response = await this.request<Task>(`/api/tasks/${id}`);
    return response.data;
  }

  async createTask(task: CreateTaskDTO): Promise<Task> {
    const response = await this.request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
    return response.data;
  }

  async updateTask(id: string, task: UpdateTaskDTO): Promise<Task> {
    const response = await this.request<Task>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
    return response.data;
  }

  async deleteTask(id: string): Promise<void> {
    await this.request<void>(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Boards
  async getBoards() {
    const response = await this.request('/api/boards');
    return response.data;
  }

  async createBoard(name: string) {
    const response = await this.request('/api/boards', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    return response.data;
  }
}

export const apiService = new ApiService();
