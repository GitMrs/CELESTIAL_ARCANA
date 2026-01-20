import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
import { SpreadType, Lang } from '../types';
import { TRANSLATIONS } from '../constants';

interface HomeViewProps {
  question: string;
  spreadType: SpreadType;
  error: string | null;
  lang: Lang;
  onQuestionChange: (value: string) => void;
  onSpreadTypeChange: (type: SpreadType) => void;
  onStartDivination: () => void;
}

export const HomeView = ({
  question,
  spreadType,
  error,
  lang,
  onQuestionChange,
  onSpreadTypeChange,
  onStartDivination
}: HomeViewProps) => {
  const t = TRANSLATIONS[lang];

  return (
    <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center pt-20 pb-24 px-6">
      <div className="text-center mb-10">
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 5, repeat: Infinity }}>
          <Sparkles className="w-16 h-16 text-yellow-500 mb-6 mx-auto" />
        </motion.div>
        <h1 className="text-5xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 to-yellow-600 uppercase mb-4">{t.title}</h1>
        <p className="text-purple-300 text-[10px] tracking-[0.4em] uppercase opacity-50">{t.subtitle}</p>
      </div>
      <div className="w-full max-w-md glass p-8 rounded-[2.5rem] card-glow border border-white/5 shadow-2xl">
        <label className="block text-yellow-100/40 text-[10px] uppercase tracking-[0.3em] mb-4 font-bold">{t.seek}</label>
        <textarea
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          placeholder={t.placeholder}
          className="w-full h-32 bg-black/40 border border-purple-500/20 rounded-2xl p-6 text-yellow-50 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 transition-all resize-none shadow-inner"
        />
        <div className="mt-8 grid grid-cols-3 gap-3">
          {(['SINGLE', 'THREE_CARD', 'RELATIONSHIP'] as SpreadType[]).map((type) => (
            <button
              key={type}
              onClick={() => onSpreadTypeChange(type)}
              className={`py-3 px-1 rounded-xl text-[9px] uppercase tracking-widest transition-all border font-bold ${spreadType === type ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'border-white/5 text-gray-500'}`}
            >
              {t.spreads[type]}
            </button>
          ))}
        </div>
        <div className="h-6 mt-4 text-center">
          {error && <p className="text-red-400 text-[10px] animate-pulse uppercase tracking-widest">{error}</p>}
        </div>
        <button onClick={onStartDivination} className="w-full mt-2 bg-gradient-to-r from-[#2D0B5A] to-[#1a0b2e] text-yellow-100 font-bold py-5 rounded-2xl flex items-center justify-center gap-3 border border-yellow-500/30 active:scale-95 transition-all shadow-2xl hover:border-yellow-500/60">
          {t.consult} <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
