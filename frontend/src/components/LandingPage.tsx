
import React from 'react';
import { useTheme } from './ThemeContext';
import { Logo } from './Logo';
import { Background3D } from './Background3D';
import { ArrowRight, Cpu, Brain, Zap } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const { theme, toggleTheme, t } = useTheme();
  const isGalilee = theme === 'galilee';

  return (
    <div className={`min-h-screen w-full relative overflow-hidden ${isGalilee ? 'text-white' : 'text-slate-900'}`}>
      
      {/* 3D Background Layer */}
      <Background3D />
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center animate-slide-in-right
        ${isGalilee ? 'text-cyan-50' : 'text-slate-800'}
      `}>
        <div className={`flex items-center gap-3 backdrop-blur-md p-2 rounded-full border border-white/10 px-4 ${isGalilee ? 'bg-black/20' : 'bg-white/50'}`}>
            <Logo size="md" animated />
            <span className={`text-xl font-bold tracking-wider ${theme === 'galilee' ? 'font-tech text-cyan-100' : 'font-sans'}`}>
                GALILÉE <span className={theme === 'galilee' ? 'text-cyan-500' : 'text-indigo-600'}>OS</span>
            </span>
        </div>
        <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all backdrop-blur-md border border-white/10
                ${theme === 'galilee' ? 'bg-black/40 text-cyan-400 hover:bg-cyan-900/30' : 'bg-white/40 text-indigo-600 hover:bg-white/60'}
            `}>
                {theme === 'galilee' ? t('mode_terminal') : t('mode_student')}
            </button>
            <button 
                onClick={onStart}
                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all transform hover:scale-105 backdrop-blur-md
                ${theme === 'galilee' 
                    ? 'bg-cyan-600/80 text-white hover:bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-400' 
                    : 'bg-indigo-600/90 text-white hover:bg-indigo-700 shadow-lg'}
            `}>
                Connexion
            </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-4 border backdrop-blur-sm
                ${theme === 'galilee' ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-400' : 'bg-white/50 border-indigo-200 text-indigo-600'}
            `}>
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme === 'galilee' ? 'bg-cyan-400' : 'bg-indigo-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${theme === 'galilee' ? 'bg-cyan-500' : 'bg-indigo-500'}`}></span>
                </span>
                SUITE ACADÉMIQUE 2025
            </div>

            <h1 className={`text-5xl md:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-2xl
                ${theme === 'galilee' ? 'font-tech text-white' : 'text-slate-900'}
            `}>
                Dominez vos <br/>
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme === 'galilee' ? 'from-cyan-400 to-blue-500' : 'from-indigo-600 to-violet-500'}`}>
                    Examens.
                </span>
            </h1>

            <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed drop-shadow-md
                ${theme === 'galilee' ? 'text-cyan-100/90 font-mono' : 'text-slate-700'}
            `}>
                {t('landing_subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <button 
                    onClick={onStart}
                    className={`group px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-3 relative overflow-hidden backdrop-blur-sm
                    ${theme === 'galilee' 
                        ? 'bg-cyan-500/10 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]' 
                        : 'bg-white/80 text-indigo-600 hover:bg-white shadow-xl hover:scale-105'}
                `}>
                    <span className="relative z-10">{t('landing_cta')}</span>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform relative z-10" />
                </button>
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
                icon={<Cpu size={32} />}
                title={t('view_projects')}
                desc="Tableau Kanban avancé pour organiser TPs et projets de groupe."
                theme={theme}
                delay={0}
            />
            <FeatureCard 
                icon={<Brain size={32} />}
                title={t('neural_training')}
                desc="Générez des Flashcards de révision instantanément grâce à Gemini 2.5."
                theme={theme}
                delay={150}
            />
            <FeatureCard 
                icon={<Zap size={32} />}
                title={t('hyperfocus')}
                desc="Minuteur Pomodoro holographique intégré pour des sessions de travail intense."
                theme={theme}
                delay={300}
            />
        </div>
      </section>

      <footer className={`relative z-10 py-6 text-center text-xs backdrop-blur-sm border-t border-white/5
        ${theme === 'galilee' ? 'text-slate-500' : 'text-slate-400'}
      `}>
        <p>© 2025 Université Sorbonne Paris Nord • Innovation Pédagogique</p>
      </footer>

    </div>
  );
};

const FeatureCard = ({ icon, title, desc, theme, delay }: { icon: React.ReactNode, title: string, desc: string, theme: string, delay: number }) => (
    <div 
        className={`p-8 rounded-2xl transition-all duration-300 group opacity-0 animate-fade-in-up backdrop-blur-md border border-white/10
        ${theme === 'galilee' 
            ? 'bg-slate-900/40 hover:bg-slate-900/60 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
            : 'bg-white/40 hover:bg-white/70 hover:shadow-xl hover:-translate-y-2'}
        `}
        style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
        <div className={`mb-6 p-4 rounded-xl w-fit
            ${theme === 'galilee' ? 'bg-cyan-900/30 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors' : 'bg-indigo-100/80 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors'}
        `}>
            {icon}
        </div>
        <h3 className={`text-xl font-bold mb-3 ${theme === 'galilee' ? 'text-cyan-50 font-tech' : 'text-slate-800'}`}>{title}</h3>
        <p className={`leading-relaxed ${theme === 'galilee' ? 'text-slate-300 font-mono text-sm' : 'text-slate-600'}`}>{desc}</p>
    </div>
);
