import { motion } from 'framer-motion';
import { SavedReading, Lang } from '../types';
import { TRANSLATIONS } from '../constants';

interface HistoryViewProps {
  history: SavedReading[];
  lang: Lang;
  onSelectReading: (reading: SavedReading) => void;
}

export const HistoryView = ({
  history,
  lang,
  onSelectReading
}: HistoryViewProps) => {
  const t = TRANSLATIONS[lang];

  return (
    <motion.div key="hist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
      <h2 className="text-3xl text-yellow-100 tracking-widest mb-10 font-bold uppercase">{t.history}</h2>
      {history.length === 0 ? (
        <div className="text-center py-32 opacity-20 italic text-sm tracking-widest">NO VOICES FROM THE PAST...</div>
      ) : (
        <div className="space-y-8">
          {history.map((item) => (
            <div key={item.id} className="glass p-8 rounded-[2rem] border border-white/5 cursor-pointer hover:border-yellow-500/20 transition-all shadow-xl" onClick={() => onSelectReading(item)}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-2">{item.cards.map(c => <span key={c.id} className="text-2xl">{c.image}</span>)}</div>
                <span className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-bold">{new Date(item.timestamp).toLocaleDateString()}</span>
              </div>
              <h3 className="text-yellow-100 text-md font-semibold mb-3 line-clamp-1 italic">"{item.question}"</h3>
              <p className="text-[10px] text-yellow-500/60 uppercase tracking-widest font-bold">{TRANSLATIONS[item.lang].spreads[item.spreadType]}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
