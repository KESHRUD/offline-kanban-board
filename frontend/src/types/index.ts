export type Priority = 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: string;
  tags: string[];
  priority: Priority;
  createdAt: number;
  dueDate?: number;
  subtasks: Subtask[];
  comments: Comment[];
  diagramCode?: string;
  userId?: string;
}

export interface Column {
  id: string;
  title: string;
  order: number;
  userId?: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: number;
  nextReview?: number;
  interval?: number;
  easeFactor?: number;
  streak?: number;
}

export interface Deck {
  id: string;
  title: string;
  subject: string;
  cards: Flashcard[];
  coverUrl?: string;
  userId?: string;
}

export interface DailyGoal {
  id?: string;
  target: number;
  progress: number;
  lastUpdated: number;
  streak: number;
  userId?: string;
}

export type ThemeMode = 'pro' | 'galilee';
export type ViewMode = 'board' | 'flashcards';
export type Language = 'fr' | 'en';

export interface DragItem {
  id: string;
  columnId: string;
}

export type Speciality = 'info' | 'energy' | 'telecom' | 'instrumentation' | 'macs' | 'prepa';

export interface User {
  username: string;
  name: string;
  role: 'student' | 'engineer' | 'admin';
  avatarUrl?: string;
  provider?: 'google' | 'local';
  speciality?: Speciality;
  email?: string;
  xp: number;
  level: number;
  rank: string;
}

export interface AuthContextType {
  isLoading: boolean;
  user: User | null;
  login: (username: string, provider?: 'google' | 'local', speciality?: Speciality) => Promise<void>;
  register: (data: { username: string; email: string; speciality: Speciality }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUserXp: (amount: number) => Promise<void>;
}

export type SoundType = 'hover' | 'click' | 'success' | 'error' | 'open' | 'flip' | 'levelup';

export interface Board {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  columnId?: string;
  tags?: string[];
  priority?: Priority;
  dueDate?: number;
  subtasks?: Subtask[];
  diagramCode?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  columnId?: string;
  tags?: string[];
  priority?: Priority;
  dueDate?: number;
  subtasks?: Subtask[];
  diagramCode?: string;
}
