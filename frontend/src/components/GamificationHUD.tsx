import React from 'react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { Trophy, Shield } from 'lucide-react';

export const GamificationHUD: React.FC = () => {
    const { user } = useAuth();
    const { theme, t } = useTheme();

    if (!user) return null;

    const currentXp = user.xp || 0;
    const currentLevel = user.level || 1;
    const progress = Math.min((currentXp % 100) / 100 * 100, 100);

    const isGalilee = theme === 'galilee';

    return (
        <div className={`hidden md:flex items-center gap-4 px-4 py-2 rounded-xl border backdrop-blur-md transition-all
            ${isGalilee 
                ? 'bg-slate-900/60 border-cyan-800 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                : 'bg-white/60 border-slate-200 shadow-sm'}`}>
            
            {/* Rank Badge */}
            <div className={`flex flex-col items-center justify-center`}>
                <div className={`p-1.5 rounded-full border-2 ${isGalilee ? 'border-cyan-500 text-cyan-400 bg-cyan-950' : 'border-indigo-500 text-indigo-600 bg-indigo-50'}`}>
                    <Shield size={16} />
                </div>
            </div>

            <div className="flex flex-col min-w-[120px]">
                <div className="flex justify-between items-center mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isGalilee ? 'text-cyan-400' : 'text-slate-600'}`}>
                        {user.rank || t('rank_novice')}
                    </span>
                    <span className={`text-[10px] font-mono ${isGalilee ? 'text-cyan-600' : 'text-slate-400'}`}>
                        LVL {currentLevel}
                    </span>
                </div>
                
                {/* XP Bar */}
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isGalilee ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div 
                        className={`h-full transition-all duration-700 relative overflow-hidden ${isGalilee ? 'bg-gradient-to-r from-cyan-600 to-cyan-400' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`} 
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                </div>
            </div>

            <div className={`flex items-center gap-1 text-[10px] font-bold ${isGalilee ? 'text-yellow-400' : 'text-amber-600'}`}>
                <Trophy size={12} />
                <span>{currentXp} XP</span>
            </div>
        </div>
    );
};
