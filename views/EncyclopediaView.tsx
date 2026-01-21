import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Lang, TarotCard } from '../types';
import { TRANSLATIONS, TAROT_CARDS } from '../constants';
interface EncyclopediaViewProps {
  searchQuery: string;
  lang: Lang;
  onSearchChange: (value: string) => void;
}

export const EncyclopediaView = ({
  searchQuery,
  lang,
  onSearchChange
}: EncyclopediaViewProps) => {
  const t = TRANSLATIONS[lang];

  const filteredCards: TarotCard[] = TAROT_CARDS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.nameZh.includes(searchQuery));

  return (
    <motion.div key="ency" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
      <h2 className="text-3xl text-yellow-100 tracking-widest mb-10 font-bold uppercase">{t.encyclopedia}</h2>
      <div className="relative mb-12">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input 
          value={searchQuery} 
          onChange={(e) => onSearchChange(e.target.value)} 
          placeholder={t.search_cards} 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500/50" 
        />
      </div>
      <div className="grid grid-cols-2 gap-6">
        {filteredCards.map(card => (
          <div key={card.id} className="glass p-6 rounded-3xl border border-white/5 flex flex-col items-center hover:border-yellow-500/30 transition-all group shadow-lg">
            <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">{card.image}</span>
            <h3 className="text-xs font-bold text-yellow-200 text-center uppercase tracking-widest">{lang === 'zh' ? card.nameZh : card.name}</h3>
            <p className="text-[10px] text-gray-500 text-center mt-3 italic leading-relaxed">{lang === 'zh' ? card.meaningZh : card.meaning}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
