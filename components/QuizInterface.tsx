import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw, SkipForward, Eye, Check, BookOpenText } from 'lucide-react';
import { ChineseChar, Feedback } from '../types';

interface QuizInterfaceProps {
  character: ChineseChar;
  onCheck: (pinyin: string, meaning: string) => Feedback;
  onNext: () => void;
  onSkip: () => void;
  isRevealed: boolean;
  onReveal: () => void;
  isExampleRevealed: boolean;
  onRevealExample: () => void;
  feedback: Feedback | null;
  showAnswer: boolean;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({
  character,
  onCheck,
  onNext,
  onSkip,
  isRevealed,
  onReveal,
  isExampleRevealed,
  onRevealExample,
  feedback,
  showAnswer
}) => {
  const [pinyinInput, setPinyinInput] = useState('');
  const [meaningInput, setMeaningInput] = useState('');
  const meaningRef = useRef<HTMLInputElement>(null);

  // Focus meaningful input on new character load
  useEffect(() => {
    if (!showAnswer) {
      setPinyinInput('');
      setMeaningInput('');
      // Small timeout to ensure DOM is ready
      setTimeout(() => {
        meaningRef.current?.focus();
      }, 50);
    }
  }, [character, showAnswer]);

  const handleSubmit = () => {
    if (meaningInput && pinyinInput) {
      onCheck(pinyinInput, meaningInput);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (showAnswer) {
        onNext();
      } else {
        handleSubmit();
      }
    }
  };

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* Character Display Card */}
      <div className="relative bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl p-8 sm:p-14 text-center shadow-xl overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        {/* Character */}
        <div className="relative z-10">
          <div className="font-chinese text-8xl sm:text-9xl font-bold text-white mb-6 drop-shadow-xl transform transition-transform duration-500 hover:scale-105">
            {character.char}
          </div>

          {/* Answer Overlay (Partial or Full) */}
          <div className="space-y-3 min-h-[5rem]">
            {(isRevealed || showAnswer) && (
              <div className="animate-slideUp">
                <div className="inline-block bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 text-white border border-white/10 mx-2">
                  <span className="text-xl sm:text-2xl font-bold tracking-wider">{character.pinyin}</span>
                </div>
                {(showAnswer || isRevealed) && (
                  <div className="mt-3 text-lg sm:text-xl text-white/90 font-medium bg-black/20 inline-block px-4 py-1.5 rounded-lg">
                    {character.meaning}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Example Section (Expandable) */}
      {(isExampleRevealed || showAnswer) && character.example && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 animate-slideDown flex items-start gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
             <BookOpenText className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-indigo-500 uppercase tracking-wide mb-1">Ejemplo de uso</div>
            <div className="text-lg font-chinese font-bold text-gray-800">{character.example.chinese}</div>
            <div className="text-sm text-gray-600">{character.example.pinyin}</div>
            <div className="text-sm italic text-gray-500 mt-1">{character.example.meaning}</div>
          </div>
        </div>
      )}

      {!showAnswer ? (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 space-y-5">
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Significado (Español)
              </label>
              <input
                ref={meaningRef}
                type="text"
                value={meaningInput}
                onChange={(e) => setMeaningInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ej. persona"
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none text-lg text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Pinyin
              </label>
              <input
                type="text"
                value={pinyinInput}
                onChange={(e) => setPinyinInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ej. ren"
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none text-lg text-gray-800"
              />
              <p className="text-xs text-gray-400 mt-1">Puedes escribir sin tonos (ej. "wo" en lugar de "wǒ")</p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={!meaningInput || !pinyinInput}
              className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 active:scale-[0.98] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
            >
              <Check className="w-6 h-6" />
              Verificar Respuesta
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
             <button
              onClick={onRevealExample}
              className={`group flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 py-3 rounded-xl font-semibold transition-colors text-xs sm:text-sm ${
                isExampleRevealed ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              }`}
            >
              <BookOpenText className="w-4 h-4 sm:w-5 sm:h-5" />
              {isExampleRevealed ? 'Ocultar' : 'Ejemplo'}
            </button>

            <button
              onClick={onReveal}
              className={`group flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 py-3 rounded-xl font-semibold transition-colors text-xs sm:text-sm ${
                isRevealed ? 'bg-amber-100 text-amber-700' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
              }`}
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              {isRevealed ? 'Ocultar' : 'Pista'}
            </button>

            <button
              onClick={onSkip}
              className="group flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 py-3 bg-gray-50 text-gray-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-xs sm:text-sm"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              Saltar
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-fadeIn space-y-4">
          {feedback && (
            <div className={`p-6 rounded-2xl shadow-lg border-2 ${
              feedback.isCorrect 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {feedback.isCorrect ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600" />
                )}
                <span className="font-bold text-xl">
                  {feedback.isCorrect ? '¡Excelente!' : 'Casi...'}
                </span>
              </div>
              
              <div className="space-y-3 pl-1">
                <div className={`flex items-start gap-2 ${feedback.meaningCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  <span className="font-bold min-w-[6rem]">Significado:</span> 
                  <span>
                    {feedback.meaningCorrect ? 'Correcto' : `Incorrecto. Era "${character.meaning}"`}
                  </span>
                </div>
                <div className={`flex items-start gap-2 ${feedback.pinyinCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  <span className="font-bold min-w-[6rem]">Pinyin:</span>
                  <span>
                    {feedback.pinyinCorrect ? 'Correcto' : `Incorrecto. Era "${character.pinyin}"`}
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            autoFocus
            onClick={onNext}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-6 h-6" />
            Siguiente Carácter
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizInterface;