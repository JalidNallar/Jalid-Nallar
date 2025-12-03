import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, PenTool, EyeOff, Eye, ChevronRight, ChevronLeft } from 'lucide-react';
import { ChineseChar } from '../types';
import { CHINESE_CHARACTERS } from '../constants';

interface WritingPracticeProps {
  initialLevel?: number;
}

const WritingPractice: React.FC<WritingPracticeProps> = ({ initialLevel = 1 }) => {
  const [selectedLevel, setSelectedLevel] = useState(initialLevel);
  const [selectedChar, setSelectedChar] = useState<ChineseChar>(CHINESE_CHARACTERS[0]);
  const writerRef = useRef<any>(null);
  const charDivRef = useRef<HTMLDivElement>(null);
  const [isWriterLoading, setIsWriterLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState('Observa la animación o intenta escribir.');

  // Filtering characters by level
  const levelChars = CHINESE_CHARACTERS.slice((selectedLevel - 1) * 10, selectedLevel * 10);

  useEffect(() => {
    if (levelChars.length > 0 && !levelChars.find(c => c.char === selectedChar.char)) {
      setSelectedChar(levelChars[0]);
    }
  }, [selectedLevel]);

  useEffect(() => {
    if (!charDivRef.current || !window.HanziWriter) return;

    setIsWriterLoading(true);
    if (charDivRef.current) {
        charDivRef.current.innerHTML = ''; // Clean previous
    }

    try {
      const writer = window.HanziWriter.create(charDivRef.current, selectedChar.char, {
        width: 300,
        height: 300,
        padding: 5,
        showOutline: true,
        strokeAnimationSpeed: 1, // 1x normal speed
        delayBetweenStrokes: 200, // ms
        radicalsColor: '#166534', // green-800
        strokeColor: '#000000',
        drawingWidth: 20, // thicker lines for easier drawing
        showCharacter: true,
        showHintAfterMisses: 1,
        highlightOnVariation: true,
      });

      writerRef.current = writer;
      
      // Auto-animate once on load
      writer.animateCharacter({
          onComplete: () => {
             setIsWriterLoading(false);
          }
      });
      setIsWriterLoading(false);

    } catch (error) {
      console.error("Error loading HanziWriter", error);
      setIsWriterLoading(false);
      setFeedbackMsg("Error cargando el carácter. Verifica tu conexión.");
    }

  }, [selectedChar]);

  const animate = () => {
    if (writerRef.current) {
      setFeedbackMsg('Observando orden de trazos...');
      writerRef.current.animateCharacter();
    }
  };

  const startQuiz = () => {
    if (writerRef.current) {
      setFeedbackMsg('¡Tu turno! Dibuja el carácter.');
      writerRef.current.quiz({
        onMistake: function(strokeData: any) {
          setFeedbackMsg('¡Ups! Trazo incorrecto. Intenta de nuevo.');
        },
        onCorrectStroke: function(strokeData: any) {
          setFeedbackMsg(`¡Bien! Trazo ${strokeData.strokeNum + 1} correcto.`);
        },
        onComplete: function(summaryData: any) {
          setFeedbackMsg('¡Excelente! Has completado el carácter. 🎉');
        }
      });
    }
  };

  const toggleOutline = () => {
    if (writerRef.current) {
      // Toggle logic usually requires checking state, but HanziWriter doesn't expose 'isShowOutline'.
      // We will force hide/show based on internal toggle logic if needed, 
      // but simpler is to just hide/show content.
      // HanziWriter API method: hideOutline() / showOutline()
      // Let's rely on buttons.
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn pb-10">
      
      {/* Level Selector Bar */}
      <div className="flex overflow-x-auto pb-4 gap-2 mb-6 scrollbar-hide">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
          <button
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
              selectedLevel === level
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-indigo-50'
            }`}
          >
            Nivel {level}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Character List Sidebar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 lg:h-[500px] overflow-y-auto">
          <h3 className="font-bold text-gray-700 mb-4 px-2">Selecciona un carácter</h3>
          <div className="grid grid-cols-4 lg:grid-cols-3 gap-3">
            {levelChars.map((char) => (
              <button
                key={char.char}
                onClick={() => setSelectedChar(char)}
                className={`aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all ${
                  selectedChar.char === char.char
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl font-chinese font-bold">{char.char}</span>
                <span className="text-[10px] mt-1 opacity-70">{char.pinyin}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Writing Area */}
        <div className="lg:col-span-2 flex flex-col items-center">
          
          {/* Card Header Info */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-1">{selectedChar.pinyin}</h2>
            <p className="text-gray-500 text-lg capitalize">{selectedChar.meaning}</p>
          </div>

          {/* Canvas Container */}
          <div className="relative bg-white p-2 rounded-3xl shadow-xl border-4 border-indigo-100 mb-6">
            <div className="writing-grid w-[300px] h-[300px] rounded-2xl overflow-hidden relative">
               <div ref={charDivRef} className="w-full h-full cursor-crosshair" />
               
               {isWriterLoading && (
                 <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                   <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                 </div>
               )}
            </div>
            
            {/* Status Feedback */}
            <div className="absolute -bottom-12 left-0 right-0 text-center">
               <span className="bg-indigo-900 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                 {feedbackMsg}
               </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button
              onClick={animate}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm active:scale-95"
            >
              <Play className="w-5 h-5 text-indigo-500" />
              Ver Trazos
            </button>

            <button
              onClick={startQuiz}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 active:scale-95"
            >
              <PenTool className="w-5 h-5" />
              Practicar (Dibujar)
            </button>
            
            <div className="w-px h-10 bg-gray-200 mx-2 hidden sm:block"></div>

            <button
               onClick={() => writerRef.current?.hideOutline()}
               className="p-3 text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
               title="Ocultar guías"
            >
              <EyeOff className="w-5 h-5" />
            </button>
             <button
               onClick={() => writerRef.current?.showOutline()}
               className="p-3 text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
               title="Mostrar guías"
            >
              <Eye className="w-5 h-5" />
            </button>

          </div>

          {/* Example Sentence Context */}
          {selectedChar.example && (
             <div className="mt-10 bg-indigo-50 rounded-xl p-6 w-full max-w-lg border border-indigo-100 text-center">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Ejemplo</p>
                <p className="text-xl font-chinese font-medium text-indigo-900 mb-1">{selectedChar.example.chinese}</p>
                <p className="text-sm text-indigo-700 mb-1">{selectedChar.example.pinyin}</p>
                <p className="text-sm text-indigo-600 italic">"{selectedChar.example.meaning}"</p>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default WritingPractice;