import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useTasks } from './hooks/useTasks';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { UpdatePrompt } from './components/UpdatePrompt';
import { KanbanColumn } from './components/KanbanColumn';
import { TaskCard } from './components/TaskCard';
import { CreateTaskModal } from './components/CreateTaskModal';
import { COLUMNS } from './utils/constants';
import type { Task } from './types';
import './App.css';

function App() {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();
  const isOnline = useOnlineStatus();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === 'todo'),
    'in-progress': tasks.filter((t) => t.status === 'in-progress'),
    done: tasks.filter((t) => t.status === 'done'),
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveTask(null);

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overData = over.data.current;

    // Check if dropped on a column
    if (overData?.type === 'column') {
      const newStatus = overData.status as Task['status'];
      if (activeTask.status !== newStatus) {
        await updateTask(activeTask.id, { status: newStatus });
      }
      return;
    }

    // Check if dropped on another task
    if (overData?.type === 'task') {
      const overTask = overData.task as Task;
      
      // If dropped on a task in a different column, move to that column
      if (activeTask.status !== overTask.status) {
        await updateTask(activeTask.id, { status: overTask.status });
        return;
      }

      // If dropped on a task in the same column, reorder
      if (active.id !== over.id) {
        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        const overIndex = tasks.findIndex((t) => t.id === over.id);
        
        if (activeIndex !== -1 && overIndex !== -1) {
          const reordered = arrayMove(tasks, activeIndex, overIndex);
          // Could implement order persistence here if needed
          console.log('Tasks reordered:', reordered);
        }
      }
    }
  };

  const handleCreateTask = async (title: string, description?: string) => {
    await createTask({ 
      title, 
      description,
      status: 'todo' 
    });
  };

  const handleStatusChange = async (task: Task, newStatus: Task['status']) => {
    await updateTask(task.id, { status: newStatus });
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm('Delete this task?')) {
      await deleteTask(id);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="app">
        <header className="app-header">
          <h1>📋 Offline Kanban Board</h1>
          <div className="header-actions">
            <div className="status-indicator">
              <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
              {isOnline ? 'Online' : 'Offline'}
            </div>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="btn-create"
            >
              + New Task
            </button>
          </div>
        </header>

        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
          </div>
        )}

        <div className="kanban-board">
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasksByStatus[column.status]}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div style={{ cursor: 'grabbing' }}>
              <TaskCard
                task={activeTask}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
                isDragging
              />
            </div>
          )}
        </DragOverlay>

        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateTask}
        />

        <UpdatePrompt />
      </div>
    </DndContext>
  );
}

export default App;
