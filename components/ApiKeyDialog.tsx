import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Save, Trash2 } from 'lucide-react';
import { Lang } from '../types';

interface ApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  onClear: () => void;
  currentKey: string;
  lang: Lang;
}

export const ApiKeyDialog = ({
  isOpen,
  onClose,
  onSave,
  onClear,
  currentKey,
  lang
}: ApiKeyDialogProps) => {
  const [inputKey, setInputKey] = useState(currentKey);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setInputKey(currentKey);
  }, [currentKey, isOpen]);

  const handleSave = () => {
    if (inputKey.trim()) {
      onSave(inputKey.trim());
    }
  };

  const handleClear = () => {
    setInputKey('');
    onClear();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[radial-gradient(circle_at_center,#1a0b2e_0%,#050505_100%)] backdrop-blur-xl rounded-2xl p-6 max-w-md w-full border border-yellow-500/30 shadow-2xl shadow-yellow-500/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Key className="w-5 h-5 text-yellow-300" />
              </div>
              <h2 className="text-xl font-semibold text-yellow-100">
                {lang === 'zh' ? '设置 API Key' : 'API Key Settings'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-yellow-500/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-yellow-300" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-yellow-200 mb-2">
                {lang === 'zh' ? 'Google Gemini API Key' : 'Google Gemini API Key'}
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder={lang === 'zh' ? '输入您的 API Key...' : 'Enter your API Key...'}
                  className="w-full px-4 py-3 bg-purple-950/70 border border-yellow-500/30 rounded-lg text-yellow-100 placeholder-yellow-400 focus:outline-none focus:border-yellow-400 transition-colors pr-20"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-yellow-300 hover:text-yellow-100 transition-colors"
                >
                  {showKey ? (lang === 'zh' ? '隐藏' : 'Hide') : (lang === 'zh' ? '显示' : 'Show')}
                </button>
              </div>
            </div>

            <p className="text-xs text-yellow-300/70">
              {lang === 'zh' 
                ? '您的 API Key 将安全地保存在本地浏览器中。获取 API Key 请访问：'
                : 'Your API Key will be securely stored in your local browser. Get your API Key at:'}
            </p>
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-yellow-400 hover:text-yellow-300 underline"
            >
              https://makersuite.google.com/app/apikey
            </a>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={!inputKey.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-500 disabled:bg-yellow-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              {lang === 'zh' ? '保存' : 'Save'}
            </button>
            {currentKey && (
              <button
                onClick={handleClear}
                className="px-4 py-3 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
