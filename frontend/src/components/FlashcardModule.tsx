import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import { db } from '../services/storage';
import type { Deck, DailyGoal } from '../types';
import { generateFlashcards } from '../services/geminiService';
import { audioManager, calculateSimilarity } from '../services/audioService';
import { generateDeckPDF } from '../services/pdfService';
import { Plus, Brain, ArrowLeft, RotateCw, Sparkles, Loader2, Trash2, BookOpen, Mic, Volume2, Award, Frown, Smile, Search, Target, Flame, LayoutGrid, FileText } from 'lucide-react';

// Curated Unsplash Images for Engineering Topics
const ENGINEERING_IMAGES = [
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
];

const getRandomCover = () => ENGINEERING_IMAGES[Math.floor(Math.random() * ENGINEERING_IMAGES.length)];

export const FlashcardModule: React.FC = () => {
    const { theme, t } = useTheme();
    const { user, updateUserXp } = useAuth();
    const [decks, setDecks] = useState<Deck[]>([]);
    const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loadingAI, setLoadingAI] = useState(false);
    
    // Goals State
    const [dailyGoal, setDailyGoal] = useState<DailyGoal>({ target: 20, progress: 0, lastUpdated: Date.now(), streak: 0 });
    const [showGoalEdit, setShowGoalEdit] = useState(false);
    
    // Voice & Audio
    const [isListening, setIsListening] = useState(false);
    const [spokenAnswer, setSpokenAnswer] = useState('');
    const [matchScore, setMatchScore] = useState<number | null>(null);

    // Create Mode
    const [showCreate, setShowCreate] = useState(false);
    const [newDeckTitle, setNewDeckTitle] = useState('');
    const [aiTopic, setAiTopic] = useState('');

    useEffect(() => {
        loadDecks();
        loadGoals();
    }, []);

    const loadDecks = async () => {
        const d = await db.getAllDecks();
        setDecks(d);
    };

    const loadGoals = async () => {
        const g = await db.getDailyGoal();
        setDailyGoal(g);
    };

    const updateProgress = async () => {
        const newProgress = dailyGoal.progress + 1;
        let newStreak = dailyGoal.streak;
        
        if (newProgress === dailyGoal.target) {
             newStreak += 1;
             audioManager.play('success', theme);
        }

        const updatedGoal = { ...dailyGoal, progress: newProgress, streak: newStreak };
        setDailyGoal(updatedGoal);
        await db.saveDailyGoal(updatedGoal);
    };

    const handleUpdateTarget = async (newTarget: number) => {
        const updated = { ...dailyGoal, target: newTarget };
        setDailyGoal(updated);
        await db.saveDailyGoal(updated);
        setShowGoalEdit(false);
    };

    const playSound = (type: 'hover' | 'click' | 'success' | 'error' | 'flip') => {
        audioManager.play(type, theme);
    };

    const handleCreateDeck = async () => {
        if (!newDeckTitle) return;
        playSound('click');
        const newDeck: Deck = {
            id: `deck-${Date.now()}`,
            title: newDeckTitle,
            subject: 'Général',
            coverUrl: getRandomCover(),
            cards: []
        };
        
        if (aiTopic) {
            setLoadingAI(true);
            try {
                const cards = await generateFlashcards(aiTopic);
                newDeck.cards = cards.map((c, i) => ({
                    id: `fc-${Date.now()}-${i}`,
                    question: c.question,
                    answer: c.answer,
                    difficulty: 'medium' as const,
                    easeFactor: 2.5,
                    streak: 0
                }));
                playSound('success');
            } catch {
                alert("Erreur IA");
            } finally {
                setLoadingAI(false);
            }
        }

        await db.saveDeck(newDeck);
        setDecks([...decks, newDeck]);
        setShowCreate(false);
        setNewDeckTitle('');
        setAiTopic('');
    };

    const deleteDeck = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if(confirm(t('confirm_action'))) {
            await db.deleteDeck(id);
            setDecks(prev => prev.filter(d => d.id !== id));
            if (activeDeck?.id === id) setActiveDeck(null);
        }
    }

    const speakText = (text: string) => {
        audioManager.speak(text);
    };

    const startListening = () => {
        if ('webkitSpeechRecognition' in window) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const SpeechRecognitionAPI = (window as any).webkitSpeechRecognition;
            const recognition = new SpeechRecognitionAPI();
            recognition.lang = 'fr-FR';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => setIsListening(true);
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setSpokenAnswer(transcript);
                
                const card = activeDeck?.cards[currentCardIndex];
                if (card) {
                    const score = calculateSimilarity(transcript, card.answer);
                    setMatchScore(Math.round(score * 100));
                    playSound(score > 0.6 ? 'success' : 'error');
                }
                setIsListening(false);
                if (!isFlipped) setIsFlipped(true);
            };

            recognition.onerror = () => setIsListening(false);
            recognition.onend = () => setIsListening(false);
            
            recognition.start();
        } else {
            alert("Navigateur non compatible avec la reconnaissance vocale.");
        }
    };

    const handleExportPDF = () => {
        if (activeDeck) {
            generateDeckPDF(activeDeck, user);
        }
    };

    const handleGrade = async () => {
        playSound('click');
        if (!activeDeck) return;
        
        await updateProgress();
        updateUserXp(5);

        setIsFlipped(false);
        setSpokenAnswer('');
        setMatchScore(null);
        setCurrentCardIndex((prev) => (prev + 1) % activeDeck.cards.length);
    };

    const isGalilee = theme === 'galilee';
    const progressPercent = Math.min((dailyGoal.progress / dailyGoal.target) * 100, 100);

    // RENDER: STUDY MODE
    if (activeDeck) {
        const card = activeDeck.cards[currentCardIndex];
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 relative">
                 <button 
                    onClick={() => { setActiveDeck(null); setCurrentCardIndex(0); setIsFlipped(false); }}
                    className={`absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors z-20 backdrop-blur-md border border-white/10
                        ${isGalilee ? 'text-cyan-400 bg-slate-900/50 hover:bg-cyan-900/30' : 'text-slate-600 bg-white/50 hover:bg-white'}`}
                    onMouseEnter={() => playSound('hover')}
                 >
                     <ArrowLeft size={20} /> {t('back')}
                 </button>

                 <button 
                    onClick={handleExportPDF}
                    className={`absolute top-4 left-36 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors z-20 backdrop-blur-md border border-white/10
                        ${isGalilee ? 'text-cyan-400 bg-slate-900/50 hover:bg-cyan-900/30' : 'text-slate-600 bg-white/50 hover:bg-white'}`}
                 >
                     <FileText size={20} /> {t('export_pdf')}
                 </button>

                 <div className={`absolute top-4 right-4 flex flex-col items-end gap-1 ${isGalilee ? 'text-cyan-600' : 'text-slate-400'}`}>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                         <span>{t('gali_strikes')}: {dailyGoal.progress}/{dailyGoal.target}</span>
                         {dailyGoal.progress >= dailyGoal.target && <Award size={14} className="text-yellow-500 animate-bounce" />}
                    </div>
                    <div className="w-32 h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-500 ${isGalilee ? 'bg-cyan-500' : 'bg-indigo-500'}`} style={{width: `${progressPercent}%`}}></div>
                    </div>
                 </div>

                 <div className="text-center mb-8 relative z-10">
                     <h2 className={`text-2xl font-bold mb-2 ${isGalilee ? 'font-tech text-cyan-50' : 'text-slate-800'}`}>{activeDeck.title}</h2>
                     <div className={`text-sm ${isGalilee ? 'text-cyan-600' : 'text-slate-500'}`}>
                         Carte {currentCardIndex + 1} / {activeDeck.cards.length}
                     </div>
                 </div>

                 {/* 3D FLIP CARD CONTAINER */}
                 <div className="perspective-1000 w-full max-w-2xl h-80 cursor-pointer group mb-8" onClick={() => { setIsFlipped(!isFlipped); playSound('flip'); }}>
                     <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                         
                         {/* FRONT */}
                         <div className={`absolute inset-0 backface-hidden rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-xl border relative overflow-hidden
                             ${isGalilee 
                                ? 'bg-slate-900/90 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]' 
                                : 'bg-white border-slate-200'}
                         `}>
                             <span className={`uppercase tracking-widest text-xs mb-6 ${isGalilee ? 'text-cyan-500' : 'text-indigo-400'}`}>{t('question')}</span>
                             <p className={`text-2xl font-medium mb-6 ${isGalilee ? 'text-white font-tech leading-relaxed' : 'text-slate-800'}`}>
                                 {card?.question || "Deck vide !"}
                             </p>
                             
                             <div className="flex gap-4 relative z-20" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => card && speakText(card.question)} className={`p-3 rounded-full transition-colors ${isGalilee ? 'bg-cyan-900/50 text-cyan-400 hover:bg-cyan-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                    <Volume2 size={20} />
                                </button>
                                <button onClick={startListening} className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-500 animate-pulse text-white' : (isGalilee ? 'bg-cyan-900/50 text-cyan-400 hover:bg-cyan-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}`}>
                                    <Mic size={20} />
                                </button>
                             </div>

                             <div className={`absolute bottom-6 right-6 opacity-50 text-xs flex items-center gap-2 ${isGalilee ? 'text-cyan-600' : 'text-slate-400'}`}>
                                 <RotateCw size={14}/> {t('reveal')}
                             </div>
                         </div>

                         {/* BACK */}
                         <div className={`absolute inset-0 backface-hidden rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-xl border rotate-y-180
                             ${isGalilee 
                                ? 'bg-cyan-900/20 border-cyan-400/50 backdrop-blur-md' 
                                : 'bg-indigo-50 border-indigo-200'}
                         `}>
                             <span className={`uppercase tracking-widest text-xs mb-4 ${isGalilee ? 'text-cyan-300' : 'text-indigo-500'}`}>{t('answer')}</span>
                             <p className={`text-xl mb-6 ${isGalilee ? 'text-cyan-50 font-mono' : 'text-slate-700'}`}>
                                 {card?.answer}
                             </p>

                             {spokenAnswer && (
                                 <div className={`mb-4 p-3 rounded border w-full text-sm ${matchScore && matchScore > 70 ? 'bg-green-500/20 border-green-500 text-green-700' : 'bg-red-500/20 border-red-500 text-red-700'}`}>
                                     <p className="font-bold text-xs uppercase opacity-70">{t('voice_feedback')} ({t('precision')}: {matchScore}%)</p>
                                     "{spokenAnswer}"
                                 </div>
                             )}

                             <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                 <button onClick={() => card && speakText(card.answer)} className={`p-2 rounded-full ${isGalilee ? 'text-cyan-400 hover:bg-cyan-800/30' : 'text-indigo-500 hover:bg-indigo-100'}`}>
                                    <Volume2 size={18} />
                                 </button>
                             </div>
                         </div>
                     </div>
                 </div>

                 {/* SRS CONTROLS */}
                 {isFlipped ? (
                     <div className="flex gap-4 animate-fade-in-up">
                         <SRSButton label={t('grade_fail')} color="red" icon={<Frown/>} onClick={() => handleGrade()} theme={theme} />
                         <SRSButton label={t('grade_hard')} color="orange" icon={<Brain/>} onClick={() => handleGrade()} theme={theme} />
                         <SRSButton label={t('grade_good')} color="blue" icon={<Smile/>} onClick={() => handleGrade()} theme={theme} />
                         <SRSButton label={t('grade_easy')} color="green" icon={<Award/>} onClick={() => handleGrade()} theme={theme} />
                     </div>
                 ) : (
                     <div className={`text-sm animate-pulse ${isGalilee ? 'text-cyan-600' : 'text-slate-400'}`}>
                         Répondez vocalement ou retournez la carte
                     </div>
                 )}
            </div>
        )
    }

    // RENDER: DECK GRID DASHBOARD
    return (
        <div className="h-full p-8 max-w-6xl mx-auto w-full overflow-y-auto custom-scrollbar flex flex-col">
            
            {/* Header + Goal Widget */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-opacity-20 pb-4 border-gray-500 gap-6">
                <div>
                    <h1 className={`text-4xl font-bold mb-2 flex items-center gap-3 ${isGalilee ? 'font-tech text-white' : 'text-slate-800'}`}>
                        <LayoutGrid size={32} className={isGalilee ? 'text-cyan-500' : 'text-indigo-500'} />
                        {t('neural_training')}
                    </h1>
                    <p className={`${isGalilee ? 'text-cyan-500/80 font-mono' : 'text-slate-500'}`}>
                        {t('select_module_prompt')}
                    </p>
                </div>
                
                {/* DAILY GOAL DASHBOARD */}
                <div className={`relative p-4 rounded-xl border flex items-center gap-4 min-w-[300px] group backdrop-blur-sm
                    ${isGalilee ? 'bg-slate-900/60 border-cyan-800' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                    
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                             <div className="flex items-center gap-2">
                                <Target size={16} className={isGalilee ? 'text-cyan-400' : 'text-indigo-500'}/>
                                <span className={`text-xs font-bold uppercase tracking-wider ${isGalilee ? 'text-cyan-100' : 'text-slate-700'}`}>
                                    {t('gali_strikes')}
                                </span>
                             </div>
                             <div className="flex items-center gap-2">
                                <span className={`text-xs font-mono ${isGalilee ? 'text-cyan-500' : 'text-slate-500'}`}>
                                    {dailyGoal.progress} / {dailyGoal.target}
                                </span>
                                <button onClick={() => setShowGoalEdit(!showGoalEdit)} className="p-1 hover:bg-slate-700/50 rounded"><Search size={10}/></button>
                             </div>
                        </div>
                        <div className="w-full h-2 bg-slate-700/30 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-700 ${progressPercent >= 100 ? 'bg-green-500' : (isGalilee ? 'bg-cyan-500' : 'bg-indigo-500')}`} style={{ width: `${progressPercent}%` }}></div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center pl-4 border-l border-slate-700/50">
                        <Flame size={20} className={`${dailyGoal.streak > 0 ? 'text-orange-500 animate-pulse' : 'text-slate-600'}`} />
                        <span className="text-xs font-bold mt-1">{dailyGoal.streak}j</span>
                    </div>

                    {showGoalEdit && (
                        <div className={`absolute top-full right-0 mt-2 p-3 rounded-lg border z-50 flex items-center gap-2 animate-fade-in-up
                            ${isGalilee ? 'bg-slate-900 border-cyan-700 shadow-[0_0_20px_rgba(0,0,0,0.5)] text-white' : 'bg-white border-slate-200 shadow-xl'}`}>
                            <span className="text-xs whitespace-nowrap">{t('target_label')}</span>
                            {[10, 20, 50].map(val => (
                                <button 
                                    key={val}
                                    onClick={() => handleUpdateTarget(val)}
                                    className={`px-2 py-1 text-xs rounded border ${dailyGoal.target === val ? 'bg-cyan-600 text-white border-cyan-500' : 'border-slate-600 hover:bg-slate-700'}`}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end mb-6">
                <button 
                    onClick={() => { setShowCreate(true); playSound('click'); }}
                    className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all transform hover:scale-105
                        ${isGalilee 
                            ? 'bg-cyan-900/30 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg'}`}
                >
                    <Plus size={18} /> {t('new_deck')}
                </button>
            </div>

            {/* CREATE MODAL INLINE */}
            {showCreate && (
                <div className={`mb-8 p-6 rounded-xl animate-fade-in-up border backdrop-blur-md ${isGalilee ? 'bg-slate-900/80 border-cyan-800' : 'bg-white/90 border-slate-200 shadow-lg'}`}>
                    <h3 className={`font-bold mb-4 ${isGalilee ? 'text-cyan-50' : 'text-slate-800'}`}>{t('deck_config')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input 
                            placeholder={t('deck_title')}
                            value={newDeckTitle}
                            onChange={e => setNewDeckTitle(e.target.value)}
                            className={`p-3 rounded-lg outline-none ${isGalilee ? 'bg-slate-950 border border-slate-700 text-white focus:border-cyan-500' : 'border border-slate-300'}`}
                        />
                        <div className="relative">
                            <input 
                                placeholder={t('deck_topic')}
                                value={aiTopic}
                                onChange={e => setAiTopic(e.target.value)}
                                className={`w-full p-3 rounded-lg outline-none ${isGalilee ? 'bg-slate-950 border border-slate-700 text-white focus:border-cyan-500' : 'border border-slate-300'}`}
                            />
                            <Sparkles size={16} className={`absolute right-3 top-3.5 ${aiTopic ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-slate-500 hover:text-slate-700">{t('cancel')}</button>
                        <button 
                            onClick={handleCreateDeck}
                            disabled={!newDeckTitle || loadingAI}
                            className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 ${isGalilee ? 'bg-cyan-600 text-white' : 'bg-indigo-600 text-white'}`}
                        >
                            {loadingAI ? <Loader2 className="animate-spin"/> : <Brain size={18} />}
                            {loadingAI ? t('ai_generating') : t('create_deck')}
                        </button>
                    </div>
                </div>
            )}

            {/* DECK GRID WITH IMAGES */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {decks.map(deck => (
                    <div 
                        key={deck.id}
                        onClick={() => { setActiveDeck(deck); playSound('click'); }}
                        onMouseEnter={() => playSound('hover')}
                        className={`group relative rounded-xl border cursor-pointer transition-all duration-300 hover:-translate-y-2 overflow-hidden h-64 flex flex-col justify-end
                            ${isGalilee 
                                ? 'bg-slate-900 border-cyan-900/50 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                                : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xl'}`}
                    >
                        {/* COVER IMAGE BACKGROUND */}
                        <div className="absolute inset-0 z-0">
                            {deck.coverUrl ? (
                                <img src={deck.coverUrl} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80" />
                            ) : (
                                <div className={`w-full h-full ${isGalilee ? 'bg-slate-800' : 'bg-slate-100'}`} />
                            )}
                            {/* Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t ${isGalilee ? 'from-slate-950 via-slate-900/50 to-transparent' : 'from-slate-900/80 via-transparent to-transparent'}`} />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 p-5">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded backdrop-blur-md
                                    ${isGalilee ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-800' : 'bg-white/20 text-white border border-white/20'}`}>
                                    {deck.subject}
                                </span>
                            </div>
                            
                            <h3 className={`font-bold text-xl mb-1 truncate leading-tight drop-shadow-md text-white ${isGalilee ? 'font-tech tracking-wide' : ''}`}>
                                {deck.title}
                            </h3>
                            
                            <div className="flex items-center gap-2 text-slate-300 text-xs mb-3">
                                <BookOpen size={14} /> {deck.cards.length} {t('cards_count')}
                            </div>

                            {/* Progress Bar */}
                            <div className="h-1 w-full rounded-full overflow-hidden bg-white/20 backdrop-blur-sm">
                                <div className={`h-full w-1/3 shadow-[0_0_10px_currentColor] ${isGalilee ? 'bg-cyan-400' : 'bg-indigo-400'}`}></div>
                            </div>
                        </div>

                        <button 
                            onClick={(e) => deleteDeck(e, deck.id)}
                            className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full transition-all backdrop-blur-md"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SRSButton = ({ label, color, icon, onClick, theme }: { label: string; color: string; icon: React.ReactNode; onClick: () => void; theme: string }) => {
    const isGalilee = theme === 'galilee';
    const colorClasses: Record<string, string> = {
        red: isGalilee ? 'bg-red-900/30 text-red-400 border-red-800 hover:bg-red-800' : 'bg-red-100 text-red-600 hover:bg-red-200',
        orange: isGalilee ? 'bg-orange-900/30 text-orange-400 border-orange-800 hover:bg-orange-800' : 'bg-orange-100 text-orange-600 hover:bg-orange-200',
        blue: isGalilee ? 'bg-blue-900/30 text-blue-400 border-blue-800 hover:bg-blue-800' : 'bg-blue-100 text-blue-600 hover:bg-blue-200',
        green: isGalilee ? 'bg-green-900/30 text-green-400 border-green-800 hover:bg-green-800' : 'bg-green-100 text-green-600 hover:bg-green-200',
    };

    return (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg border transition-all ${colorClasses[color]}`}
        >
            {icon}
            <span className="text-xs font-bold uppercase">{label}</span>
        </button>
    )
}
