import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../constants';

const TestimonialsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9
    })
  };

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % TESTIMONIALS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="py-24 px-6 bg-brand-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          >
            What Our <span className="text-gradient-gold">Clients Say</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            Real feedback from the businesses we've helped grow.
          </motion.p>
        </div>

        <div className="relative h-[500px] md:h-[400px] flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 }
              }}
              className="absolute w-full max-w-4xl"
            >
              <div className="glass-card p-8 md:p-12 relative">
                <Quote className="absolute top-8 right-8 text-brand-gold/20" size={80} />
                
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                  <div className="shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-brand-gold rounded-full blur-md opacity-30" />
                      <img
                        src={TESTIMONIALS[currentIndex].image}
                        alt={TESTIMONIALS[currentIndex].name}
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-brand-gold/50 object-cover relative z-10"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  <div className="flex-grow text-center md:text-left">
                    <div className="flex justify-center md:justify-start gap-1 text-brand-gold mb-4">
                      {[...Array(TESTIMONIALS[currentIndex].rating)].map((_, i) => (
                        <Star key={i} size={20} fill="currentColor" />
                      ))}
                    </div>
                    
                    <p className="text-xl md:text-2xl text-white/90 italic mb-8 leading-relaxed font-medium">
                      "{TESTIMONIALS[currentIndex].content}"
                    </p>

                    <div>
                      <h4 className="text-xl font-bold text-white">{TESTIMONIALS[currentIndex].name}</h4>
                      <p className="text-brand-gold font-medium">{TESTIMONIALS[currentIndex].role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none px-4 md:-px-12">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-brand-black transition-all pointer-events-auto backdrop-blur-md"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-brand-black transition-all pointer-events-auto backdrop-blur-md"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-2 transition-all duration-300 rounded-full ${
                currentIndex === index ? 'w-8 bg-brand-gold' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
