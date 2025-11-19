import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';
import { TaskCard } from './TaskCard';

interface DraggableTaskProps {
  task: Task;
  onStatusChange: (task: Task, newStatus: Task['status']) => void;
  onDelete: (id: string) => void;
}

export function DraggableTask({ task, onStatusChange, onDelete }: DraggableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </div>
  );
}
