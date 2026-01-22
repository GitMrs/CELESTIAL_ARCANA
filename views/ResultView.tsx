import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, RefreshCw, Moon, Sun, Star, Camera, Share2 } from 'lucide-react';
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

  // 截图功能
  const handleScreenshot = async () => {
    if (!resultContainerRef.current) return;

    try {
      // 临时禁用动画，确保截图清晰
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // 生成高质量截图
      const dataUrl = await htmlToImage.toPng(resultContainerRef.current, {
        pixelRatio: 2, // 提高清晰度
        backgroundColor: '#050505', // 设置背景色
        quality: 1.0, // 最高质量
        cacheBust: true, // 避免缓存问题
        includeQueryParams: true // 包含查询参数
      });

      // 恢复原始状态
      document.body.style.overflow = originalOverflow;

      // 转换为图片并下载
      const link = document.createElement('a');
      link.download = `tarot-reading-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Screenshot failed:', error);
    }
  };

  return (
    <motion.div key="reading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 pb-36 px-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <button onClick={onResetAppState} className="flex items-center gap-3 text-yellow-500/60 hover:text-yellow-500 transition-colors text-[10px] uppercase tracking-[0.4em] font-bold group">
          <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> {t.new_question}
        </button>
        <div className="flex items-center gap-4">
          {/* 截图按钮 */}
          {/* <button onClick={handleScreenshot} className="flex items-center gap-3 text-yellow-500/60 hover:text-yellow-500 transition-colors text-[10px] uppercase tracking-[0.4em] font-bold group">
            <Camera className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" /> {t.screenshot || 'Screenshot'}
          </button> */}
          {/* 分享按钮 */}
          <button onClick={() => setShowPoster(true)} className="flex items-center gap-3 text-yellow-500/60 hover:text-yellow-500 transition-colors text-[10px] uppercase tracking-[0.4em] font-bold group">
              <Share2 className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t.share}</span>
          </button>
          {activeTab === 'DAILY' && (
            <button onClick={onStartDailyShuffle} className="flex items-center gap-3 text-yellow-500/60 hover:text-yellow-500 transition-colors text-[10px] uppercase tracking-[0.4em] font-bold group">
              <RefreshCw className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" /> {t.redraw}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-16">
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
              
              {/* 精致四角装饰 */}
              <div className="absolute inset-0 pointer-events-none">
                {/* 上左角 */}
                <svg className="absolute top-3 left-3 w-8 h-8 text-yellow-500/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M0 3h8M3 0v8"/>
                  <path d="M0 0l3 3"/>
                  <path d="M0 6h2M6 0v2"/>
                </svg>
                
                {/* 上右角 */}
                <svg className="absolute top-3 right-3 w-8 h-8 text-yellow-500/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M16 0h8M21 0v8"/>
                  <path d="M24 0l-3 3"/>
                  <path d="M24 6h-2M18 0v2"/>
                </svg>
                
                {/* 下左角 */}
                <svg className="absolute bottom-3 left-3 w-8 h-8 text-yellow-500/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M0 16h8M3 24v-8"/>
                  <path d="M0 24l3-3"/>
                  <path d="M0 18h2M6 24v-2"/>
                </svg>
                
                {/* 下右角 */}
                <svg className="absolute bottom-3 right-3 w-8 h-8 text-yellow-500/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M16 24h8M21 24v-8"/>
                  <path d="M24 24l-3-3"/>
                  <path d="M24 18h-2M18 24v-2"/>
                </svg>
                
                {/* 边框装饰 */}
                <div className="absolute inset-[15px] border border-yellow-500/20 rounded-lg"></div>
                
                {/* 中心光环 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-yellow-500/10 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-yellow-500/5 rounded-full"></div>
              </div>
              
              <span className="text-6xl mb-1 mt-4 relative z-10 drop-shadow-lg">{card.image}</span>
              <h4 className="text-[11px] font-bold text-yellow-100 uppercase tracking-tighter relative z-10 leading-tight">{lang === 'zh' ? card.nameZh : card.name}</h4>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500/20"></div>
            </motion.div>
          ))}
        </div>

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

      <button onClick={onResetAppState} className="w-full mt-16 py-6 glass rounded-[2.5rem] text-yellow-100 font-bold border border-yellow-500/30 uppercase tracking-[0.6em] text-xs shadow-2xl active:scale-95 transition-all hover:bg-yellow-500/5 group">
        <span className="group-hover:tracking-[0.8em] transition-all duration-300">{t.return}</span>
      </button>

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
