
import React, { useState, useEffect, useRef } from 'react';
import type { Task, Priority, Subtask, Comment } from '../types';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import { X, Loader2, Bot, Plus, Calendar, CheckCircle, Circle, Send, FileCode, Edit3, Image } from 'lucide-react';
import { enhanceTaskDescription, generateDiagramCode } from '../services/geminiService';

declare global {
  interface Window {
    mermaid: any;
  }
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  initialTask?: Task | null;
  columnId?: string;
}

export const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, initialTask, columnId }) => {
  const { theme, t } = useTheme();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'config' | 'blueprint'>('config');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [diagramCode, setDiagramCode] = useState('');
  
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingDiagram, setIsGeneratingDiagram] = useState(false);
  
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
        if (initialTask) {
            setTitle(initialTask.title);
            setDescription(initialTask.description);
            setPriority(initialTask.priority);
            setTags(initialTask.tags.join(', '));
            setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate).toISOString().split('T')[0] : '');
            setSubtasks(initialTask.subtasks || []);
            setComments(initialTask.comments || []);
            setDiagramCode(initialTask.diagramCode || '');
        } else {
            setTitle('');
            setDescription('');
            setPriority('medium');
            setTags('');
            setDueDate('');
            setSubtasks([]);
            setComments([]);
            setDiagramCode('');
        }
        setActiveTab('config');
    }
  }, [isOpen, initialTask]);

  useEffect(() => {
      if (activeTab === 'blueprint' && diagramCode && window.mermaid && mermaidRef.current) {
          window.mermaid.initialize({ startOnLoad: true, theme: theme === 'galilee' ? 'dark' : 'default' });
          try {
              mermaidRef.current.innerHTML = `<div class="mermaid">${diagramCode}</div>`;
              window.mermaid.run({ nodes: [mermaidRef.current.querySelector('.mermaid')] });
          } catch(e) {
              console.error("Mermaid Render Error", e);
              mermaidRef.current.innerHTML = "Diagram Syntax Error";
          }
      }
  }, [activeTab, diagramCode, theme]);

  const handleEnhance = async () => {
    if (!title) return;
    setIsEnhancing(true);
    try {
        const result = await enhanceTaskDescription(title, description);
        setDescription(result.description);
        
        const currentTags = tags.split(',').map(t => t.trim()).filter(Boolean);
        const newTags = Array.from(new Set([...currentTags, ...result.tags]));
        setTags(newTags.join(', '));

        if (result.subtasks && result.subtasks.length > 0) {
            const addedSubtasks: Subtask[] = result.subtasks.map((st: string) => ({
                id: `st-${Date.now()}-${Math.random()}`,
                title: st,
                completed: false
            }));
            setSubtasks(prev => [...prev, ...addedSubtasks]);
        }

    } catch (e) {
        alert("Échec de l'amélioration IA. Vérifiez la clé API.");
    } finally {
        setIsEnhancing(false);
    }
  };

  const handleGenerateBlueprint = async () => {
      if (!description) return;
      setIsGeneratingDiagram(true);
      try {
          const code = await generateDiagramCode(description);
          setDiagramCode(code);
      } catch (e) {
          alert("Error generating diagram");
      } finally {
          setIsGeneratingDiagram(false);
      }
  }

  const handleSave = () => {
    onSave({
        id: initialTask?.id,
        title,
        description,
        priority,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        columnId: initialTask?.columnId || columnId,
        dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
        subtasks,
        comments,
        diagramCode
    });
    onClose();
  };

  const addSubtask = () => {
      if (!newSubtaskTitle.trim()) return;
      setSubtasks([...subtasks, {
          id: `st-${Date.now()}`,
          title: newSubtaskTitle,
          completed: false
      }]);
      setNewSubtaskTitle('');
  };

  const toggleSubtask = (id: string) => {
      setSubtasks(subtasks.map(st => st.id === id ? { ...st, completed: !st.completed } : st));
  };

  const deleteSubtask = (id: string) => {
      setSubtasks(subtasks.filter(st => st.id !== id));
  };

  if (!isOpen) return null;

  const isGalilee = theme === 'galilee';
  const inputBaseClass = isGalilee 
    ? 'bg-slate-950 border border-slate-700 text-cyan-100 font-mono text-sm focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] outline-none transition-all placeholder-slate-700'
    : 'border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 perspective-1000 animate-fade-in-up">
      <div className={`w-full max-w-2xl max-h-[90vh] flex flex-col relative transition-all duration-300 rounded-xl overflow-hidden
        ${isGalilee 
            ? 'bg-slate-900 border border-cyan-500/30 shadow-3d-panel text-cyan-50' 
            : 'bg-white rounded-2xl shadow-xl text-slate-800'}`
      }>
        
        {/* Header */}
        <div className={`flex justify-between items-center p-6 border-b ${isGalilee ? 'border-cyan-900' : 'border-slate-100'}`}>
            <div className="flex items-center gap-4">
                <h2 className={`${isGalilee ? 'font-tech text-2xl font-bold text-cyan-400 uppercase tracking-widest' : 'text-xl font-bold'}`}>
                    {initialTask ? t('config_module') : t('new_protocol')}
                </h2>
                <div className={`flex rounded-lg p-1 ${isGalilee ? 'bg-slate-950 border border-cyan-900' : 'bg-slate-100'}`}>
                    <button 
                        onClick={() => setActiveTab('config')}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${activeTab === 'config' ? (isGalilee ? 'bg-cyan-900 text-cyan-400' : 'bg-white shadow') : 'opacity-50'}`}
                    >
                        <Edit3 size={14} className="inline mr-1"/> Config
                    </button>
                    <button 
                        onClick={() => setActiveTab('blueprint')}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${activeTab === 'blueprint' ? (isGalilee ? 'bg-cyan-900 text-cyan-400' : 'bg-white shadow') : 'opacity-50'}`}
                    >
                        <FileCode size={14} className="inline mr-1"/> {t('blueprint_tab')}
                    </button>
                </div>
            </div>
            <button onClick={onClose} className={`${isGalilee ? 'text-slate-500 hover:text-red-400' : 'text-slate-400 hover:text-slate-600'}`}>
                <X size={24} />
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            
            {activeTab === 'config' ? (
                <>
                {/* Top Row: Title & Enhance */}
                <div className="flex gap-4 items-start">
                    <div className="flex-1">
                        <label className={`block text-xs mb-1 uppercase tracking-wider ${isGalilee ? 'text-cyan-600' : 'text-slate-500 font-bold'}`}>Titre / ID</label>
                        <input 
                            className={`w-full p-3 text-lg font-bold ${inputBaseClass}`}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nom de la tâche"
                        />
                    </div>
                    <button 
                        type="button"
                        onClick={handleEnhance}
                        disabled={isEnhancing || !title}
                        className={`mt-6 px-4 py-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all
                            ${isGalilee 
                                ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-700 hover:bg-cyan-800/50 disabled:opacity-30' 
                                : 'bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 disabled:opacity-50'}`}
                    >
                        {isEnhancing ? <Loader2 className="animate-spin" size={16}/> : <Bot size={16}/>}
                        {isEnhancing ? t('ai_generating') : t('ai_assist')}
                    </button>
                </div>

                {/* Description */}
                <div>
                     <label className={`block text-xs mb-1 uppercase tracking-wider ${isGalilee ? 'text-cyan-600' : 'text-slate-500 font-bold'}`}>Description</label>
                     <textarea 
                        className={`w-full p-3 h-24 resize-none leading-relaxed ${inputBaseClass}`}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Détails du projet ou cours..."
                    />
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className={`block text-xs mb-1 uppercase tracking-wider ${isGalilee ? 'text-cyan-600' : 'text-slate-500 font-bold'}`}>{t('priority_medium')}</label>
                        <select 
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as Priority)}
                            className={`w-full p-2.5 ${inputBaseClass}`}
                        >
                            <option value="low">{t('priority_low')}</option>
                            <option value="medium">{t('priority_medium')}</option>
                            <option value="high">{t('priority_high')}</option>
                        </select>
                    </div>

                    <div>
                        <label className={`block text-xs mb-1 uppercase tracking-wider ${isGalilee ? 'text-cyan-600' : 'text-slate-500 font-bold'}`}>{t('deadline')}</label>
                        <div className="relative">
                            <input 
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className={`w-full p-2.5 ${inputBaseClass}`}
                            />
                            <Calendar className={`absolute right-3 top-2.5 pointer-events-none ${isGalilee ? 'text-cyan-700' : 'text-slate-400'}`} size={16}/>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                     <label className={`block text-xs mb-1 uppercase tracking-wider ${isGalilee ? 'text-cyan-600' : 'text-slate-500 font-bold'}`}>{t('tags')}</label>
                     <input 
                        className={`w-full p-2.5 ${inputBaseClass}`}
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="design, dev..."
                    />
                </div>

                {/* Subtasks / Checklist */}
                <div className={`${isGalilee ? 'bg-slate-950/50 border border-slate-800' : 'bg-slate-50 rounded-xl'} p-4`}>
                    <div className="flex items-center justify-between mb-3">
                         <label className={`text-xs uppercase tracking-wider ${isGalilee ? 'text-cyan-600' : 'text-slate-500 font-bold'}`}>{t('subtasks')} ({subtasks.filter(s=>s.completed).length}/{subtasks.length})</label>
                         {subtasks.length > 0 && (
                             <div className="h-1.5 w-24 bg-gray-200 rounded-full overflow-hidden">
                                 <div className="h-full bg-green-500 transition-all" style={{ width: `${(subtasks.filter(s=>s.completed).length / subtasks.length) * 100}%` }}></div>
                             </div>
                         )}
                    </div>
                    
                    <div className="space-y-2 mb-3">
                        {subtasks.map(st => (
                            <div key={st.id} className="flex items-center gap-3 group">
                                <button onClick={() => toggleSubtask(st.id)} className={`${isGalilee ? (st.completed ? 'text-cyan-400' : 'text-slate-700') : (st.completed ? 'text-green-500' : 'text-slate-300')} hover:scale-110 transition-transform`}>
                                    {st.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                                </button>
                                <span className={`flex-1 text-sm ${st.completed ? 'line-through opacity-50' : ''}`}>{st.title}</span>
                                <button onClick={() => deleteSubtask(st.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 p-1"><X size={14}/></button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex gap-2">
                        <input 
                             className={`flex-1 p-2 text-sm ${inputBaseClass}`}
                             value={newSubtaskTitle}
                             onChange={(e) => setNewSubtaskTitle(e.target.value)}
                             placeholder="Ajouter étape..."
                             onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
                        />
                        <button onClick={addSubtask} className={`p-2 ${isGalilee ? 'bg-cyan-900 text-cyan-400 border border-cyan-700 hover:bg-cyan-800' : 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg'}`}>
                            <Plus size={18} />
                        </button>
                    </div>
                </div>
                </>
            ) : (
                /* BLUEPRINT TAB */
                <div className="h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <p className={`text-xs ${isGalilee ? 'text-cyan-600' : 'text-slate-500'}`}>
                            {t('blueprint_desc')} (Powered by MermaidJS)
                        </p>
                        <button 
                             type="button"
                             onClick={handleGenerateBlueprint}
                             disabled={isGeneratingDiagram}
                             className={`px-4 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider rounded-lg
                                ${isGalilee 
                                    ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-700 hover:bg-cyan-800/50' 
                                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                        >
                             {isGeneratingDiagram ? <Loader2 className="animate-spin" size={14}/> : <Image size={14}/>}
                             {t('generate_blueprint')}
                        </button>
                    </div>
                    
                    <div className={`flex-1 min-h-[300px] border rounded-xl overflow-hidden relative p-4
                         ${isGalilee ? 'bg-slate-900 border-cyan-900' : 'bg-slate-50 border-slate-200'}`}>
                         
                         {diagramCode ? (
                             <div ref={mermaidRef} className="w-full h-full overflow-auto flex items-center justify-center">
                                 {/* Mermaid renders here */}
                             </div>
                         ) : (
                             <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30">
                                 <FileCode size={48} className="mb-2"/>
                                 <p className="text-sm font-mono">No Blueprint Data</p>
                             </div>
                         )}
                    </div>
                    
                    <textarea 
                         value={diagramCode}
                         onChange={(e) => setDiagramCode(e.target.value)}
                         className={`mt-4 w-full h-24 p-2 font-mono text-xs opacity-50 focus:opacity-100 transition-opacity ${inputBaseClass}`}
                         placeholder="MermaidJS Code..."
                    />
                </div>
            )}
        </div>

        {/* Footer Actions */}
        <div className={`p-6 border-t ${isGalilee ? 'border-cyan-900 bg-slate-900' : 'border-slate-100 bg-gray-50 rounded-b-2xl'}`}>
             <button 
                onClick={handleSave}
                className={`w-full py-3 font-bold uppercase tracking-widest transition-all
                    ${isGalilee 
                        ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-3d-hover hover:translate-y-[-2px] hover:shadow-cyan-500/20' 
                        : 'bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200'}`}
            >
                {initialTask ? t('save') : t('create')}
            </button>
        </div>

      </div>
    </div>
  );
};
