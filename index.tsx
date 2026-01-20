
import React, { useState, useRef, useMemo } from 'react';
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
  Languages
} from 'lucide-react';

// --- Types ---
type Lang = 'en' | 'zh';
type AppState = 'HOME' | 'DRAWING' | 'REVEAL' | 'READING';

interface TarotCard {
  id: number;
  name: string;
  nameZh: string;
  image: string;
  meaning: string;
  meaningZh: string;
}

interface ReadingData {
  card: TarotCard;
  question: string;
  interpretation: string;
}

// --- Translations ---
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
    tap_card: "TAP A CARD WHEN YOU FEEL THE PULL",
    channeling: "The Oracle is Channeling...",
    new_question: "New Question",
    oracle_message: "ORACLE'S MESSAGE",
    return: "RETURN TO THE STARS",
    version: "Celestial Arcana V1.1"
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
    tap_card: "当你感受到召唤时，点击一张牌",
    channeling: "神谕正在降临...",
    new_question: "重新提问",
    oracle_message: "神谕启示",
    return: "回归星空",
    version: "星辰奥秘 V1.1"
  }
};

const TAROT_CARDS: TarotCard[] = [
  { id: 0, name: "The Fool", nameZh: "愚者", image: "🃏", meaning: "New beginnings, optimism, trust in life.", meaningZh: "新的开始，乐观，对生活的信任。" },
  { id: 1, name: "The Magician", nameZh: "魔术师", image: "🪄", meaning: "Action, power, manifestation.", meaningZh: "行动，力量，显化。" },
  { id: 2, name: "The High Priestess", nameZh: "女祭司", image: "🌙", meaning: "Intuition, sacred knowledge, subconscious.", meaningZh: "直觉，神圣知识，潜意识。" },
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

const CelestialArcana = () => {
  const [state, setState] = useState<AppState>('HOME');
  const [lang, setLang] = useState<Lang>('zh');
  const [question, setQuestion] = useState('');
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [reading, setReading] = useState<ReadingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];
  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY }), []);
  const shuffledCards = useRef([...TAROT_CARDS].sort(() => Math.random() - 0.5));

  const toggleLang = () => setLang(prev => prev === 'en' ? 'zh' : 'en');

  const startReading = () => {
    if (!question.trim()) {
      setError(t.error_empty);
      return;
    }
    setError(null);
    setState('DRAWING');
  };

  const handleDrawCard = async (card: TarotCard) => {
    setSelectedCard(card);
    setState('REVEAL');
    setLoading(true);

    try {
      const prompt = lang === 'zh' 
        ? `你是一位名叫“星辰神谕”的神秘、智慧且慈悲的塔罗占卜师。寻问者提出了这个问题：“${question}”。他们抽到了这张牌：“${card.nameZh}”。请提供一份约200字深度、诗意且富有洞察力的解读。重点阐述这张牌如何具体回答他们的问题。使用带有宇宙隐喻的神秘语气。最后以“来自星辰的指引”结束，提供简短的建议。`
        : `You are a mystical, wise, and compassionate Tarot Reader named "The Oracle of Stars". The seeker has asked this question: "${question}". They have drawn the card: "${card.name}". Provide a deep, poetic, and insightful interpretation of about 150 words in English. Focus on how this card specifically answers their question. Use a mystical tone with cosmic metaphors. End with a "Guidance from the Stars" short actionable advice.`;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setReading({
        card,
        question,
        interpretation: result.text || (lang === 'zh' ? "星辰今日被乌云遮蔽，请稍后再试。" : "The stars are clouded today. Try again soon.")
      });
      setState('READING');
    } catch (err) {
      console.error(err);
      setError(t.error_api);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setState('HOME');
    setQuestion('');
    setSelectedCard(null);
    setReading(null);
    setError(null);
    shuffledCards.current = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
  };

  return (
    <div className="relative z-10 min-h-screen">
      {/* Fixed Language Switcher */}
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={toggleLang}
          className="glass px-4 py-2 rounded-full text-xs font-bold tracking-widest text-yellow-500/80 hover:text-yellow-500 border border-yellow-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          <Languages className="w-4 h-4" />
          {lang === 'en' ? 'EN / 中' : '中 / EN'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {state === 'HOME' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
          >
            <div className="mb-8">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative inline-block"
              >
                <Sparkles className="w-16 h-16 text-yellow-500 mb-4 mx-auto" />
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600">
                {t.title}
              </h1>
              <p className="text-purple-300 italic text-sm tracking-widest uppercase opacity-80">
                {t.subtitle}
              </p>
            </div>

            <div className="w-full max-w-md glass rounded-3xl p-8 card-glow">
              <h2 className="text-xl mb-6 text-yellow-100 uppercase tracking-widest font-semibold">{t.seek}</h2>
              <div className="relative mb-6">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={t.placeholder}
                  className="w-full h-32 bg-black/40 border border-purple-500/30 rounded-2xl p-4 text-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all placeholder:text-gray-600 resize-none"
                />
              </div>
              {error && <p className="text-red-400 text-sm mb-4 animate-pulse">{error}</p>}
              <button 
                onClick={startReading}
                className="w-full bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-yellow-100 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 group transition-all transform active:scale-95 shadow-xl border border-yellow-500/30"
              >
                {t.consult}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="mt-12 flex gap-4 opacity-30">
              <Heart className="w-6 h-6" /><Briefcase className="w-6 h-6" /><HelpCircle className="w-6 h-6" />
            </div>
          </motion.div>
        )}

        {state === 'DRAWING' && (
          <motion.div 
            key="drawing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col p-6"
          >
            <div className="pt-12 text-center mb-8">
              <h2 className="text-2xl text-yellow-100 tracking-[0.2em] mb-2 uppercase font-bold">{t.choose_fate}</h2>
              <p className="text-gray-400 text-xs tracking-widest">{t.tap_card}</p>
            </div>
            <div className="flex-1 overflow-y-auto pb-10">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-w-2xl mx-auto">
                {shuffledCards.current.map((card, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, y: [0, -5, 0] }}
                    transition={{ delay: idx * 0.02, y: { repeat: Infinity, duration: 3 + Math.random() * 2, ease: "easeInOut" } }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleDrawCard(card)}
                    className="aspect-[2/3] glass rounded-lg border border-yellow-500/20 cursor-pointer flex items-center justify-center relative overflow-hidden group shadow-lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 to-purple-950 flex flex-col items-center justify-center p-2">
                      <div className="w-full h-full border border-yellow-500/10 flex items-center justify-center rounded-sm">
                        <Moon className="w-8 h-8 text-yellow-500/20 group-hover:text-yellow-500/40 transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {state === 'REVEAL' && (
          <motion.div 
            key="reveal"
            className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
          >
            {selectedCard && (
              <motion.div
                initial={{ rotateY: 0, scale: 0.5, opacity: 0 }}
                animate={{ rotateY: 720, scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, type: "spring" }}
                className="w-full max-w-xs"
              >
                <div className="aspect-[2/3] glass rounded-3xl border-2 border-yellow-500/50 flex flex-col items-center justify-center p-8 relative card-glow overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none"></div>
                   <span className="text-8xl mb-6 block drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">{selectedCard.image}</span>
                   <h2 className="text-3xl font-bold text-yellow-200 tracking-widest mb-4">
                     {lang === 'zh' ? selectedCard.nameZh : selectedCard.name.toUpperCase()}
                   </h2>
                   <div className="w-12 h-px bg-yellow-500/30 mb-4"></div>
                   <p className="text-purple-200 text-sm italic">"{lang === 'zh' ? selectedCard.meaningZh : selectedCard.meaning}"</p>
                </div>
                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
                    <p className="text-yellow-100 font-light tracking-[0.3em] text-xs uppercase animate-pulse">{t.channeling}</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {state === 'READING' && (
          <motion.div 
            key="reading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col p-6 pb-20"
          >
            <div className="max-w-xl mx-auto w-full pt-4">
              <button onClick={reset} className="flex items-center gap-2 text-yellow-500/60 hover:text-yellow-500 transition-colors mb-8 text-sm uppercase tracking-widest font-bold">
                <RotateCcw className="w-4 h-4" /> {t.new_question}
              </button>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full md:w-48 shrink-0">
                  <div className="aspect-[2/3] glass rounded-2xl border border-yellow-500/30 flex flex-col items-center justify-center p-4 relative card-glow">
                    <span className="text-5xl mb-2">{reading?.card.image}</span>
                    <h3 className="text-sm font-bold text-yellow-200 tracking-widest text-center">
                      {lang === 'zh' ? reading?.card.nameZh : reading?.card.name.toUpperCase()}
                    </h3>
                  </div>
                  <div className="mt-4 p-4 rounded-xl bg-purple-900/10 border border-purple-500/10 text-xs text-purple-200 leading-relaxed overflow-hidden text-ellipsis whitespace-nowrap">
                     <Search className="w-3 h-3 inline mr-1 opacity-50" />
                     <span className="opacity-50 italic">{lang === 'zh' ? '意图' : 'Intent'}: "{reading?.question}"</span>
                  </div>
                </motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex-1 glass rounded-3xl p-8 border border-white/5 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
                  <h2 className="text-2xl text-yellow-100 tracking-widest mb-6 flex items-center gap-3 font-bold">
                     <Moon className="w-6 h-6 text-yellow-500" /> {t.oracle_message}
                  </h2>
                  <div className="prose prose-invert prose-yellow max-w-none">
                    <p className="text-yellow-50/90 leading-relaxed text-lg font-light first-letter:text-4xl first-letter:font-serif first-letter:mr-2 first-letter:float-left whitespace-pre-line">
                      {reading?.interpretation}
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex gap-2">
                      <Sun className="w-4 h-4 text-yellow-500/30" /><Wind className="w-4 h-4 text-yellow-500/30" /><Flame className="w-4 h-4 text-yellow-500/30" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">{t.version}</p>
                  </div>
                </motion.div>
              </div>
              <button onClick={reset} className="mt-12 w-full py-4 glass rounded-2xl text-yellow-100 font-bold border border-yellow-500/20 hover:bg-yellow-500/10 transition-colors tracking-widest uppercase active:scale-[0.98]">
                {t.return}
              </button>
            </div>
          </motion.div>
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
