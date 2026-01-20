
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ChevronRight, 
  RotateCcw, 
  Search, 
  Moon, 
  Sun, 
  Wind, 
  Flame,
  Heart,
  Briefcase,
  HelpCircle,
  Loader2,
  Languages,
  Book,
  Clock,
  Home,
  Star,
  Zap,
  Fingerprint,
  RefreshCw
} from 'lucide-react';

// --- Types ---
type Lang = 'en' | 'zh';
type ViewType = 'HOME' | 'DAILY' | 'ENCYCLOPEDIA' | 'HISTORY';
type AppState = 'IDLE' | 'DRAWING' | 'REVEAL' | 'READING';
type SpreadType = 'SINGLE' | 'THREE_CARD' | 'RELATIONSHIP';
type RitualState = 'START' | 'SHUFFLE' | 'FATED_CARD';

interface TarotCard {
  id: number;
  name: string;
  nameZh: string;
  image: string;
  meaning: string;
  meaningZh: string;
}

interface SavedReading {
  id: string;
  timestamp: number;
  question: string;
  spreadType: SpreadType;
  cards: TarotCard[];
  interpretation: string;
  lang: Lang;
}

// --- Constants ---
const TRANSLATIONS = {
  en: {
    title: "CELESTIAL ARCANA",
    subtitle: "Divine Wisdom Powered by the Stars",
    seek: "What do you seek?",
    placeholder: "Focus on your question... (Love, Career, Spirit?)",
    consult: "CONSULT THE ORACLE",
    error_empty: "Please whisper your intention to the stars first.",
    error_api: "The cosmic connection was interrupted. Please try again.",
    choose_fate: "Choose Your Fate",
    tap_card: "TAP {count} CARD(S) TO REVEAL",
    daily_pick: "FATE IS SEALED",
    daily_hint: "TAP TO UNVEIL YOUR DESTINY",
    daily_shuffle: "SHUFFLE THE DESTINY",
    channeling: "The Oracle is Channeling...",
    new_question: "New Question",
    redraw: "Redraw Destiny",
    oracle_message: "ORACLE'S MESSAGE",
    return: "RETURN TO THE STARS",
    history: "Past Visions",
    encyclopedia: "Arcana Wisdom",
    daily: "Daily Draw",
    home: "Divination",
    search_cards: "Search for a card...",
    spreads: {
      SINGLE: "Single Insight",
      THREE_CARD: "Past-Present-Future",
      RELATIONSHIP: "Relationship Link"
    },
    version: "Celestial Arcana V4.5"
  },
  zh: {
    title: "星辰奥秘",
    subtitle: "星辰指引的神圣智慧",
    seek: "你所寻何事？",
    placeholder: "专注于你的问题... (爱情、事业、灵性？)",
    consult: "咨询星辰神谕",
    error_empty: "请先向星辰倾诉你的意图。",
    error_api: "星辰连接中断，请重试。",
    choose_fate: "选择你的命运",
    tap_card: "点击选择 {count} 张牌",
    daily_pick: "命运之牌已降临",
    daily_hint: "点击揭晓今日启示",
    daily_shuffle: "洗牌以感应命运",
    channeling: "神谕正在降临...",
    new_question: "重新提问",
    redraw: "再次感应",
    oracle_message: "神谕启示",
    return: "回归星空",
    history: "占卜历程",
    encyclopedia: "塔罗百科",
    daily: "每日一签",
    home: "命运占卜",
    search_cards: "搜索牌名...",
    spreads: {
      SINGLE: "单牌指引",
      THREE_CARD: "过去-现在-未来",
      RELATIONSHIP: "关系深度解析"
    },
    version: "星辰奥秘 V4.5"
  }
};

