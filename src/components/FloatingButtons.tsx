import React from 'react';
import { MessageCircle, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FloatingButtons = () => {
  const [showBackToTop, setShowBackToTop] = React.useState(false);

  React.useEffect(() => {
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

      <motion.a
        href="https://wa.me/919911230354?text=Hi%2C%20I%20want%20to%20grow%20my%20business%20with%20Showthink"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,211,102,0.4)]"
      >
        <MessageCircle size={32} fill="currentColor" />
      </motion.a>
    </div>
  );
};

export default FloatingButtons;
