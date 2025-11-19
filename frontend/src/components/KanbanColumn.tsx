import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task } from '../types';
import type { Column } from '../utils/constants';
import { DraggableTask } from './DraggableTask';
import '../styles/KanbanColumn.css';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onStatusChange: (task: Task, newStatus: Task['status']) => void;
  onDelete: (id: string) => void;
}

export function KanbanColumn({ column, tasks, onStatusChange, onDelete }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      status: column.status,
    },
  });

  const taskIds = tasks.map((task) => task.id);

  return (
    <div className="kanban-column">
      <div className="column-header">
        <h3 className="column-title">{column.title}</h3>
        <span className="column-count">{tasks.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`column-tasks ${isOver ? 'drag-over' : ''}`}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <DraggableTask
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="empty-state">
            <p>No tasks</p>
            <p className="empty-hint">Drag tasks here or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}