const TAROT_CARDS: TarotCard[] = [
  { id: 0, name: "The Fool", nameZh: "愚者", image: "🃏", meaning: "New beginnings, optimism, trust in life.", meaningZh: "新的开始，乐观，对生活的信任。" },
  { id: 1, name: "The Magician", nameZh: "魔术师", image: "🪄", meaning: "Action, power, manifestation.", meaningZh: "行动，力量，显化。" },
  { id: 2, name: "The High Priestess", nameZh: "女祭司", image: "🔮", meaning: "Intuition, sacred knowledge, subconscious.", meaningZh: "直觉，神圣知识，潜意识。" },
  { id: 3, name: "The Empress", nameZh: "女皇", image: "👑", meaning: "Femininity, beauty, nature, abundance.", meaningZh: "女性特质，美丽，自然，丰盛。" },
  { id: 4, name: "The Emperor", nameZh: "皇帝", image: "🏰", meaning: "Authority, establishment, structure.", meaningZh: "权威，确立，结构。" },
  { id: 5, name: "The Hierophant", nameZh: "教皇", image: "📜", meaning: "Spiritual wisdom, tradition, conformity.", meaningZh: "精神智慧，传统，遵循。" },
  { id: 6, name: "The Lovers", nameZh: "恋人", image: "❤️", meaning: "Love, harmony, relationships, choices.", meaningZh: "爱，和谐，关系，选择。" },
  { id: 7, name: "The Chariot", nameZh: "战车", image: "⚔️", meaning: "Control, willpower, victory, determination.", meaningZh: "控制，意志力，胜利，决心。" },
  { id: 8, name: "Strength", nameZh: "力量", image: "🦁", meaning: "Strength, courage, persuasion, influence.", meaningZh: "力量，勇气，说服，影响力。" },
  { id: 9, name: "The Hermit", nameZh: "隐士", image: "🕯️", meaning: "Soul searching, introspection, being alone.", meaningZh: "灵魂探索，内省，独处。" },
  { id: 10, name: "Wheel of Fortune", nameZh: "命运之轮", image: "🎡", meaning: "Good luck, karma, life cycles, destiny.", meaningZh: "好运，业力，生命周期，命运。" },
  { id: 11, name: "Justice", nameZh: "正义", image: "⚖️", meaning: "Justice, fairness, truth, cause and effect.", meaningZh: "正义，公平，真理，因果。" },
  { id: 12, name: "The Hanged Man", nameZh: "倒吊人", image: "⚓", meaning: "Pause, surrender, letting go.", meaningZh: "停顿，臣服，放手。" },
  { id: 13, name: "Death", nameZh: "死神", image: "💀", meaning: "Endings, change, transformation.", meaningZh: "结束，改变，转化。" },
  { id: 14, name: "Temperance", nameZh: "节制", image: "🍶", meaning: "Balance, moderation, patience, purpose.", meaningZh: "平衡，克制，耐心，目的。" },
  { id: 15, name: "The Devil", nameZh: "恶魔", image: "😈", meaning: "Shadow self, attachment, restriction.", meaningZh: "阴影自我，执着，束缚。" },
  { id: 16, name: "The Tower", nameZh: "高塔", image: "💥", meaning: "Sudden change, upheaval, revelation.", meaningZh: "突然的改变，动荡，启示。" },
  { id: 17, name: "The Star", nameZh: "星星", image: "✨", meaning: "Hope, faith, purpose, renewal.", meaningZh: "希望，信心，目标，新生。" },
  { id: 18, name: "The Moon", nameZh: "月亮", image: "🌔", meaning: "Illusion, fear, anxiety, subconscious.", meaningZh: "幻觉，恐惧，焦虑，潜意识。" },
  { id: 19, name: "The Sun", nameZh: "太阳", image: "☀️", meaning: "Positivity, fun, warmth, success.", meaningZh: "积极，快乐，温暖，成功。" },
  { id: 20, name: "Judgement", nameZh: "审判", image: "🔔", meaning: "Judgement, rebirth, inner calling.", meaningZh: "审判，重生，内在召唤。" },
  { id: 21, name: "The World", nameZh: "世界", image: "🌍", meaning: "Completion, integration, accomplishment.", meaningZh: "圆满，整合，成就。" }
];

