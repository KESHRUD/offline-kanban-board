export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  order: number;
}

export type Speciality = 'info' | 'energy' | 'telecom' | 'instrumentation' | 'macs' | 'prepa';

export interface User {
  id?: string;
  username: string;
  email?: string;
  name: string;
  role: 'student' | 'engineer' | 'admin';
  avatarUrl?: string;
  provider?: 'google' | 'local';
  speciality?: Speciality;
  xp: number;
  level: number;
  rank: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
}

export interface CreateColumnDTO {
  title: string;
  order?: number;
}
