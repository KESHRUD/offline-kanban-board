
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { User, Lock, ArrowRight, Terminal, ArrowLeft, Mail, Cpu, Zap, Radio, Microscope, Activity, GraduationCap } from 'lucide-react';
import { Logo } from './Logo';
import type { Speciality } from '../types';

interface LoginProps {
    onBack?: () => void;
}

const SPECIALITIES: { id: Speciality; icon: any; labelKey: string; color: string }[] = [
    { id: 'info', icon: Cpu, labelKey: 'spec_info', color: 'text-blue-400' },
    { id: 'energy', icon: Zap, labelKey: 'spec_energy', color: 'text-yellow-400' },
    { id: 'telecom', icon: Radio, labelKey: 'spec_telecom', color: 'text-purple-400' },
    { id: 'instrumentation', icon: Microscope, labelKey: 'spec_instru', color: 'text-cyan-400' },
    { id: 'macs', icon: Activity, labelKey: 'spec_macs', color: 'text-red-400' },
    { id: 'prepa', icon: GraduationCap, labelKey: 'spec_prepa', color: 'text-green-400' },
];

export const Login: React.FC<LoginProps> = ({ onBack }) => {
  const { login, register } = useAuth();
  const { theme, t } = useTheme();
  
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [speciality, setSpeciality] = useState<Speciality>('prepa');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    setIsLoading(true);

    if (isRegister) {
        await register({ username, email, speciality });
    } else {
        await login(username, 'local');
    }
    
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
      setIsGoogleLoading(true);
      await login('google_user', 'google');
      setIsGoogleLoading(false);
  }

  // GALILÉE THEME LOGIN
  if (theme === 'galilee') {
    return (
      <div className="min-h-screen w-full bg-slate-950 bg-grid flex items-center justify-center relative overflow-hidden scanline text-cyan-50 font-tech py-10">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/10 to-transparent pointer-events-none" />
        <div className="absolute top-10 left-10 text-cyan-800/50 text-xs font-mono animate-slide-in-right">
            ACCÈS TERMINAL SÉCURISÉ V.3.1.0<br/>
            PROTOCOLE INGÉNIERIE SUP GALILÉE
        </div>
        
        {onBack && (
            <button onClick={onBack} className="absolute top-8 left-8 z-20 text-cyan-600 hover:text-cyan-400 flex items-center gap-2 font-mono text-xs uppercase tracking-widest transition-colors animate-slide-in-right">
                <ArrowLeft size={14} /> {t('cancel')}
            </button>
        )}

        <div className="w-full max-w-2xl p-4 relative z-10 group perspective-1000 animate-scale-up">
            <div className="bg-slate-900/90 border-2 border-cyan-700 p-8 shadow-[0_0_30px_rgba(6,182,212,0.2)] relative overflow-hidden">
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        <Logo animated size="lg" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-[0.2em] text-cyan-100 mb-2">
                        {isRegister ? t('register_init').toUpperCase() : t('login_init').toUpperCase()}
                    </h1>
                    <p className="text-cyan-600 text-xs font-mono">
                         {isRegister ? 'CRÉATION NOUVEAU MATRICULE' : 'VEUILLEZ ENTRER VOS IDENTIFIANTS INGÉNIEUR'}
                    </p>
                </div>

                {isRegister && (
                    <div className="mb-6">
                        <label className="text-xs text-cyan-500 font-bold uppercase tracking-wider mb-3 block text-center">
                            {t('select_speciality')}
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {SPECIALITIES.map(spec => (
                                <button
                                    key={spec.id}
                                    type="button"
                                    onClick={() => setSpeciality(spec.id)}
                                    className={`p-3 border flex flex-col items-center gap-2 transition-all duration-300
                                        ${speciality === spec.id 
                                            ? 'bg-cyan-900/50 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-105' 
                                            : 'bg-slate-950/50 border-slate-700 opacity-60 hover:opacity-100 hover:border-cyan-700'
                                        }`}
                                >
                                    <spec.icon size={20} className={spec.color} />
                                    <span className="text-[10px] uppercase font-bold text-center leading-tight">{t(spec.labelKey)}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-4 max-w-md mx-auto">
                    {!isRegister && (
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isGoogleLoading || isLoading}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 py-3 font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                           <span>{t('login_google')}</span>
                        </button>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 text-cyan-100 p-3 font-mono focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.3)] outline-none transition-all placeholder-slate-800 text-sm"
                                placeholder={t('login_id_placeholder')}
                            />
                        </div>
                        
                        {isRegister && (
                            <div className="animate-fade-in-up">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 text-cyan-100 p-3 font-mono focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.3)] outline-none transition-all placeholder-slate-800 text-sm"
                                    placeholder={t('email_placeholder')}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || isGoogleLoading}
                            className="w-full bg-cyan-800/50 hover:bg-cyan-700 text-cyan-300 border border-cyan-600 py-3 font-bold uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 group-hover:bg-cyan-900"
                        >
                             {isLoading ? (
                                <span className="animate-pulse">{t('loading')}</span>
                            ) : (
                                <><span>{isRegister ? t('register_init') : t('login_init')}</span> <ArrowRight size={16} /></>
                            )}
                        </button>
                    </form>
                    
                    <button 
                        onClick={() => setIsRegister(!isRegister)}
                        className="w-full text-center text-xs text-cyan-600 hover:text-cyan-300 underline mt-4 uppercase tracking-widest"
                    >
                        {isRegister ? t('switch_to_login') : t('switch_to_register')}
                    </button>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // PRO THEME LOGIN
  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
      {onBack && (
            <button onClick={onBack} className="absolute top-8 left-8 text-slate-400 hover:text-indigo-600 flex items-center gap-2 text-sm font-medium transition-colors animate-slide-in-right">
                <ArrowLeft size={16} /> {t('back')}
            </button>
      )}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100 animate-fade-in-up">
        <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
                <Logo size="lg" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">{isRegister ? t('register_welcome') : t('login_welcome')}</h1>
            <p className="text-slate-500 text-sm mt-1">Galilée OS • Suite Académique</p>
        </div>

        {isRegister && (
            <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-slate-400 uppercase mb-3 block text-center">Spécialité</label>
                <div className="grid grid-cols-3 gap-2">
                    {SPECIALITIES.map(spec => (
                        <button
                            key={spec.id}
                            type="button"
                            onClick={() => setSpeciality(spec.id)}
                            className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all
                                ${speciality === spec.id 
                                    ? 'bg-white border-indigo-500 shadow-md text-indigo-600 ring-1 ring-indigo-500' 
                                    : 'border border-transparent hover:bg-white hover:shadow-sm text-slate-500'
                                }`}
                        >
                            <spec.icon size={18} />
                            <span className="text-[10px] font-bold text-center leading-tight">{t(spec.labelKey)}</span>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {!isRegister && (
            <button
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || isLoading}
                className="w-full mb-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-3 shadow-sm"
            >
                <span>{t('login_google')}</span>
            </button>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder={t('login_id_placeholder')}
                />
            </div>
            {isRegister && (
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder={t('email_placeholder')}
                    />
                </div>
            )}
            <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-indigo-200"
            >
                {isLoading ? t('loading') : (isRegister ? t('register_init') : t('login_init'))}
                {!isLoading && <ArrowRight size={18} />}
            </button>
        </form>

        <button 
            onClick={() => setIsRegister(!isRegister)}
            className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-6"
        >
            {isRegister ? t('switch_to_login') : t('switch_to_register')}
        </button>
      </div>
    </div>
  );
};