const CardBack = ({ glow = false, animate = false }) => (
  <motion.div 
    animate={animate ? { scale: [1, 1.05, 1], boxShadow: ["0 0 20px rgba(212,175,55,0.2)", "0 0 40px rgba(212,175,55,0.5)", "0 0 20px rgba(212,175,55,0.2)"] } : {}}
    transition={{ duration: 2, repeat: Infinity }}
    className={`absolute inset-0 bg-gradient-to-br from-[#1a0b2e] via-[#2D0B5A] to-[#050505] rounded-xl overflow-hidden border border-yellow-500/20 ${glow ? 'shadow-[0_0_20px_rgba(212,175,55,0.4)]' : ''}`}
  >
    <div className="absolute inset-2 border border-yellow-500/10 rounded-lg flex items-center justify-center">
      <div className="w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-16 h-16 border border-yellow-500/30 rounded-full flex items-center justify-center rotate-45">
          <Sparkles className="w-8 h-8 text-yellow-500/40" />
          <div className="absolute inset-0 border border-yellow-500/10 rounded-full scale-125"></div>
        </div>
      </div>
    </div>
  </motion.div>
);

const CelestialArcana = () => {
  // --- States ---
  const [activeTab, setActiveTab] = useState<ViewType>('HOME');
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [lang, setLang] = useState<Lang>('zh');
  const [question, setQuestion] = useState('');
  const [spreadType, setSpreadType] = useState<SpreadType>('SINGLE');
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [reading, setReading] = useState<SavedReading | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState<SavedReading[]>([]);
  const [ritualStage, setRitualStage] = useState<RitualState>('START');

  const t = TRANSLATIONS[lang];
  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY }), []);
  const shuffledDeck = useRef([...TAROT_CARDS]);

  // --- Effects ---
  useEffect(() => {
    const saved = localStorage.getItem('celestial_arc_hist_v5');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // --- Actions ---
  const toggleLang = () => setLang(prev => prev === 'en' ? 'zh' : 'en');

  const saveToHistory = (newReading: SavedReading) => {
    const updated = [newReading, ...history].slice(0, 50);
    setHistory(updated);
    localStorage.setItem('celestial_arc_hist_v5', JSON.stringify(updated));
  };

  const getRequiredCount = (type: SpreadType) => {
    switch (type) {
      case 'SINGLE': return 1;
      case 'THREE_CARD': return 3;
      case 'RELATIONSHIP': return 3;
      default: return 1;
    }
  };

  const startDivination = () => {
    if (!question.trim()) {
      setError(t.error_empty);
      return;
    }
    setError(null);
    setSelectedCards([]);
    shuffledDeck.current = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
    setAppState('DRAWING');
  };

  const startDailyShuffle = () => {
    setAppState('IDLE'); // Ensure we are in ritual mode
    setRitualStage('SHUFFLE');
    setQuestion(lang === 'zh' ? "今日运势指引" : "My energy for today");
    setSpreadType('SINGLE');
    
    setTimeout(() => {
      const picked = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
      shuffledDeck.current = [picked];
      setRitualStage('FATED_CARD');
    }, 2500);
  };

  const handleFatedReveal = () => {
    const card = shuffledDeck.current[0];
    setSelectedCards([card]);
    generateReading([card]);
  };

  const handleCardClick = (card: TarotCard) => {
    if (selectedCards.find(c => c.id === card.id)) return;
    const newList = [...selectedCards, card];
    setSelectedCards(newList);
    if (newList.length === getRequiredCount(spreadType)) generateReading(newList);
  };

  const generateReading = async (cards: TarotCard[]) => {
    setAppState('REVEAL');
    setLoading(true);
    try {
      const cardNames = cards.map(c => lang === 'zh' ? c.nameZh : c.name).join(', ');
      let contextPrompt = '';
      if (spreadType === 'THREE_CARD') {
        contextPrompt = lang === 'zh' ? `按照“过去、现在、未来”的顺序解读。` : `Interpret as Past, Present, Future.`;
      } else if (spreadType === 'RELATIONSHIP') {
        contextPrompt = lang === 'zh' ? `按照“我、对方、连接纽带”的顺序解读。` : `Interpret as You, Them, The Bond.`;
      }

      const prompt = lang === 'zh' 
        ? `你是一位名叫“星辰神谕”的资深塔罗占卜师。问题：“${question}”。牌阵：${TRANSLATIONS.zh.spreads[spreadType]}。牌面：${cardNames}。${contextPrompt}提供300字深度诗意解读。回复中文。`
        : `You are the "Oracle of Stars". Question: "${question}". Spread: ${TRANSLATIONS.en.spreads[spreadType]}. Cards: ${cardNames}. ${contextPrompt}Provide 250-word celestial interpretation. Reply in English.`;

      const result = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      const newReading: SavedReading = { id: Date.now().toString(), timestamp: Date.now(), question, spreadType, cards, interpretation: result.text || "Clouded...", lang };
      setReading(newReading);
      saveToHistory(newReading);
      setAppState('READING');
    } catch (err) {
      console.error(err);
      setError(t.error_api);
    } finally {
      setLoading(false);
    }
  };

  const resetAppState = () => {
    setAppState('IDLE');
    setQuestion('');
    setSelectedCards([]);
    setReading(null);
    setError(null);
    setRitualStage('START');
  };

  // --- Views ---

  const renderHome = () => (
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
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t.placeholder}
          className="w-full h-32 bg-black/40 border border-purple-500/20 rounded-2xl p-6 text-yellow-50 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 transition-all resize-none shadow-inner"
        />
        <div className="mt-8 grid grid-cols-3 gap-3">
          {(['SINGLE', 'THREE_CARD', 'RELATIONSHIP'] as SpreadType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSpreadType(type)}
              className={`py-3 px-1 rounded-xl text-[9px] uppercase tracking-widest transition-all border font-bold ${spreadType === type ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'border-white/5 text-gray-500'}`}
            >
              {t.spreads[type]}
            </button>
          ))}
        </div>
        <div className="h-6 mt-4 text-center">
          {error && <p className="text-red-400 text-[10px] animate-pulse uppercase tracking-widest">{error}</p>}
        </div>
        <button onClick={startDivination} className="w-full mt-2 bg-gradient-to-r from-[#2D0B5A] to-[#1a0b2e] text-yellow-100 font-bold py-5 rounded-2xl flex items-center justify-center gap-3 border border-yellow-500/30 active:scale-95 transition-all shadow-2xl hover:border-yellow-500/60">
          {t.consult} <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );

  const renderDailyRitual = () => (
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
            <button onClick={startDailyShuffle} className="glass group px-16 py-6 rounded-full text-yellow-500 border border-yellow-500/40 uppercase tracking-[0.6em] font-bold active:scale-95 shadow-2xl transition-all hover:bg-yellow-500/5">
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
              onClick={handleFatedReveal}
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

  const renderResultView = () => (
    <motion.div key="reading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 pb-36 px-6 max-w-2xl mx-auto">
      {/* Dynamic Header */}
      <div className="flex justify-between items-center mb-12">
        <button onClick={resetAppState} className="flex items-center gap-3 text-yellow-500/60 hover:text-yellow-500 transition-colors text-[10px] uppercase tracking-[0.4em] font-bold group">
          <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> {t.new_question}
        </button>
        {activeTab === 'DAILY' && (
          <button onClick={startDailyShuffle} className="flex items-center gap-3 text-yellow-500/60 hover:text-yellow-500 transition-colors text-[10px] uppercase tracking-[0.4em] font-bold group">
            <RefreshCw className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" /> {t.redraw}
          </button>
        )}
      </div>

      <div className="space-y-16">
        {/* Card Showcase Area */}
        <div className="flex flex-wrap gap-8 justify-center relative py-10">
          <div className="absolute inset-0 bg-yellow-500/5 blur-[80px] rounded-full pointer-events-none"></div>
          {reading?.cards.map((card, i) => (
            <motion.div 
              key={i} 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.2 }}
              className="w-32 aspect-[2/3] glass border-2 border-yellow-500/30 rounded-2xl flex flex-col items-center justify-center p-4 text-center card-glow relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-transparent"></div>
              <span className="text-6xl mb-4 relative z-10 drop-shadow-lg">{card.image}</span>
              <h4 className="text-[11px] font-bold text-yellow-100 uppercase tracking-tighter relative z-10 leading-tight">{lang === 'zh' ? card.nameZh : card.name}</h4>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500/20"></div>
            </motion.div>
          ))}
        </div>

        {/* Interpretation Scroll */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass p-10 md:p-14 rounded-[3rem] border border-white/5 relative overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.9)] bg-gradient-to-b from-[#1a0b2e]/80 to-[#050505]/95"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]"></div>
          
          <div className="flex items-center gap-6 mb-12 border-b border-white/10 pb-8">
            <div className="w-12 h-12 rounded-full border border-yellow-500/20 flex items-center justify-center bg-yellow-500/5">
               <Moon className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-2xl text-yellow-100 tracking-[0.2em] font-bold uppercase">{t.oracle_message}</h2>
              <p className="text-[9px] text-yellow-500/40 tracking-[0.4em] uppercase font-bold mt-1">Celestial Reading • {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-yellow-50/90 leading-[2] text-lg font-light first-letter:text-6xl first-letter:font-serif first-letter:mr-4 first-letter:float-left first-letter:text-yellow-500 first-letter:leading-none whitespace-pre-line text-justify">
              {reading?.interpretation}
            </p>
          </div>

          <div className="mt-20 pt-10 border-t border-white/5 flex items-center justify-between text-[9px] text-gray-500 uppercase tracking-[0.5em] font-bold">
            <div className="flex gap-4"><Sun className="w-4 h-4 opacity-30" /><Star className="w-4 h-4 opacity-30" /></div>
            {t.version}
          </div>
        </motion.div>
      </div>

      <button onClick={resetAppState} className="w-full mt-16 py-6 glass rounded-[2.5rem] text-yellow-100 font-bold border border-yellow-500/30 uppercase tracking-[0.6em] text-xs shadow-2xl active:scale-95 transition-all hover:bg-yellow-500/5 group">
        <span className="group-hover:tracking-[0.8em] transition-all duration-300">{t.return}</span>
      </button>
    </motion.div>
  );

  const renderEncyclopedia = () => {
    const filtered = TAROT_CARDS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.nameZh.includes(searchQuery));
    return (
      <motion.div key="ency" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        <h2 className="text-3xl text-yellow-100 tracking-widest mb-10 font-bold uppercase">{t.encyclopedia}</h2>
        <div className="relative mb-12">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.search_cards} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500/50" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          {filtered.map(card => (
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

  const renderHistory = () => (
    <motion.div key="hist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
      <h2 className="text-3xl text-yellow-100 tracking-widest mb-10 font-bold uppercase">{t.history}</h2>
      {history.length === 0 ? (
        <div className="text-center py-32 opacity-20 italic text-sm tracking-widest">NO VOICES FROM THE PAST...</div>
      ) : (
        <div className="space-y-8">
          {history.map((item) => (
            <div key={item.id} className="glass p-8 rounded-[2rem] border border-white/5 cursor-pointer hover:border-yellow-500/20 transition-all shadow-xl" onClick={() => { setReading(item); setAppState('READING'); }}>
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

  return (
    <div className="relative min-h-screen text-yellow-50/90 overflow-x-hidden">
      {/* Universal Top Header */}
      <div className="fixed top-0 left-0 right-0 z-[70] p-6 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Moon className="w-5 h-5 text-yellow-500" />
          </div>
          <span className="text-[10px] tracking-[0.4em] font-bold text-yellow-500/80 uppercase">V4.5</span>
        </div>
        <button onClick={toggleLang} className="glass pointer-events-auto px-6 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] text-yellow-500 border border-yellow-500/30 flex items-center gap-2 shadow-2xl active:scale-95 transition-all hover:bg-yellow-500/5">
          <Languages className="w-4 h-4" /> {lang.toUpperCase()}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {appState === 'IDLE' ? (
          <div key="main-app">
            {activeTab === 'HOME' && renderHome()}
            {activeTab === 'DAILY' && renderDailyRitual()}
            {activeTab === 'ENCYCLOPEDIA' && renderEncyclopedia()}
            {activeTab === 'HISTORY' && renderHistory()}
            
            {/* Universal Navigation */}
            <div className="fixed bottom-0 left-0 right-0 h-24 glass border-t border-white/5 flex items-center justify-around px-6 z-[60] pb-6">
              {[
                { id: 'HOME', icon: Home, label: t.home },
                { id: 'DAILY', icon: Star, label: t.daily },
                { id: 'ENCYCLOPEDIA', icon: Book, label: t.encyclopedia },
                { id: 'HISTORY', icon: Clock, label: t.history },
              ].map((item) => (
                <button key={item.id} onClick={() => { setActiveTab(item.id as ViewType); resetAppState(); }} className={`flex flex-col items-center gap-2 transition-all relative ${activeTab === item.id ? 'text-yellow-500 scale-110' : 'text-gray-600'}`}>
                  <item.icon className="w-6 h-6" />
                  <span className="text-[9px] uppercase tracking-tighter font-bold">{item.label}</span>
                  {activeTab === item.id && (
                    <motion.div layoutId="nav-glow" className="absolute -top-4 w-12 h-1 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : appState === 'DRAWING' ? (
          <motion.div key="drawing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 pt-28">
            <div className="text-center mb-14">
              <h2 className="text-3xl text-yellow-100 tracking-widest font-bold uppercase">{t.choose_fate}</h2>
              <p className="text-gray-500 text-[10px] mt-4 tracking-[0.3em] italic uppercase">{t.tap_card.replace('{count}', (getRequiredCount(spreadType) - selectedCards.length).toString())}</p>
              <div className="flex justify-center gap-6 mt-12">
                {selectedCards.map((c, i) => (
                  <motion.div initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} key={i} className="w-16 h-24 glass border-2 border-yellow-500/60 rounded-xl flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(234,179,8,0.5)] bg-yellow-500/5">{c.image}</motion.div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 max-w-2xl mx-auto overflow-y-auto max-h-[50vh] pb-10 pr-2">
              {shuffledDeck.current.map((card, idx) => {
                const isSelected = selectedCards.find(c => c.id === card.id);
                return (
                  <div key={idx} onClick={() => !isSelected && handleCardClick(card)} className={`aspect-[2/3] glass rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all ${isSelected ? 'opacity-10 border-white/5 pointer-events-none' : 'border-yellow-500/20 shadow-xl hover:border-yellow-500/50 active:scale-95'}`}>
                    <CardBack />
                  </div>
                );
              })}
            </div>
            <button onClick={resetAppState} className="fixed bottom-12 left-1/2 -translate-x-1/2 text-gray-500 text-[10px] uppercase tracking-[0.4em] border-b border-gray-500/20 pb-1">{t.return}</button>
          </motion.div>
        ) : appState === 'REVEAL' ? (
          <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
             <div className="flex flex-wrap gap-8 justify-center mb-20">
               {selectedCards.map((card, i) => (
                 <motion.div key={i} initial={{ rotateY: 180, scale: 0.5, opacity: 0 }} animate={{ rotateY: 0, scale: 1.2, opacity: 1 }} transition={{ delay: i * 0.5, type: 'spring', damping: 12 }} className="w-40 aspect-[2/3] glass border-2 border-yellow-500/50 rounded-[2rem] flex flex-col items-center justify-center p-6 relative card-glow">
                   <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-transparent rounded-[2rem] pointer-events-none"></div>
                   <span className="text-7xl mb-6 drop-shadow-2xl">{card.image}</span>
                   <h3 className="text-sm font-bold text-yellow-100 tracking-[0.3em] uppercase">{lang === 'zh' ? card.nameZh : card.name}</h3>
                 </motion.div>
               ))}
             </div>
             {loading && (
               <div className="flex flex-col items-center gap-8">
                 <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
                 <p className="text-yellow-100 font-light tracking-[0.5em] text-xs uppercase animate-pulse">{t.channeling}</p>
               </div>
             )}
          </motion.div>
        ) : (
          renderResultView()
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Render ---
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<CelestialArcana />);
}
