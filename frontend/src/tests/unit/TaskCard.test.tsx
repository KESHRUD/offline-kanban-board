import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskCard } from '../../components/TaskCard';
import type { Task } from '../../types';

describe('TaskCard', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test description',
    status: 'todo',
    createdAt: '2025-01-18T00:00:00.000Z',
    updatedAt: '2025-01-18T00:00:00.000Z',
  };

  const mockOnStatusChange = vi.fn();
  const mockOnDelete = vi.fn();

  it('should render task with title and description', () => {
    render(
      <TaskCard
        task={mockTask}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should not render description if not provided', () => {
    const taskWithoutDesc = { ...mockTask, description: undefined };
    
    render(
      <TaskCard
        task={taskWithoutDesc}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });

  it('should display formatted creation date', () => {
    render(
      <TaskCard
        task={mockTask}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );

    const dateElement = screen.getByText(/1\/18\/2025/);
    expect(dateElement).toBeInTheDocument();
  });

  it('should have dragging class when isDragging is true', () => {
    const { container } = render(
      <TaskCard
        task={mockTask}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
        isDragging={true}
      />
    );

    const taskCard = container.querySelector('.task-card');
    expect(taskCard).toHaveClass('dragging');
  });

  it('should render status select with correct value', () => {
    render(
      <TaskCard
        task={mockTask}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('todo');
  });

  it('should render delete button', () => {
    render(
      <TaskCard
        task={mockTask}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByLabelText('Delete task');
    expect(deleteButton).toBeInTheDocument();
  });
});
