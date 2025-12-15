import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskCard } from '../../components/TaskCard';
import type { Task } from '../../types';

// Mock the theme hook to return "pro" theme (which shows priority text)
vi.mock('../../hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'pro',
    t: (key: string) => key,
  }),
}));

describe('TaskCard', () => {
  const mockTask: Task = {
    id: 'task-1',
    title: 'Test Task',
    description: 'Test description',
    columnId: 'todo',
    tags: ['frontend', 'urgent'],
    priority: 'high',
    createdAt: Date.now(),
    subtasks: [
      { id: 'st-1', title: 'Subtask 1', completed: true },
      { id: 'st-2', title: 'Subtask 2', completed: false },
    ],
    comments: [],
  };

  const mockOnDragStart = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render task with title', () => {
    render(
      <TaskCard
        task={mockTask}
        onDragStart={mockOnDragStart}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should display priority badge', () => {
    render(
      <TaskCard
        task={mockTask}
        onDragStart={mockOnDragStart}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // In pro theme, priority is displayed as text
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('should render tags with hashtag prefix', () => {
    render(
      <TaskCard
        task={mockTask}
        onDragStart={mockOnDragStart}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // In pro theme, tags are prefixed with #
    expect(screen.getByText('#frontend')).toBeInTheDocument();
    expect(screen.getByText('#urgent')).toBeInTheDocument();
  });

  it('should render subtask progress', () => {
    render(
      <TaskCard
        task={mockTask}
        onDragStart={mockOnDragStart}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('1/2')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    render(
      <TaskCard
        task={mockTask}
        onDragStart={mockOnDragStart}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it('should call onDelete when delete button is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onDragStart={mockOnDragStart}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]);
    
    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
  });

  it('should be draggable', () => {
    const { container } = render(
      <TaskCard
        task={mockTask}
        onDragStart={mockOnDragStart}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const card = container.querySelector('[draggable="true"]');
    expect(card).toBeInTheDocument();
  });
});
