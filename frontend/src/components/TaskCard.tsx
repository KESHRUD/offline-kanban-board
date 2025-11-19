import type { Task } from '../types';
import '../styles/TaskCard.css';

interface TaskCardProps {
  task: Task;
  onStatusChange: (task: Task, newStatus: Task['status']) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

export function TaskCard({ task, onStatusChange, onDelete, isDragging }: TaskCardProps) {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation(); // Prevent drag interference
    onStatusChange(task, e.target.value as Task['status']);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag interference
    onDelete(task.id);
  };

  return (
    <div className={`task-card ${isDragging ? 'dragging' : ''}`}>
      <div className="task-header">
        <h4 className="task-title">{task.title}</h4>
        <button
          className="task-delete"
          onClick={handleDelete}
          aria-label="Delete task"
        >
          ×
        </button>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-footer">
        <select
          value={task.status}
          onChange={handleStatusChange}
          className="task-status-select"
          aria-label="Change task status"
          onClick={(e) => e.stopPropagation()}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <span className="task-date">
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
