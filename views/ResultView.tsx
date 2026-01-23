import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { RotateCcw, RefreshCw, Moon, Sun, Star, Share2, Sparkles, ChevronDown } from 'lucide-react';
import { SavedReading, ViewType, Lang } from '../types';
import { TRANSLATIONS } from '../constants';
import { SharePoster } from '../components/SharePoster';
import * as htmlToImage from 'html-to-image';

interface ResultViewProps {
  reading: SavedReading;
  activeTab: ViewType;
  lang: Lang;
  onResetAppState: () => void;
  onStartDailyShuffle: () => void;
}

const TiltCard = ({ card, index, lang }: { card: any, index: number, lang: Lang }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  const glareX = useTransform(x, [-100, 100], [0, 100]);
  const glareY = useTransform(y, [-100, 100], [0, 100]);

  const [isGyroActive, setIsGyroActive] = React.useState(false);

  React.useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null || e.beta !== null) {
        setIsGyroActive(true);
      }

      // Gamma: Left/Right tilt [-90, 90]
      // Beta: Front/Back tilt [-180, 180]
      const gamma = e.gamma || 0;
      const beta = e.beta || 0;

      // Map tilt to similar range as mouse movement (-100 to 100)
      // Clamped to subtle range for better experience
      const shiftX = Math.min(Math.max(gamma, -20), 20) * 5;
      // Center beta around typical holding angle ~45deg
      const shiftY = Math.min(Math.max(beta - 45, -20), 20) * 5;

      x.set(shiftX);
      y.set(shiftY);
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.3, type: "spring", stiffness: 40 }}
      className="perspective-1000 group relative z-10"
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={(e) => {
          if (isGyroActive) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          x.set(e.clientX - centerX);
          y.set(e.clientY - centerY);
        }}
        onMouseLeave={() => {
          if (isGyroActive) return;
          x.set(0);
          y.set(0);
        }}
        className="flex flex-col items-center cursor-pointer"
      >
        <div className="relative transform-style-3d transition-transform duration-200 ease-out">
          {/* Decorative Halo (inactive state) */}
          <div className="absolute -inset-4 bg-yellow-500/10 rounded-[40%] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 translate-z-[-20px]" style={{ transform: "translateZ(-20px)" }}></div>

          {/* Main Card Container */}
          <div className="w-56 md:w-64 aspect-[2/3] relative rounded-xl transition-all duration-500 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] group-hover:shadow-[0_30px_80px_-15px_rgba(250,204,21,0.15)] bg-[#1a1625]" style={{ transform: "translateZ(0px)" }}>

            {/* Subtle Glass Border */}
            <div className="absolute inset-0 rounded-xl ring-1 ring-white/10 group-hover:ring-yellow-500/30 transition-all duration-500 z-20 pointer-events-none"></div>

            {/* Image Container */}
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#1a1625]">
              {/* Blurred Background for Fill */}
              <img
                src={card.image}
                alt={card.name}
                className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-60"
              />

              {/* Main Image (Contained) */}
              <img
                src={card.image}
                alt={card.name}
                className="relative w-full h-full object-contain z-10 transition-transform duration-700 group-hover:scale-105 drop-shadow-xl"
              />

              {/* Dynamic Glare Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
                style={{
                  background: `radial-gradient(circle at ${50 + glareX.get() * 0.5}% ${50 + glareY.get() * 0.5}%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
                  mixBlendMode: 'overlay'
                }}
              />
            </div>
          </div>
        </div>


      </motion.div>
    </motion.div>
  );
};

export const ResultView = ({
  reading,
  activeTab,
  lang,
  onResetAppState,
  onStartDailyShuffle
}: ResultViewProps) => {
  const t = TRANSLATIONS[lang];
  const resultContainerRef = React.useRef<HTMLDivElement>(null);
  const [showPoster, setShowPoster] = useState(false);

  return (
    <motion.div key="reading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2 pb-40 px-4 max-w-4xl mx-auto">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-2">
        <button onClick={onResetAppState} className="flex items-center gap-3 text-yellow-500/60 hover:text-yellow-500 transition-colors text-xs uppercase tracking-[0.2em] font-bold group bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5">
          <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-700" /> {t.new_question}
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowPoster(true)} className="flex items-center gap-2 text-yellow-500/60 hover:text-yellow-500 transition-colors text-xs uppercase tracking-[0.2em] font-bold group bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5">
            <Share2 className="w-4 h-4" />
            <span className="hidden md:inline">{t.share}</span>
          </button>
          {activeTab === 'DAILY' && (
            <button onClick={onStartDailyShuffle} className="flex items-center gap-2 text-yellow-500/60 hover:text-yellow-500 transition-colors text-xs uppercase tracking-[0.2em] font-bold group bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5">
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
              <span className="hidden md:inline">{t.redraw}</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-10">
        {/* Luxury Image Display Area */}
        <div className="flex flex-wrap gap-12 justify-center relative py-10 px-2">
          {/* Altar Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-gradient-to-b from-purple-900/20 via-transparent to-yellow-900/10 blur-3xl pointer-events-none -z-10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.05),transparent_70%)] pointer-events-none -z-10"></div>

          {reading?.cards.map((card, i) => (
            <TiltCard key={i} card={card} index={i} lang={lang} />
          ))}
        </div>

        {/* Scroll Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="flex justify-center -mt-12 pb-4"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-yellow-500/20"
          >
            <span className="text-[9px] uppercase tracking-[0.3em]">{lang === 'zh' ? '下滑查看解读' : 'Scroll to Reveal'}</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>

        {/* Interpretation Panel - Restored Classic Design */}
        <motion.div
          ref={resultContainerRef}
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
            {reading?.interpretation && (
              <div>
                <p className="text-yellow-50/90 leading-[2] text-lg font-light whitespace-pre-line text-justify">
                  <span className="inline-block text-6xl font-serif mr-4 float-left text-yellow-500 leading-none align-top">
                    {reading.interpretation.charAt(0)}
                  </span>
                  {reading.interpretation.slice(1)}
                </p>
              </div>
            )}
          </div>

          <div className="mt-20 pt-10 border-t border-white/5 flex items-center justify-between text-[9px] text-gray-500 uppercase tracking-[0.5em] font-bold">
            <div className="flex gap-4"><Sun className="w-4 h-4 opacity-30" /><Star className="w-4 h-4 opacity-30" /></div>
            {t.version}
          </div>
        </motion.div>
      </div>

      <div className="max-w-xs mx-auto mt-20">
        <button onClick={onResetAppState} className="w-full py-5 rounded-2xl text-yellow-200/80 font-bold border border-yellow-500/20 uppercase tracking-[0.4em] text-[10px] hover:bg-yellow-500/5 hover:text-yellow-100 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3">
          <RotateCcw className="w-3 h-3" />
          <span>{t.return}</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showPoster && reading && (
          <SharePoster
            data={reading}
            lang={lang}
            onClose={() => setShowPoster(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
