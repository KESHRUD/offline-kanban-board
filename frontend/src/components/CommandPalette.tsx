import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';
import { Search, Sun, Moon, VolumeX, Plus } from 'lucide-react';
import { audioManager } from '../services/audioService';

interface CommandPaletteProps {
  onNewTask: () => void;
  onNewDeck: () => void;
  onToggleMute: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onNewTask, onNewDeck, onToggleMute }) => {
  const { theme, toggleTheme, t } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = [
    { id: 'new_task', label: t('cmd_new_task'), icon: <Plus size={16}/>, action: onNewTask },
    { id: 'new_deck', label: t('cmd_new_deck'), icon: <Plus size={16}/>, action: onNewDeck },
    { id: 'theme', label: t('cmd_toggle_theme'), icon: theme === 'galilee' ? <Sun size={16}/> : <Moon size={16}/>, action: toggleTheme },
    { id: 'mute', label: t('cmd_toggle_mute'), icon: <VolumeX size={16}/>, action: onToggleMute },
  ];

  const filteredCommands = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (isOpen) {
        if (e.key === 'Escape') setIsOpen(false);
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredCommands[selectedIndex]) {
                filteredCommands[selectedIndex].action();
                setIsOpen(false);
                audioManager.play('click', theme);
            }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, theme, toggleTheme]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
        inputRef.current.focus();
    }
    setQuery('');
    setSelectedIndex(0);
  }, [isOpen]);

  if (!isOpen) return null;

  const isGalilee = theme === 'galilee';

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in-up">
        <div className={`w-full max-w-lg rounded-xl overflow-hidden shadow-2xl transform transition-all border
            ${isGalilee 
                ? 'bg-slate-900/90 border-cyan-500 text-cyan-50' 
                : 'bg-white border-slate-200 text-slate-800'}`}
        >
            <div className={`flex items-center px-4 py-3 border-b ${isGalilee ? 'border-cyan-800' : 'border-slate-100'}`}>
                <Search className={`w-5 h-5 mr-3 ${isGalilee ? 'text-cyan-500' : 'text-slate-400'}`} />
                <input
                    ref={inputRef}
                    className={`w-full bg-transparent outline-none font-mono text-sm ${isGalilee ? 'text-white placeholder-cyan-700' : 'text-slate-900'}`}
                    placeholder={t('cmd_placeholder')}
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                />
                <div className={`text-[10px] px-2 py-0.5 rounded border ${isGalilee ? 'border-cyan-800 text-cyan-600' : 'border-slate-200 text-slate-400'}`}>ESC</div>
            </div>

            <div className="max-h-64 overflow-y-auto p-2">
                {filteredCommands.map((cmd, index) => (
                    <button
                        key={cmd.id}
                        onClick={() => { cmd.action(); setIsOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                            ${index === selectedIndex 
                                ? (isGalilee ? 'bg-cyan-900/50 text-cyan-300' : 'bg-indigo-50 text-indigo-700') 
                                : (isGalilee ? 'text-slate-400 hover:text-cyan-200' : 'text-slate-600')}`}
                    >
                        {cmd.icon}
                        <span>{cmd.label}</span>
                        {index === selectedIndex && (
                            <span className="ml-auto text-[10px] opacity-50">↵</span>
                        )}
                    </button>
                ))}
                {filteredCommands.length === 0 && (
                    <div className="p-4 text-center text-sm opacity-50 font-mono">
                        No commands found.
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
