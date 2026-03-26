import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const VideoSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-16 px-6 bg-brand-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-yellow/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
            See How <span className="text-gradient-yellow">Showthink</span> Helps You Grow
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Watch our 60-second intro to discover how we transform businesses through strategic digital solutions.
          </p>
        </motion.div>

        {/* Video Player Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto group cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src="https://senior-lavender-y8ktygggml.edgeone.app/file_0000000067c4720b95e1c4b1d5c657c5.jpg"
              alt="Video Preview"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-brand-black/40 group-hover:bg-brand-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-yellow rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity animate-pulse" />
                <div className="w-20 h-20 md:w-24 md:h-24 bg-brand-yellow rounded-full flex items-center justify-center text-brand-black relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                  <Play size={32} fill="currentColor" className="ml-1" />
                </div>
              </div>
            </div>
            
            {/* Overlay Text */}
            <div className="absolute bottom-8 left-8 right-8 text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="glass-card p-4 md:p-6 inline-block backdrop-blur-xl border-white/20"
              >
                <p className="text-brand-yellow font-bold text-sm uppercase tracking-widest mb-1">Intro Video</p>
                <h3 className="text-xl md:text-2xl font-bold">Strategic Growth & Digital Excellence</h3>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* CTA Below Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-4">
            Start Your Growth Journey <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-brand-black/95 backdrop-blur-xl"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors p-2"
            >
              <X size={32} />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-6xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10"
            >
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/ADMaLnGhuuI?autoplay=1"
                title="Showthink Intro Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VideoSection;
