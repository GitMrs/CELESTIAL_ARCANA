import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface CardBackProps {
  glow?: boolean;
  animate?: boolean;
}

export const CardBack = ({ glow = false, animate = false }: CardBackProps) => (
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
