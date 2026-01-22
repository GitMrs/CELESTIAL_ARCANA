import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, ChevronDown, Star, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { SpreadType, Lang } from '../types';
import { TRANSLATIONS, ZODIACS, ELEMENT_STYLES } from '../constants';

interface HomeViewProps {
  question: string;
  spreadType: SpreadType;
  error: string | null;
  lang: Lang;
  onQuestionChange: (value: string) => void;
  onSpreadTypeChange: (type: SpreadType) => void;
  onStartDivination: (zodiac?: any) => void;
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
  const [isZodiacExpanded, setIsZodiacExpanded] = useState(false);
  const [selectedZodiac, setSelectedZodiac] = useState<any>(null);

  return (
    <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center pt-2 pb-2 px-6">
      <div className="text-center mb-10">
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 8, repeat: Infinity }}>
          <Sparkles className="w-14 h-14 text-yellow-500 mb-6 mx-auto opacity-70" />
        </motion.div>
        <h1 className="text-4xl font-bold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-b from-yellow-50 via-yellow-400 to-yellow-800 uppercase mb-4">{t.title}</h1>
        <p className="text-purple-300 text-[10px] tracking-[0.5em] uppercase opacity-40 italic">{t.subtitle}</p>
      </div>
      <div className="w-full max-w-lg glass p-8 rounded-[3.5rem] border border-white/5 shadow-2xl space-y-6">
        <div className="relative">
          <div className="flex justify-between items-center mb-6 px-4">
            <div className="flex flex-col">
              <h3 className="text-yellow-100/40 text-[10px] uppercase tracking-[0.4em] font-bold mb-1">{lang === 'zh' ? '选择星座' : 'Zodiac Select'}</h3>
              <p className="text-[9px] text-gray-600 tracking-[0.2em] italic uppercase">{lang === 'zh' ? '选择你的星座以增强共鸣' : 'Select your zodiac to enhance resonance'}</p>
            </div>
            <button onClick={() => setIsZodiacExpanded(!isZodiacExpanded)} className="flex items-center gap-2 py-2 px-4 rounded-full bg-white/5 border border-white/10 text-yellow-500">
              <span className="text-[9px] font-black uppercase">{isZodiacExpanded ? (lang === 'zh' ? '收起' : 'Collapse') : (lang === 'zh' ? '展开' : 'Expand')}</span>
              <motion.div animate={{ rotate: isZodiacExpanded ? 180 : 0 }}><ChevronDown className="w-3 h-3" /></motion.div>
            </button>
          </div>
          
          <motion.div initial={false} animate={{ height: isZodiacExpanded ? 'auto' : (selectedZodiac ? '82px' : '66px') }} className="overflow-hidden">
            <AnimatePresence mode="wait">
              {!isZodiacExpanded ? (
                <motion.div key="collapsed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center justify-center gap-4 py-2">
                  {selectedZodiac ? (
                    <div onClick={() => setIsZodiacExpanded(true)} className="w-full flex items-center justify-between p-4 rounded-3xl border cursor-pointer hover:bg-white/5" style={{ borderColor: ELEMENT_STYLES[selectedZodiac.element].border, backgroundColor: ELEMENT_STYLES[selectedZodiac.element].bg }}>
                      <div className="flex items-center gap-4">
                        <span className="text-4xl" style={{ color: ELEMENT_STYLES[selectedZodiac.element].color }}>{selectedZodiac.icon}</span>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-yellow-50 uppercase">{lang === 'zh' ? selectedZodiac.zh : selectedZodiac.name}</span>
                          <span className="text-[9px] font-bold uppercase tracking-tight" style={{ color: ELEMENT_STYLES[selectedZodiac.element].color }}>{selectedZodiac.element}</span>
                        </div>
                      </div>
                      <RefreshCw className="w-4 h-4 text-white/20" />
                    </div>
                  ) : (
                    <button onClick={() => setIsZodiacExpanded(true)} className="w-full h-14 border border-dashed border-white/20 rounded-full flex items-center justify-center gap-3 text-gray-500 group">
                      <Star className="w-4 h-4 group-hover:rotate-45" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.4em]">{lang === 'zh' ? '开启星象共鸣' : 'START COSMIC RESONANCE'}</span>
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div key="expanded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-4 gap-4 px-2 py-4">
                  {ZODIACS.map((z, idx) => {
                    const isSelected = selectedZodiac?.name === z.name;
                    const style = ELEMENT_STYLES[z.element];
                    return (
                      <motion.button key={idx} whileTap={{ scale: 0.95 }} onClick={() => { setSelectedZodiac(isSelected ? null : z); setIsZodiacExpanded(false); }} className="relative flex flex-col items-center justify-center py-4 rounded-3xl border border-white/5 bg-white/5 overflow-hidden" animate={{ borderColor: isSelected ? style.border : 'rgba(255,255,255,0.05)', backgroundColor: isSelected ? style.bg : 'rgba(255,255,255,0.05)' }}>
                        <span className="text-2xl mb-2" style={{ color: isSelected ? style.color : 'rgba(107,114,128,0.6)' }}>{z.icon}</span>
                        <span className="text-[8px] font-bold uppercase" style={{ color: isSelected ? style.color : 'rgba(75,85,99,1)' }}>{lang === 'zh' ? z.zh.replace('座', '') : z.name.slice(0, 3)}</span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        <div>
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
          <button onClick={() => onStartDivination(selectedZodiac)} className="w-full mt-2 bg-gradient-to-r from-[#2D0B5A] to-[#1a0b2e] text-yellow-100 font-bold py-5 rounded-2xl flex items-center justify-center gap-3 border border-yellow-500/30 active:scale-95 transition-all shadow-2xl hover:border-yellow-500/60">
            {t.consult} <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
