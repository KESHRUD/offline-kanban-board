
import React from 'react';
import type { Column as ColumnType, Task } from '../types';
import { TaskCard } from './TaskCard';
import { useTheme } from './ThemeContext';
import { Plus, GripVertical, Trash2, MoreHorizontal } from 'lucide-react';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, id: string, columnId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (columnId: string) => void;
  onDeleteColumn: (columnId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({ 
  column, tasks, onDrop, onDragOver, onDragStart, onEditTask, onDeleteTask, onAddTask, onDeleteColumn
}) => {
  const { theme, t } = useTheme();

  const handleDrop = (e: React.DragEvent) => {
    onDrop(e, column.id);
  };

  const handleDeleteColumn = () => {
    if (confirm(t('confirm_action'))) {
      onDeleteColumn(column.id);
    }
  };

  if (theme === 'galilee') {
    return (
      <div 
        className="flex-shrink-0 w-80 flex flex-col h-full mr-8"
        onDrop={handleDrop}
        onDragOver={onDragOver}
      >
        {/* 3D Header Plate */}
        <div className="mb-4 bg-slate-900 border border-cyan-800/50 p-4 shadow-3d-panel relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
            <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                    <GripVertical size={16} className="text-slate-600" />
                    <h2 className="font-tech font-bold text-xl text-cyan-100 uppercase tracking-widest truncate max-w-[140px]">{column.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-cyan-950 border border-cyan-700 text-cyan-400 font-mono px-2 py-0.5 text-xs rounded">
                        {tasks.length.toString().padStart(2, '0')}
                    </div>
                    <button onClick={handleDeleteColumn} className="text-slate-600 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none translate-y-[-100%] group-hover:translate-y-[100%] duration-1000 ease-in-out"></div>
        </div>

        {/* Column Track */}
        <div className="flex-1 overflow-y-auto px-1 py-2 custom-scrollbar border-l border-dashed border-slate-700/50 bg-gradient-to-b from-slate-900/20 to-transparent">
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onDragStart={onDragStart} 
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
          
           <button 
            onClick={() => onAddTask(column.id)}
            className="w-full py-3 mt-2 border border-dashed border-slate-700 text-slate-500 font-tech uppercase tracking-widest hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-950/30 transition-all flex items-center justify-center gap-2 group"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform"/>
            {t('new_protocol')}
          </button>
        </div>
      </div>
    );
  }

  // Pro Theme
  return (
    <div 
      className="flex-shrink-0 w-80 flex flex-col h-full max-h-full bg-slate-50/50 rounded-xl border border-slate-200/60 mr-4 backdrop-blur-sm"
      onDrop={handleDrop}
      onDragOver={onDragOver}
    >
      <div className="p-4 flex items-center justify-between group">
        <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-700 truncate max-w-[150px]">{column.title}</h2>
            <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">{tasks.length}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
             <button 
                onClick={() => onAddTask(column.id)}
                className="text-slate-400 hover:text-indigo-600 p-1 rounded hover:bg-indigo-50"
            >
                <Plus size={18} />
            </button>
            <button 
                onClick={handleDeleteColumn}
                className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50"
            >
                <Trash2 size={16} />
            </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 pb-3 custom-scrollbar">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onDragStart={onDragStart}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
         {tasks.length === 0 && (
            <div 
                onClick={() => onAddTask(column.id)}
                className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm hover:border-indigo-300 hover:text-indigo-500 cursor-pointer transition-colors"
            >
                + {t('create')}
            </div>
        )}
      </div>
    </div>
  );
};
