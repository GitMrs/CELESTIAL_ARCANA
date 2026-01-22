import { TarotCard, Lang, ElementType } from './types';
import { Flame, Wind, Zap, Waves } from 'lucide-react';

export const TRANSLATIONS = {
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
    screenshot: "Screenshot",
    share: "SHARE POSTER",
    save_hint: "DOWNLOAD IMAGE",
    generating: "MAPPING STARS...",
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
    screenshot: "截图分享",
    share: "生成海报",
    save_hint: "下载图片",
    generating: "绘制星辰...",
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

export const TAROT_CARDS: TarotCard[] = [
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
];

export const ZODIACS = [
  { name: 'Aries', zh: '白羊座', icon: '♈', element: 'FIRE' as ElementType, trait: '勇气', traitEn: 'Courage' },
  { name: 'Taurus', zh: '金牛座', icon: '♉', element: 'EARTH' as ElementType, trait: '稳定', traitEn: 'Stability' },
  { name: 'Gemini', zh: '双子座', icon: '♊', element: 'AIR' as ElementType, trait: '灵动', traitEn: 'Agility' },
  { name: 'Cancer', zh: '巨蟹座', icon: '♋', element: 'WATER' as ElementType, trait: '直觉', traitEn: 'Intuition' },
  { name: 'Leo', zh: '狮子座', icon: '♌', element: 'FIRE' as ElementType, trait: '威严', traitEn: 'Majesty' },
  { name: 'Virgo', zh: '处女座', icon: '♍', element: 'EARTH' as ElementType, trait: '完美', traitEn: 'Perfection' },
  { name: 'Libra', zh: '天秤座', icon: '♎', element: 'AIR' as ElementType, trait: '和谐', traitEn: 'Harmony' },
  { name: 'Scorpio', zh: '天蝎座', icon: '♏', element: 'WATER' as ElementType, trait: '洞察', traitEn: 'Insight' },
  { name: 'Sagittarius', zh: '射手座', icon: '♐', element: 'FIRE' as ElementType, trait: '自由', traitEn: 'Freedom' },
  { name: 'Capricorn', zh: '摩羯座', icon: '♑', element: 'EARTH' as ElementType, trait: '坚毅', traitEn: 'Resilience' },
  { name: 'Aquarius', zh: '水瓶座', icon: '♒', element: 'AIR' as ElementType, trait: '智慧', traitEn: 'Wisdom' },
  { name: 'Pisces', zh: '双鱼座', icon: '♓', element: 'WATER' as ElementType, trait: '共情', traitEn: 'Empathy' }
];

export const ELEMENT_STYLES = {
  FIRE: { color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.3)', glow: '0 0 20px rgba(249, 115, 22, 0.2)', icon: Flame },
  EARTH: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', glow: '0 0 20px rgba(16, 185, 129, 0.2)', icon: Wind },
  AIR: { color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.1)', border: 'rgba(34, 211, 238, 0.3)', glow: '0 0 20px rgba(34, 211, 238, 0.2)', icon: Zap },
  WATER: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', glow: '0 0 20px rgba(59, 130, 246, 0.2)', icon: Waves },
};


export const getTranslation = (lang: Lang) => TRANSLATIONS[lang];
