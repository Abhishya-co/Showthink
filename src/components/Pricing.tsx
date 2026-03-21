import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Zap, Star, Crown, ArrowRight, X, PartyPopper } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';

const Pricing = () => {
  const location = useLocation();
  const isClaimed = new URLSearchParams(location.search).get('claimed') === 'true';
  const [showPopup, setShowPopup] = useState(false);
  const standardPlanRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isClaimed) {
      setShowPopup(true);
      
      // Auto-close popup after 1 second
      const timer = setTimeout(() => {
        setShowPopup(false);
        // Scroll to standard plan after popup closes
        standardPlanRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1000);

      // Trigger confetti
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [isClaimed]);

  const plans = [
    {
      name: 'Basic Plan',
      price: '4,999',
      icon: Zap,
      features: [
        '5 Pages Website',
        'Mobile Responsive',
        'Basic SEO',
        'Delivery: 10–14 Days',
        'Standard Support'
      ],
      highlighted: false
    },
    {
      name: 'Standard Plan',
      price: '9,999',
      originalPrice: '14,284',
      icon: Star,
      badge: 'Most Popular',
      offer: 'Special Offer: 30% OFF',
      features: [
        '8 Pages Website',
        'SEO Optimized',
        'Speed Optimized',
        'Contact Form Integration',
        'Delivery: 7 Days',
        'Priority Email Support'
      ],
      highlighted: true
    },
    {
      name: 'Premium Plan',
      price: '19,999',
      icon: Crown,
      features: [
        'Full Custom Website',
        'Advanced UI/UX Design',
        'SEO + Speed + Security',
        'Priority 24/7 Support',
        'Delivery: 7 Days Express',
        'Free Domain & Hosting (1yr)'
      ],
      highlighted: false
    }
  ];

  return (
    <section className="py-24 px-6 bg-brand-black relative">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                className="relative max-w-md w-full bg-brand-black border border-brand-gold/30 p-10 rounded-[40px] shadow-[0_0_50px_rgba(255,215,0,0.2)] text-center overflow-hidden"
              >
                {/* Decorative background */}
                <div className="absolute top-0 left-0 w-full h-2 bg-brand-gold" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-gold/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-gold/10 rounded-full blur-3xl" />

                <button 
                  onClick={() => setShowPopup(false)}
                  className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-8 text-brand-gold animate-bounce">
                  <PartyPopper size={40} />
                </div>

                <h2 className="text-3xl font-extrabold mb-4">Congratulations!</h2>
                <p className="text-white/70 mb-8 leading-relaxed">
                  Your <span className="text-brand-gold font-bold">30% Special Discount</span> has been successfully claimed for the Standard Plan.
                </p>

                <button
                  onClick={() => setShowPopup(false)}
                  className="w-full py-4 bg-brand-gold text-brand-black font-bold rounded-2xl hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all duration-300"
                >
                  Awesome!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          >
            Transparent <span className="text-gradient-gold">Pricing</span> Plans
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            Choose the perfect plan for your business needs. No hidden costs, just premium results.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              ref={plan.highlighted ? standardPlanRef : null}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-500 hover:scale-[1.02] ${
                plan.highlighted
                  ? 'bg-brand-gold/5 border-brand-gold shadow-[0_0_30px_rgba(255,215,0,0.15)] z-10'
                  : 'bg-white/5 border-white/10 hover:border-brand-gold/30'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-gold text-brand-black text-xs font-bold rounded-full uppercase tracking-widest shadow-lg">
                  {plan.badge}
                </div>
              )}

              <div className="mb-8">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                  plan.highlighted ? 'bg-brand-gold text-brand-black' : 'bg-white/10 text-brand-gold'
                }`}>
                  <plan.icon size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex flex-col gap-1 mb-2">
                  {plan.originalPrice && (
                    <span className="text-white/40 text-sm line-through font-medium">₹{plan.originalPrice}</span>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-brand-gold">₹{plan.price}</span>
                    <span className="text-white/40 text-sm font-semibold">/ project</span>
                  </div>
                </div>
                {plan.offer && (
                  <div className="inline-block px-3 py-1 bg-brand-gold/10 text-brand-gold text-[10px] font-bold rounded-full uppercase tracking-wider mb-4 border border-brand-gold/20">
                    {plan.offer}
                  </div>
                )}
              </div>

              <div className="flex-grow space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      plan.highlighted ? 'bg-brand-gold text-brand-black' : 'bg-brand-gold/20 text-brand-gold'
                    }`}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-white/70 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/contact"
                className={`w-full py-4 rounded-xl font-bold text-center transition-all duration-300 flex items-center justify-center gap-2 ${
                  plan.highlighted
                    ? 'bg-brand-gold text-brand-black hover:shadow-[0_0_20px_rgba(255,215,0,0.4)]'
                    : 'bg-white/10 text-white hover:bg-brand-gold hover:text-brand-black'
                }`}
              >
                Get Started <ArrowRight size={18} />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-white/40 text-sm">
            Need a custom enterprise solution? <Link to="/contact" className="text-brand-gold hover:underline">Contact us</Link> for a tailored quote.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
