import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint } from 'lucide-react';
import { RitualState, Lang } from '../types';
import { CardBack } from '../components/CardBack';
import { TRANSLATIONS } from '../constants';

interface DailyRitualViewProps {
  ritualStage: RitualState;
  lang: Lang;
  onStartDailyShuffle: () => void;
  onHandleFatedReveal: () => void;
}

export const DailyRitualView = ({
  ritualStage,
  lang,
  onStartDailyShuffle,
  onHandleFatedReveal
}: DailyRitualViewProps) => {
  const t = TRANSLATIONS[lang];

  return (
    <motion.div key="daily-ritual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-[85vh] flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      <AnimatePresence mode="wait">
        {ritualStage === 'START' ? (
          <motion.div key="d-start" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="flex flex-col items-center">
            <div className="relative mb-16">
               <motion.div 
                 animate={{ rotate: 360 }} 
                 transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                 className="w-64 h-64 border border-yellow-500/10 rounded-full flex items-center justify-center"
               >
                 <div className="absolute inset-0 border-t-2 border-yellow-500/20 rounded-full"></div>
                 <div className="absolute inset-12 border border-white/5 rounded-full"></div>
               </motion.div>
               <motion.div 
                 initial={{ y: 0 }} 
                 animate={{ y: [-15, 15, -15] }} 
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute inset-0 flex items-center justify-center"
               >
                 <div className="w-32 h-48 relative scale-110">
                   <CardBack glow={true} />
                 </div>
               </motion.div>
            </div>
            <h2 className="text-4xl text-yellow-100 tracking-[0.5em] mb-4 uppercase font-bold">{t.daily}</h2>
            <p className="text-gray-400 text-xs max-w-xs mb-14 leading-relaxed italic opacity-60 px-4">
              {lang === 'zh' ? '在星辰的注视下静心。开启今日的命运指引。' : 'Meditate under the stars. Unlock today\'s fated insight.'}
            </p>
            <button onClick={onStartDailyShuffle} className="glass group px-16 py-6 rounded-full text-yellow-500 border border-yellow-500/40 uppercase tracking-[0.6em] font-bold active:scale-95 shadow-2xl transition-all hover:bg-yellow-500/5">
              {t.daily_shuffle}
            </button>
          </motion.div>
        ) : ritualStage === 'SHUFFLE' ? (
          <motion.div key="d-shuffle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
            <div className="relative w-72 h-72 flex items-center justify-center">
               {[...Array(8)].map((_, i) => (
                 <motion.div
                   key={i}
                   animate={{ 
                     x: i % 2 === 0 ? [0, 120, -120, 0] : [0, -120, 120, 0],
                     y: [0, -50, 50, 0],
                     rotate: i % 2 === 0 ? [0, 30, -30, 0] : [0, -30, 30, 0],
                     scale: [1, 1.1, 0.9, 1],
                     zIndex: [0, 10, 0, 0]
                   }}
                   transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
                   className="absolute w-32 h-48"
                 >
                   <CardBack />
                 </motion.div>
               ))}
               <motion.div 
                 animate={{ opacity: [0, 0.6, 0] }}
                 transition={{ duration: 0.8, repeat: Infinity }}
                 className="absolute inset-0 bg-yellow-500/10 rounded-full blur-[100px]"
               ></motion.div>
            </div>
            <p className="text-yellow-500 font-bold tracking-[0.8em] text-xs uppercase mt-20 animate-pulse">{lang === 'zh' ? '正在连接星辰...' : 'LINKING TO THE STARS...'}</p>
          </motion.div>
        ) : (
          <motion.div key="d-fated" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center">
            <h2 className="text-xl text-yellow-100 tracking-[0.4em] font-bold uppercase mb-16">{t.daily_pick}</h2>
            <motion.div 
              whileTap={{ scale: 0.95 }}
              onClick={onHandleFatedReveal}
              className="relative w-48 h-72 cursor-pointer group"
            >
              <CardBack glow={true} animate={true} />
              <motion.div 
                animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-10 bg-yellow-500/5 rounded-[3rem] blur-3xl pointer-events-none"
              ></motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-4 rounded-full border border-yellow-500/20 bg-black/40 backdrop-blur-md group-hover:border-yellow-500/50 transition-all">
                  <Fingerprint className="w-10 h-10 text-yellow-500/60 group-hover:text-yellow-500/90" />
                </div>
              </div>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="text-yellow-500/80 font-bold tracking-[0.5em] text-[10px] uppercase mt-16 px-6 py-3 glass rounded-full border border-yellow-500/10"
            >
              {t.daily_hint}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
