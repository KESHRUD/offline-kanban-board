import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { Play, Pause, RotateCcw, Zap, Waves } from 'lucide-react';
import { audioManager } from '../services/audioService';

export const FocusTimer: React.FC = () => {
    const { theme, t } = useTheme();
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break'>('focus');
    const [noiseEnabled, setNoiseEnabled] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            audioManager.play('success', theme);
            if (mode === 'focus') {
                setMode('break');
                setTimeLeft(5 * 60);
            } else {
                setMode('focus');
                setTimeLeft(25 * 60);
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode, theme]);

    const toggleTimer = () => {
        setIsActive(!isActive);
        audioManager.play('click', theme);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
        audioManager.play('click', theme);
    };

    const toggleNoise = () => {
        const newState = !noiseEnabled;
        setNoiseEnabled(newState);
        audioManager.toggleBrownNoise(newState);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const isGalilee = theme === 'galilee';

    return (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 animate-slide-in-right
            ${isGalilee 
                ? 'bg-slate-900/90 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-cyan-50' 
                : 'bg-white/90 border border-slate-200 shadow-xl text-slate-800'
            } rounded-2xl p-4 w-48 backdrop-blur-md`}
        >
            <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1
                    ${isGalilee ? 'text-cyan-400' : 'text-indigo-500'}`}>
                    <Zap size={10} /> {t('hyperfocus')}
                </span>
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-ping' : 'bg-slate-500'}`} />
            </div>

            <div className={`text-4xl font-mono font-bold text-center mb-4 tracking-tighter
                ${isGalilee ? 'text-white drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'text-slate-800'}`}>
                {formatTime(timeLeft)}
            </div>

            <div className="flex justify-center gap-2 mb-2">
                <button onClick={toggleTimer} className={`p-2 rounded-lg transition-all
                    ${isGalilee 
                        ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/40 hover:text-white' 
                        : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}>
                    {isActive ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button onClick={resetTimer} className={`p-2 rounded-lg transition-all
                    ${isGalilee 
                        ? 'bg-slate-800 text-slate-400 hover:text-white' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                    <RotateCcw size={16} />
                </button>
            </div>

             <button 
                onClick={toggleNoise} 
                className={`w-full py-1 text-[10px] uppercase font-bold flex items-center justify-center gap-2 rounded transition-all
                    ${noiseEnabled 
                        ? (isGalilee ? 'bg-cyan-600 text-white animate-pulse' : 'bg-indigo-500 text-white')
                        : (isGalilee ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400')
                    }`}
            >
                <Waves size={12} /> {t('alpha_waves')}
            </button>
            
            {/* Visual Progress Bar */}
            <div className="w-full h-1 bg-slate-700/50 mt-4 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-1000 ${isGalilee ? 'bg-cyan-500' : 'bg-indigo-500'}`}
                    style={{ width: `${(timeLeft / (mode === 'focus' ? 1500 : 300)) * 100}%` }}
                />
            </div>
        </div>
    );
};
