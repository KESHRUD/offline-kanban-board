import { useTasks } from './hooks/useTasks';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import type { Task } from './types';
import './App.css';

function App() {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();
  const isOnline = useOnlineStatus();

  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === 'todo'),
    'in-progress': tasks.filter((t) => t.status === 'in-progress'),
    done: tasks.filter((t) => t.status === 'done'),
  };

  const handleCreateTask = async () => {
    const title = prompt('Enter task title:');
    if (title) {
      await createTask({ title, status: 'todo' });
    }
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
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📋 Offline Kanban Board</h1>
        <div className="status-indicator">
          <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="controls">
        <button onClick={handleCreateTask} className="btn-primary">
          + Add Task
        </button>
      </div>

      <div className="board">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <div key={status} className="column">
            <h2 className="column-title">
              {status === 'todo' ? '📝 To Do' : status === 'in-progress' ? '🚀 In Progress' : '✅ Done'}
              <span className="task-count">{statusTasks.length}</span>
            </h2>
            <div className="task-list">
              {statusTasks.map((task) => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <h3>{task.title}</h3>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="btn-delete"
                      aria-label="Delete task"
                    >
                      ×
                    </button>
                  </div>
                  {task.description && <p className="task-description">{task.description}</p>}
                  {task.priority && (
                    <span className={`priority-badge priority-${task.priority}`}>
                      {task.priority}
                    </span>
                  )}
                  <div className="task-actions">
                    {status !== 'todo' && (
                      <button
                        onClick={() => handleStatusChange(task, status === 'in-progress' ? 'todo' : 'in-progress')}
                        className="btn-secondary btn-small"
                      >
                        ← {status === 'in-progress' ? 'To Do' : 'In Progress'}
                      </button>
                    )}
                    {status !== 'done' && (
                      <button
                        onClick={() => handleStatusChange(task, status === 'todo' ? 'in-progress' : 'done')}
                        className="btn-secondary btn-small"
                      >
                        {status === 'todo' ? 'In Progress' : 'Done'} →
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {statusTasks.length === 0 && (
                <div className="empty-state">No tasks</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

