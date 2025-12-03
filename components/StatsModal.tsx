import React from 'react';
import { Award, X } from 'lucide-react';
import { Score } from '../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: Score;
  streak: number;
  maxStreak: number;
}

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, score, streak, maxStreak }) => {
  if (!isOpen) return null;

  const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm relative z-10 animate-bounceIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-100 rounded-2xl">
            <Award className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Estadísticas</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatBox label="Correctas" value={score.correct} color="text-green-600" bg="bg-green-50" />
          <StatBox label="Incorrectas" value={score.total - score.correct} color="text-red-600" bg="bg-red-50" />
          <StatBox label="Racha Actual" value={streak} color="text-orange-600" bg="bg-orange-50" />
          <StatBox label="Mejor Racha" value={maxStreak} color="text-purple-600" bg="bg-purple-50" />
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <div className="text-sm text-gray-500 mb-1">Precisión Total</div>
            <div className="text-4xl font-black text-gray-800">{percentage}%</div>
            <div className="w-full bg-gray-100 h-3 rounded-full mt-3 overflow-hidden">
                <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, color, bg }: { label: string, value: number, color: string, bg: string }) => (
  <div className={`${bg} rounded-2xl p-4 text-center`}>
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">{label}</div>
  </div>
);

export default StatsModal;