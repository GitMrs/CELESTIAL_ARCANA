import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Moon, 
  Languages, 
  Home, 
  Star, 
  Book, 
  Clock, 
  Loader2,
  Settings
} from 'lucide-react';
import { useTarot } from './hooks/useTarot';
import { CardBack, ApiKeyDialog } from './components';
import { HomeView, DailyRitualView, ResultView, EncyclopediaView, HistoryView } from './views';
import { TRANSLATIONS } from './constants';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const {
    lang,
    toggleLang,
    apiKey,
    setApiKey,
    showApiKeyDialog,
    setShowApiKeyDialog,
    handleSaveApiKey,
    handleClearApiKey
  } = useTarot();

  const t = TRANSLATIONS[lang];

  return (
    <div className="relative min-h-screen text-yellow-50/90 overflow-x-hidden bg-[radial-gradient(circle_at_center,#1a0b2e_0%,#050505_100%)]">
      <div className="fixed top-0 left-0 right-0 z-[70] p-6 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Moon className="w-5 h-5 text-yellow-500" />
          </div>
        </div>
        <div className="flex items-center gap-3 pointer-events-auto">
          <button 
            onClick={() => setShowApiKeyDialog(true)}
            className="glass px-4 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] text-yellow-500 border border-yellow-500/30 flex items-center gap-2 shadow-2xl active:scale-95 transition-all hover:bg-yellow-500/5"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button onClick={toggleLang} className="glass px-6 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] text-yellow-500 border border-yellow-500/30 flex items-center gap-2 shadow-2xl active:scale-95 transition-all hover:bg-yellow-500/5">
            <Languages className="w-4 h-4" /> {lang.toUpperCase()}
          </button>
        </div>
      </div>

      <main className="pt-24 pb-24">
        {children}
      </main>

      <ApiKeyDialog
        isOpen={showApiKeyDialog}
        onClose={() => setShowApiKeyDialog(false)}
        onSave={handleSaveApiKey}
        onClear={handleClearApiKey}
        currentKey={apiKey}
        lang={lang}
      />
    </div>
  );
};

const Navigation = () => {
  const { lang, resetAppState } = useTarot();
  const location = useLocation();
  const t = TRANSLATIONS[lang];

  const getCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 glass border-t border-white/5 flex items-center justify-around px-6 z-[60] pb-6">
      {
        [
          { id: 'HOME', path: '/', icon: Home, label: t.home },
          { id: 'DAILY', path: '/daily', icon: Star, label: t.daily },
          { id: 'ENCYCLOPEDIA', path: '/encyclopedia', icon: Book, label: t.encyclopedia },
          { id: 'HISTORY', path: '/history', icon: Clock, label: t.history },
        ].map((item) => (
          <Link 
            key={item.id} 
            to={item.path} 
            onClick={resetAppState}
            className={`flex flex-col items-center gap-2 transition-all relative ${getCurrentPath(item.path) ? 'text-yellow-500 scale-110' : 'text-gray-600'}`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[9px] uppercase tracking-tighter font-bold">{item.label}</span>
            {getCurrentPath(item.path) && (
              <motion.div layoutId="nav-glow" className="absolute -top-4 w-12 h-1 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
            )}
          </Link>
        ))
      }
    </div>
  );
};

const MainViews = () => {
  const {
    appState,
    question,
    setQuestion,
    spreadType,
    setSpreadType,
    error,
    setError,
    searchQuery,
    setSearchQuery,
    history,
    ritualStage,
    selectedCards,
    reading,
    shuffledDeck,
    lang,
    startDivination,
    startDailyShuffle,
    handleFatedReveal,
    handleCardClick,
    resetAppState,
    handleSelectReading,
    handleDeleteReading,
    hasTodayDailyReading,
    getRequiredCount
  } = useTarot();
  
  const location = useLocation();
  
  // 存储选中的星座
  const [selectedZodiac, setSelectedZodiac] = React.useState<any>(null);
  
  // 监听路由变化，清除错误信息
  React.useEffect(() => {
    setError(null);
  }, [location.pathname, setError]);

  const t = TRANSLATIONS[lang];

  if (appState !== 'IDLE') {
    return (
      <AnimatePresence mode="wait">
        {appState === 'DRAWING' && (
          <motion.div key="drawing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 pt-28">
            <div className="mb-14">
              <div className="text-center mb-4">
                <h2 
                  onClick={resetAppState}
                  className="text-3xl text-yellow-100 tracking-widest font-bold uppercase cursor-pointer hover:text-yellow-300 transition-colors"
                  style={{ textShadow: '0 0 10px rgba(234, 179, 8, 0.5)' }}
                >
                  {t.choose_fate}
                </h2>
              </div>
              
              <div className="text-center">
                <p className="text-gray-500 text-[10px] mt-4 tracking-[0.3em] italic uppercase">{t.tap_card.replace('{count}', (getRequiredCount(spreadType) - selectedCards.length).toString())}</p>
                <div className="flex justify-center gap-6 mt-12">
                  {selectedCards.map((c, i) => (
                    <motion.div initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} key={i} className="w-16 h-24 glass border-2 border-yellow-500/60 rounded-xl flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(234,179,8,0.5)] bg-yellow-500/5">{c.image}</motion.div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 max-w-2xl mx-auto overflow-y-auto max-h-[66vh] pb-10 pr-2">
              {shuffledDeck.current.map((card, idx) => {
                const isSelected = selectedCards.find(c => c.id === card.id);
                return (
                  <div key={idx} onClick={() => !isSelected && handleCardClick(card, t.error_api)} className={`aspect-[2/3] glass rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all ${isSelected ? 'opacity-10 border-white/5 pointer-events-none' : 'border-yellow-500/20 shadow-xl hover:border-yellow-500/50 active:scale-95'}`}>
                    <CardBack />
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
        {appState === 'REVEAL' && (
          <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-yellow-500 animate-spin mx-auto mb-8" />
              <p className="text-yellow-500 font-bold tracking-[0.5em] text-xs uppercase animate-pulse">{t.channeling}</p>
            </div>
          </motion.div>
        )}
        {appState === 'READING' && reading && (
          <ResultView
            reading={reading}
            activeTab={''}
            lang={lang}
            onResetAppState={resetAppState}
            onStartDailyShuffle={startDailyShuffle}
          />
        )}
      </AnimatePresence>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={
          <HomeView
            question={question}
            spreadType={spreadType}
            error={error}
            lang={lang}
            onQuestionChange={setQuestion}
            onSpreadTypeChange={setSpreadType}
            onStartDivination={(zodiac) => startDivination(t.error_empty, zodiac)}
          />
        } />
        <Route path="/daily" element={
          <DailyRitualView
            ritualStage={ritualStage}
            lang={lang}
            onStartDailyShuffle={startDailyShuffle}
            onHandleFatedReveal={() => handleFatedReveal(t.error_api)}
            hasTodayReading={hasTodayDailyReading()}
            error={error}
          />
        } />
        <Route path="/encyclopedia" element={
          <EncyclopediaView
            searchQuery={searchQuery}
            lang={lang}
            onSearchChange={setSearchQuery}
          />
        } />
        <Route path="/history" element={
          <HistoryView
            history={history}
            lang={lang}
            onSelectReading={handleSelectReading}
            onDeleteReading={handleDeleteReading}
          />
        } />
      </Routes>
      <Navigation />
    </>
  );
};

const CelestialArcana = () => {
  return (
    <Router>
      <Layout>
        <MainViews />
      </Layout>
    </Router>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<CelestialArcana />);
}
