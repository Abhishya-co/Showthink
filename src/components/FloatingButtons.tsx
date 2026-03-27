import React, { useState, useEffect } from 'react';
import { ArrowUp, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ChatBot from './ChatBot';

const FloatingButtons = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 200px
      setShowBackToTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 items-end">
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            whileHover={{ scale: 1.1, backgroundColor: '#2563EB', color: '#FFFFFF' }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="group relative w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)]"
            title="Scroll to Top"
          >
            <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
            <span className="absolute right-full mr-4 px-3 py-1 bg-brand-blue text-brand-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Back to Top
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-3 items-end">
        {/* AI Chatbot Button - Primary */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-brand-black shadow-2xl transition-all duration-300 ${
            isChatOpen ? 'bg-white text-brand-black' : 'bg-brand-yellow text-brand-black'
          }`}
          title={isChatOpen ? "Close Chat" : "Chat with AI"}
        >
          {isChatOpen ? <X size={28} /> : <Bot size={32} />}
          {!isChatOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-brand-black animate-pulse" />
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default FloatingButtons;
