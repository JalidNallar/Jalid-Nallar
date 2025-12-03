import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, RefreshCw, BarChart3, ArrowLeft, Flame, PenTool, LayoutDashboard } from 'lucide-react';
import { CHINESE_CHARACTERS } from './constants';
import { ChineseChar, Feedback, Score } from './types';
import LevelSelector from './components/LevelSelector';
import QuizInterface from './components/QuizInterface';
import StatsModal from './components/StatsModal';
import WritingPractice from './components/WritingPractice';

type AppMode = 'quiz' | 'writing';

export default function ChineseLearningApp() {
  // App Mode State
  const [mode, setMode] = useState<AppMode>('quiz');

  // Game State
  const [difficulty, setDifficulty] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChar, setCurrentChar] = useState<ChineseChar | null>(null);
  
  // Logic State
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isPinyinRevealed, setIsPinyinRevealed] = useState(false);
  const [isExampleRevealed, setIsExampleRevealed] = useState(false);
  
  // Stats State
  const [score, setScore] = useState<Score>({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Helper to normalize strings (remove accents/tones)
  const normalizeString = (str: string) => {
    return str.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const getCharactersForLevel = useCallback((level: number) => {
    const count = level * 10;
    return CHINESE_CHARACTERS.slice(0, count);
  }, []);

  const loadNewCharacter = useCallback(() => {
    const availableChars = getCharactersForLevel(difficulty);
    // Simple random selection.
    const randomIndex = Math.floor(Math.random() * availableChars.length);
    setCurrentChar(availableChars[randomIndex]);
    
    // Reset Round State
    setFeedback(null);
    setShowAnswer(false);
    setIsPinyinRevealed(false);
    setIsExampleRevealed(false);
  }, [difficulty, getCharactersForLevel]);

  // Start game when difficulty is selected
  const startGame = (level: number) => {
    setDifficulty(level);
    setIsPlaying(true);
    setScore({ correct: 0, total: 0 });
    setStreak(0);
    setTimeout(() => loadNewCharacter(), 0);
  };

  const returnToMenu = () => {
    setIsPlaying(false);
    setCurrentChar(null);
  };

  const checkAnswer = (pinyinInput: string, meaningInput: string) => {
    if (!currentChar) return feedback;

    // Meaning Check: Split by '/' and check if input matches any part
    const meaningParts = currentChar.meaning.split('/').map(p => p.trim());
    const meaningCorrect = meaningParts.some(part => 
      normalizeString(meaningInput).includes(normalizeString(part)) ||
      normalizeString(part).includes(normalizeString(meaningInput))
    );

    // Pinyin Check: Allow exact match OR match without tones
    const normalizedInput = normalizeString(pinyinInput);
    const normalizedTarget = normalizeString(currentChar.pinyin);
    
    // Check strict (with tones) OR loose (without tones)
    const pinyinCorrect = 
      pinyinInput.trim().toLowerCase() === currentChar.pinyin.toLowerCase() ||
      normalizedInput === normalizedTarget;

    const isCorrect = meaningCorrect && pinyinCorrect;

    const newFeedback: Feedback = {
      isCorrect,
      meaningCorrect,
      pinyinCorrect
    };

    setFeedback(newFeedback);
    
    // Update Stats
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
    } else {
      setStreak(0);
    }

    setShowAnswer(true);
    return newFeedback;
  };

  const handleSkip = () => {
    setScore(prev => ({ ...prev, total: prev.total + 1 }));
    setStreak(0);
    loadNewCharacter();
  };

  // Main Layout
  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 sm:py-10 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-8 animate-slideDown gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            {isPlaying && mode === 'quiz' && (
              <button 
                onClick={returnToMenu}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-1"
                aria-label="Volver al menú"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
            )}
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-red-200 shadow-lg shrink-0">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight">Hanzi Master</h1>
              {isPlaying && mode === 'quiz' && (
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <span>Nivel {difficulty}</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>{difficulty * 10} Caracteres</span>
                </div>
              )}
            </div>
          </div>

          {/* Mode Switcher Navigation */}
          <div className="flex p-1 bg-white border border-gray-200 rounded-xl shadow-sm w-full md:w-auto">
            <button
              onClick={() => setMode('quiz')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === 'quiz' 
                  ? 'bg-red-50 text-red-600 shadow-sm ring-1 ring-red-100' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Vocabulario
            </button>
            <div className="w-px bg-gray-200 my-1 mx-1"></div>
            <button
              onClick={() => setMode('writing')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === 'writing' 
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-100' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <PenTool className="w-4 h-4" />
              Escritura
            </button>
          </div>

          {/* Quiz Specific Controls */}
          {isPlaying && mode === 'quiz' && (
            <div className="flex items-center gap-2 absolute top-20 right-4 md:static">
              <button
                onClick={() => setShowStatsModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Stats</span>
              </button>
              
              <button
                onClick={() => {
                  setScore({correct: 0, total: 0});
                  setStreak(0);
                  loadNewCharacter();
                }}
                className="p-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
                title="Reiniciar Sesión"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </header>

        {/* Content Area */}
        <main className="flex-grow flex flex-col items-center w-full">
          
          {mode === 'writing' ? (
            <WritingPractice initialLevel={difficulty} />
          ) : (
            // Quiz Mode Container
            <div className="w-full max-w-2xl">
              {!isPlaying ? (
                <LevelSelector onSelectLevel={startGame} />
              ) : (
                <>
                  {/* Streak Badge */}
                  {streak >= 3 && (
                    <div className="mb-6 flex justify-center animate-bounceIn">
                      <div className="bg-orange-100 border border-orange-200 text-orange-700 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                        <Flame className="w-4 h-4 fill-current" />
                        <span className="font-bold text-sm">¡Racha de {streak}!</span>
                      </div>
                    </div>
                  )}

                  {/* Quiz Card */}
                  {currentChar && (
                    <QuizInterface
                      character={currentChar}
                      onCheck={checkAnswer}
                      onNext={loadNewCharacter}
                      onSkip={handleSkip}
                      isRevealed={isPinyinRevealed}
                      onReveal={() => setIsPinyinRevealed(!isPinyinRevealed)}
                      isExampleRevealed={isExampleRevealed}
                      onRevealExample={() => setIsExampleRevealed(!isExampleRevealed)}
                      feedback={feedback}
                      showAnswer={showAnswer}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </main>
        
        {/* Footer */}
        <footer className="mt-8 text-center text-gray-400 text-sm py-4 border-t border-gray-100">
          <p>© {new Date().getFullYear()} Hanzi Master • Aprende chino paso a paso</p>
        </footer>
      </div>

      {/* Stats Modal */}
      <StatsModal 
        isOpen={showStatsModal} 
        onClose={() => setShowStatsModal(false)} 
        score={score}
        streak={streak}
        maxStreak={maxStreak}
      />
    </div>
  );
}