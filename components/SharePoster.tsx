import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Loader2, QrCode } from 'lucide-react';
import { SavedReading, Lang } from '../types';
import { TRANSLATIONS } from '../constants';
import * as htmlToImage from 'html-to-image';

interface SharePosterProps {
  data: SavedReading;
  lang: Lang;
  onClose: () => void;
}

export const SharePoster = ({ data, lang, onClose }: SharePosterProps) => {
  const t = TRANSLATIONS[lang];
  const [isDownloading, setIsDownloading] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  // 下载海报功能
  const handleDownloadPoster = async () => {
    if (!posterRef.current) return;

    try {
      setIsDownloading(true);

      // 临时禁用动画，确保截图清晰
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // 生成高质量截图，禁用远程 CSS 内联以避免安全错误
      const dataUrl = await htmlToImage.toPng(posterRef.current, {
        pixelRatio: 2, // 提高清晰度
        backgroundColor: '#000000', // 设置背景色
        quality: 1.0, // 最高质量
        cacheBust: true, // 避免缓存问题
        includeQueryParams: true, // 包含查询参数
        useCORS: true, // 启用 CORS
        allowTaint: true, // 允许污染的画布
        removeContainer: false, // 不移除容器
        fetchPermission: (url) => {
          // 禁用远程字体 CSS 的内联
          if (url.includes('fonts.googleapis.com')) {
            return Promise.resolve('deny');
          }
          return Promise.resolve('allow');
        }
      });

      // 恢复原始状态
      document.body.style.overflow = originalOverflow;

      // 转换为图片并下载
      const link = document.createElement('a');
      link.download = `celestial-arcana-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Poster download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-6 backdrop-blur-2xl"
    >
      <div className="relative w-full max-w-[380px] flex flex-col items-center">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-black/90 flex items-center justify-center border border-yellow-500/40 text-yellow-500 hover:bg-black hover:border-yellow-500/60 hover:text-yellow-400 transition-all z-[210] mb-0"
        >
          <X className="w-5 h-5" />
        </motion.button>
        
        <div className="w-0.5 h-4 bg-gradient-to-b from-transparent via-yellow-500/80 to-transparent relative mb-0 rounded-full">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-300/95 to-transparent blur-sm"
            animate={{ 
              y: ["-100%", "100%"],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 1.5, 
              ease: "easeInOut", 
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-200 to-transparent"
            animate={{ 
              y: ["-100%", "100%"],
              opacity: [0, 0.8, 0]
            }}
            transition={{ 
              duration: 1.5, 
              ease: "easeInOut", 
              repeat: Infinity,
              repeatType: "loop",
              delay: 0.3
            }}
          />
        </div>
        
        <div 
          ref={posterRef}
          className="relative w-full max-w-[380px] aspect-[9/16] overflow-hidden rounded-[3rem] border border-white/20 shadow-[0_0_80px_rgba(0,0,0,1)] flex flex-col items-center bg-black"
        >
        {/* 额外的边框线条和光影效果 */}
        <div className="absolute inset-0 border-2 border-yellow-500/10 rounded-[3rem]"></div>
        <div className="absolute inset-2 border border-white/5 rounded-[2.5rem]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#1a0b2e] to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.1),transparent_70%)]"></div>
        <div className="relative z-10 w-full h-full p-10 flex flex-col items-center justify-between text-center">
          <div className="space-y-2 mt-4">
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 to-yellow-600 tracking-[0.3em] font-serif uppercase">{t.title}</h2>
            <div className="h-[1px] w-16 bg-yellow-500/30 mx-auto"></div>
            <p className="text-[8px] text-gray-500 tracking-[0.4em] font-black uppercase opacity-60">
              {new Date(data.timestamp).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col items-center flex-1 justify-center py-6">
            <span className="text-8xl drop-shadow-[0_15px_15px_rgba(0,0,0,1)] relative z-20 mb-6">
              {data.cards[0].image}
            </span>
            <h3 className="text-lg font-serif text-yellow-50 font-black tracking-widest uppercase mb-1">
              {lang === 'zh' ? data.cards[0].nameZh : data.cards[0].name}
            </h3>
            <div className="px-3 py-0.5 rounded-full border border-yellow-500/30 bg-yellow-500/5">
              <span className="text-[8px] font-black text-yellow-500 uppercase tracking-[0.2em]">
                 {data.zodiac || 'CELESTIAL'}
              </span>
            </div>
          </div>
          <div className="w-full px-2 text-center mb-8">
             <p className="text-lg font-serif italic text-yellow-100/90 leading-relaxed">
               "{data.summary}"
             </p>
          </div>
          <div className="w-full flex items-end justify-between border-t border-white/5 pt-6 pb-2">
            <div className="text-left">
               <p className="text-[10px] font-black text-yellow-500 tracking-wider">星辰神谕</p>
            </div>
            <QrCode className="w-6 h-6 text-yellow-500/20" />
          </div>
        </div>
        </div>
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-12">
        <button 
          disabled={isDownloading}
          onClick={handleDownloadPoster}
          className="flex items-center gap-4 px-10 py-5 rounded-full bg-white/10 border border-white/20 text-white transition-all active:scale-95"
        >
          {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5 text-yellow-500" />}
          <span className="text-[11px] font-black uppercase tracking-[0.4em]">{isDownloading ? t.generating : t.save_hint}</span>
        </button>
      </motion.div>
    </motion.div>
  );
};