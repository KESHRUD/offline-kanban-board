
import React from 'react';
import type { Task, Priority } from '../types';
import { useTheme } from './ThemeContext';
import { Trash2, Edit2, Clock, Cpu, CheckSquare, MessageSquare } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, id: string, columnId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors: Record<Priority, string> = {
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200',
};

const galileePriorityColors: Record<Priority, string> = {
  low: 'border-l-4 border-blue-400',
  medium: 'border-l-4 border-yellow-400',
  high: 'border-l-4 border-red-500',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart, onEdit, onDelete }) => {
  const { theme } = useTheme();

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, task.id, task.columnId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progress = totalSubtasks === 0 ? 0 : (completedSubtasks / totalSubtasks) * 100;
  
  const isOverdue = task.dueDate && Date.now() > task.dueDate;
  const hasDueDate = !!task.dueDate;

  // --- GALILEE THEME ---
  if (theme === 'galilee') {
    return (
      <div
        draggable
        onDragStart={handleDragStart}
        className={`
            bg-slate-800/80 backdrop-blur-md text-cyan-50 p-4 mb-4 cursor-grab active:cursor-grabbing 
            relative group tilt-card shadow-3d border border-slate-600/50 rounded-r-lg
            ${galileePriorityColors[task.priority]}
        `}
      >
        <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10 bg-slate-900/50 rounded-bl-lg">
           <button onClick={() => onEdit(task)} className="p-1 hover:bg-cyan-500/20 rounded text-cyan-400"><Edit2 size={12}/></button>
           <button onClick={() => onDelete(task.id)} className="p-1 hover:bg-red-500/20 rounded text-red-400"><Trash2 size={12}/></button>
        </div>

        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-tech tracking-widest uppercase text-cyan-400/80">
            ID : {task.id.slice(-4)}
          </span>
          {hasDueDate && (
            <span className={`text-[10px] font-mono flex items-center gap-1 ${isOverdue ? 'text-red-400 animate-pulse' : 'text-slate-400'}`}>
                <Clock size={10} />
                {new Date(task.dueDate!).toLocaleDateString('fr-FR')}
            </span>
          )}
        </div>
        
        <h3 className="font-tech font-bold text-lg mb-1 text-white tracking-wide">{task.title}</h3>
        
        {/* Progress Bar for Galilée */}
        {totalSubtasks > 0 && (
            <div className="w-full h-1 bg-slate-700 rounded-full mb-3 overflow-hidden">
                <div 
                    className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
        )}

        <div className="flex flex-wrap gap-2 items-center justify-between mt-2">
          <div className="flex gap-1 flex-wrap">
            {task.tags.map(tag => (
                <span key={tag} className="text-[10px] bg-cyan-950 border border-cyan-800 text-cyan-300 px-2 py-0.5 rounded-sm font-tech uppercase tracking-wider">
                {tag}
                </span>
            ))}
          </div>
          <div className="flex items-center gap-3 text-slate-500">
             {(task.comments?.length || 0) > 0 && (
                 <div className="flex items-center gap-1 text-xs">
                    <MessageSquare size={12} /> {task.comments.length}
                 </div>
             )}
             {totalSubtasks > 0 && (
                <div className="flex items-center gap-1 text-xs">
                    <CheckSquare size={12} /> {completedSubtasks}/{totalSubtasks}
                </div>
             )}
             {task.priority === 'high' && <Cpu size={14} className="text-red-500 animate-pulse" />}
          </div>
        </div>
      </div>
    );
  }

  // --- PRO THEME ---
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all group"
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 text-slate-400">
           <button onClick={() => onEdit(task)} className="hover:text-blue-500"><Edit2 size={14}/></button>
           <button onClick={() => onDelete(task.id)} className="hover:text-red-500"><Trash2 size={14}/></button>
        </div>
      </div>
      <h3 className="font-semibold text-slate-800 mb-1">{task.title}</h3>
      
      {/* Date & Progress Row */}
      <div className="flex items-center gap-3 mb-2 text-xs text-slate-500">
        {hasDueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-bold' : ''}`}>
                <Clock size={12} />
                {new Date(task.dueDate!).toLocaleDateString('fr-FR')}
            </div>
        )}
      </div>

      {totalSubtasks > 0 && (
         <div className="w-full h-1.5 bg-slate-100 rounded-full mb-3 overflow-hidden">
            <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
            />
         </div>
      )}
      
      <div className="flex items-center justify-between mt-2">
         <div className="flex flex-wrap gap-1">
          {task.tags.map(tag => (
            <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
            {(task.comments?.length || 0) > 0 && (
                 <div className="flex items-center gap-1">
                    <MessageSquare size={12} /> {task.comments.length}
                 </div>
             )}
             {totalSubtasks > 0 && (
                <div className="flex items-center gap-1">
                    <CheckSquare size={12} /> {completedSubtasks}/{totalSubtasks}
                </div>
             )}
        </div>
      </div>
    </div>
  );
};
