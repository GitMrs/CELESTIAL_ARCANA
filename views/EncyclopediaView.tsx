import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Lang, TarotCard } from '../types';
import { TRANSLATIONS } from '../constants';

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

  const filteredCards: TarotCard[] = [
    { id: 0, name: "The Fool", nameZh: "愚者", image: "🃏", meaning: "New beginnings, optimism, trust in life.", meaningZh: "新的开始，乐观，对生活的信任。" },
    { id: 1, name: "The Magician", nameZh: "魔术师", image: "🪄", meaning: "Action, power, manifestation.", meaningZh: "行动，力量，显化。" },
    { id: 2, name: "The High Priestess", nameZh: "女祭司", image: "🔮", meaning: "Intuition, sacred knowledge, subconscious.", meaningZh: "直觉，神圣知识，潜意识。" },
    { id: 3, name: "The Empress", nameZh: "女皇", image: "👸", meaning: "Femininity, beauty, nature, abundance.", meaningZh: "女性特质，美丽，自然，丰盛。" },
    { id: 4, name: "The Emperor", nameZh: "皇帝", image: "🫅🏻", meaning: "Authority, establishment, structure.", meaningZh: "权威，确立，结构。" },
    { id: 5, name: "The Hierophant", nameZh: "教皇", image: "📜", meaning: "Spiritual wisdom, tradition, conformity.", meaningZh: "精神智慧，传统，遵循。" },
    { id: 6, name: "The Lovers", nameZh: "恋人", image: "❤️", meaning: "Love, harmony, relationships, choices.", meaningZh: "爱，和谐，关系，选择。" },
    { id: 7, name: "The Chariot", nameZh: "战车", image: "🛞", meaning: "Control, willpower, victory, determination.", meaningZh: "控制，意志力，胜利，决心。" },
    { id: 8, name: "Strength", nameZh: "力量", image: "🦁", meaning: "Strength, courage, persuasion, influence.", meaningZh: "力量，勇气，说服，影响力。" },
    { id: 9, name: "The Hermit", nameZh: "隐士", image: "🕯️", meaning: "Soul searching, introspection, being alone.", meaningZh: "灵魂探索，内省，独处。" },
    { id: 10, name: "Wheel of Fortune", nameZh: "命运之轮", image: "🎡", meaning: "Good luck, karma, life cycles, destiny.", meaningZh: "好运，业力，生命周期，命运。" },
    { id: 11, name: "Justice", nameZh: "正义", image: "⚖️", meaning: "Justice, fairness, truth, cause and effect.", meaningZh: "正义，公平，真理，因果。" },
    { id: 12, name: "The Hanged Man", nameZh: "倒吊人", image: "⚓", meaning: "Pause, surrender, letting go.", meaningZh: "停顿，臣服，放手。" },
    { id: 13, name: "Death", nameZh: "死神", image: "💀", meaning: "Endings, change, transformation.", meaningZh: "结束，改变，转化。" },
    { id: 14, name: "Temperance", nameZh: "节制", image: "🍶", meaning: "Balance, moderation, patience, purpose.", meaningZh: "平衡，克制，耐心，目的。" },
    { id: 15, name: "The Devil", nameZh: "恶魔", image: "😈", meaning: "Shadow self, attachment, restriction.", meaningZh: "阴影自我，执着，束缚。" },
    { id: 16, name: "The Tower", nameZh: "高塔", image: "🗼", meaning: "Sudden change, upheaval, revelation.", meaningZh: "突然的改变，动荡，启示。" },
    { id: 17, name: "The Star", nameZh: "星星", image: "✨", meaning: "Hope, faith, purpose, renewal.", meaningZh: "希望，信心，目标，新生。" },
    { id: 18, name: "The Moon", nameZh: "月亮", image: "🌔", meaning: "Illusion, fear, anxiety, subconscious.", meaningZh: "幻觉，恐惧，焦虑，潜意识。" },
    { id: 19, name: "The Sun", nameZh: "太阳", image: "☀️", meaning: "Positivity, fun, warmth, success.", meaningZh: "积极，快乐，温暖，成功。" },
    { id: 20, name: "Judgement", nameZh: "审判", image: "🔔", meaning: "Judgement, rebirth, inner calling.", meaningZh: "审判，重生，内在召唤。" },
    { id: 21, name: "The World", nameZh: "世界", image: "🌍", meaning: "Completion, integration, accomplishment.", meaningZh: "圆满，整合，成就。" },
    { id: 22, name: "Ace of Wands", nameZh: "权杖首牌", image: "🪵", meaning: "New opportunities, inspiration, creative spark.", meaningZh: "新机会，灵感，创意火花。" },
    { id: 23, name: "Ace of Cups", nameZh: "圣杯首牌", image: "🏆", meaning: "New love, emotional awakening, intuition.", meaningZh: "新爱，情感觉醒，直觉。" }
  ].filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.nameZh.includes(searchQuery));

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
