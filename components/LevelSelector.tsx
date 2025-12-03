import React from 'react';
import { Target, Info } from 'lucide-react';

interface LevelSelectorProps {
  onSelectLevel: (level: number) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ onSelectLevel }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto animate-fadeIn">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-10 w-full border border-gray-100">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Target className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
              Selecciona tu Nivel
            </h1>
          </div>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">
            Elige un nivel de dificultad para comenzar. Cada nivel desbloquea 10 nuevos caracteres de uso frecuente.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => {
            const charCount = level * 10;
            // Progressive color scheme
            const colors = [
              'from-emerald-400 to-emerald-600 shadow-emerald-200',
              'from-teal-400 to-teal-600 shadow-teal-200',
              'from-cyan-500 to-blue-500 shadow-cyan-200',
              'from-blue-500 to-indigo-500 shadow-blue-200',
              'from-indigo-500 to-purple-500 shadow-indigo-200',
              'from-purple-500 to-fuchsia-600 shadow-purple-200',
              'from-fuchsia-500 to-pink-600 shadow-pink-200',
              'from-pink-500 to-rose-600 shadow-rose-200',
              'from-rose-500 to-red-600 shadow-rose-200',
              'from-red-600 to-orange-600 shadow-orange-200'
            ];

            return (
              <button
                key={level}
                onClick={() => onSelectLevel(level)}
                className={`
                  relative overflow-hidden group
                  bg-gradient-to-br ${colors[level - 1]} 
                  text-white p-6 rounded-2xl 
                  hover:scale-105 hover:-translate-y-1 
                  transition-all duration-300 
                  shadow-lg hover:shadow-xl
                  flex flex-col items-center justify-center
                  border border-white/10
                `}
              >
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="text-4xl font-bold">{level}</span>
                </div>
                <div className="text-3xl font-bold mb-1 drop-shadow-md">Nivel {level}</div>
                <div className="text-xs font-medium bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
                  {charCount} chars
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 bg-blue-50 rounded-2xl p-6 border border-blue-100 flex gap-4 items-start">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-blue-900 mb-2">Cómo funcionan los niveles</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span><strong>Nivel 1:</strong> Los 10 caracteres básicos esenciales.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span><strong>Nivel X:</strong> Incluye los caracteres de niveles anteriores + 10 nuevos.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span><strong>Nivel 10:</strong> Dominio de los 100 caracteres más frecuentes.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelSelector;