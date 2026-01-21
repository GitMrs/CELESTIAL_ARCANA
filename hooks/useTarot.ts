import { useState, useRef, useEffect } from 'react';
import { Lang, AppState, SpreadType, RitualState, TarotCard, SavedReading } from '../types';
import { TAROT_CARDS } from '../constants';
import { generateReading } from '../utils/ai';
import { loadHistory, saveToHistory, loadApiKey, saveApiKey, clearApiKey, removeFromHistory } from '../utils/storage';

export const useTarot = () => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'DAILY' | 'ENCYCLOPEDIA' | 'HISTORY'>('HOME');
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
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  const shuffledDeck = useRef<TarotCard[]>([...TAROT_CARDS]);

  useEffect(() => {
    setHistory(loadHistory());
    const savedApiKey = loadApiKey();
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'zh' : 'en');

  const getRequiredCount = (type: SpreadType) => {
    switch (type) {
      case 'SINGLE': return 1;
      case 'THREE_CARD': return 3;
      case 'RELATIONSHIP': return 3;
      default: return 1;
    }
  };

  const startDivination = (errorEmpty: string) => {
    if (!question.trim()) {
      setError(errorEmpty);
      return;
    }
    if (!apiKey) {
      setShowApiKeyDialog(true);
      return;
    }
    setError(null);
    setSelectedCards([]);
    shuffledDeck.current = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
    setAppState('DRAWING');
  };

  const startDailyShuffle = () => {
    if (!apiKey) {
      setShowApiKeyDialog(true);
      return;
    }
    setAppState('IDLE');
    setRitualStage('SHUFFLE');
    setQuestion(lang === 'zh' ? "今日运势指引" : "My energy for today");
    setSpreadType('SINGLE');
    
    setTimeout(() => {
      const picked = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
      shuffledDeck.current = [picked];
      setRitualStage('FATED_CARD');
    }, 2500);
  };

  const handleFatedReveal = async (errorApi: string) => {
    const card = shuffledDeck.current[0];
    setSelectedCards([card]);
    await handleGenerateReading([card], errorApi);
  };

  const handleCardClick = async (card: TarotCard, errorApi: string) => {
    if (selectedCards.find(c => c.id === card.id)) return;
    const newList = [...selectedCards, card];
    setSelectedCards(newList);
    if (newList.length === getRequiredCount(spreadType)) {
      await handleGenerateReading(newList, errorApi);
    }
  };

  const handleGenerateReading = async (cards: TarotCard[], errorApi: string) => {
    setAppState('REVEAL');
    setLoading(true);
    try {
      const newReading = await generateReading(cards, question, spreadType, lang, apiKey);
      setReading(newReading);
      setHistory(saveToHistory(newReading, history));
      setAppState('READING');
    } catch (err) {
      console.error(err);
      setError(errorApi);
      setAppState('IDLE');
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

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    saveApiKey(key);
    setShowApiKeyDialog(false);
  };

  const handleClearApiKey = () => {
    setApiKey('');
    clearApiKey();
  };

  const handleDeleteReading = (readingId: string) => {
    const updatedHistory = removeFromHistory(readingId);
    setHistory(updatedHistory);
  };

  const hasTodayDailyReading = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return history.some(reading => {
      const readingDate = new Date(reading.timestamp);
      readingDate.setHours(0, 0, 0, 0);
      return readingDate.getTime() === today.getTime() && reading.spreadType === 'SINGLE';
    });
  };

  return {
    activeTab,
    setActiveTab,
    appState,
    setAppState,
    lang,
    setLang,
    question,
    setQuestion,
    spreadType,
    setSpreadType,
    selectedCards,
    setSelectedCards,
    reading,
    setReading,
    loading,
    error,
    setError,
    searchQuery,
    setSearchQuery,
    history,
    setHistory,
    ritualStage,
    setRitualStage,
    shuffledDeck,
    apiKey,
    setApiKey,
    showApiKeyDialog,
    setShowApiKeyDialog,
    toggleLang,
    getRequiredCount,
    startDivination,
    startDailyShuffle,
    handleFatedReveal,
    handleCardClick,
    resetAppState,
    handleSaveApiKey,
    handleClearApiKey,
    handleDeleteReading,
    hasTodayDailyReading
  };
};
