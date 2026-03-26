import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Zap, Star, Crown, ArrowRight, X, PartyPopper, Lock, ArrowLeft, Clock } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { auth } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import AuthModal from './AuthModal';

const Pricing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isClaimed = new URLSearchParams(location.search).get('claimed') === 'true' || localStorage.getItem('claimed_offer') === 'true';
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [viewState, setViewState] = useState<'plans' | 'image' | 'wait'>('plans');
  const [countdown, setCountdown] = useState(60);
  const standardPlanRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: any;
    let interval: any;
    
    if (viewState === 'image') {
      setCountdown(60);
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setViewState('wait');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [viewState]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsInitialLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Only show popup if it's the first time claiming in this session
    const hasSeenPopup = sessionStorage.getItem('claimed_popup_seen') === 'true';
    
    if (isClaimed && !hasSeenPopup) {
      setShowPopup(true);
      sessionStorage.setItem('claimed_popup_seen', 'true');
      
      // Auto-close popup after 1 second
      const timer = setTimeout(() => {
        setShowPopup(false);
        // Scroll to standard plan after popup closes
        standardPlanRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1000);

      // Trigger confetti
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0, colors: ['#FACC15', '#FFFFFF', '#FDE047'] };

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
      price: isClaimed ? '9,999' : '14,284',
      originalPrice: isClaimed ? '14,284' : undefined,
      icon: Star,
      badge: 'Most Popular',
      offer: isClaimed ? 'Special Offer: 30% OFF Applied' : 'Special Offer: 30% OFF Available',
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
    <section className="pt-24 pb-6 px-6 bg-brand-black relative min-h-[600px]">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {viewState === 'image' && (
            <motion.div
              key="image-view"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <button
                onClick={() => setViewState('plans')}
                className="mb-8 flex items-center gap-2 text-white/60 hover:text-brand-yellow transition-colors font-bold"
              >
                <ArrowLeft size={20} /> Back to Plans
              </button>
              <div className="flex flex-col items-center gap-4">
                <div className="bg-brand-yellow/10 border border-brand-yellow/30 px-6 py-2 rounded-full text-brand-yellow font-bold text-sm animate-pulse">
                  Expires in: {countdown}s
                </div>
                <div className="relative max-w-[250px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <img
                    src="https://cruel-sapphire-woscagqkjm.edgeone.app/IMG-20260324-WA0009~2.jpg"
                    alt="Special Offer"
                    className="w-full h-auto"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {viewState === 'wait' && (
            <motion.div
              key="wait-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-24 h-24 bg-brand-yellow/10 rounded-full flex items-center justify-center text-brand-yellow mb-8 animate-pulse">
                <Clock size={48} />
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold mb-6">Session <span className="text-gradient-yellow">Expired</span></h2>
              <div className="glass-card px-8 py-4 mb-12 border-brand-yellow/20">
                <p className="text-3xl font-bold text-brand-yellow">2 Hours Wait</p>
                <p className="text-sm text-white/40 mt-1">Coming soon, contact our team</p>
              </div>
              <button
                onClick={() => setViewState('plans')}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft size={20} /> Back to Pricing
              </button>
            </motion.div>
          )}

          {viewState === 'plans' && (
            <motion.div
              key="plans-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
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
                className="relative max-w-md w-full bg-brand-black border border-brand-yellow/30 p-10 rounded-[40px] shadow-[0_0_50px_rgba(250,204,21,0.2)] text-center overflow-hidden"
              >
                {/* Decorative background */}
                <div className="absolute top-0 left-0 w-full h-2 bg-brand-yellow" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-yellow/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-yellow/10 rounded-full blur-3xl" />

                <button 
                  onClick={() => setShowPopup(false)}
                  className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="w-20 h-20 bg-brand-yellow/20 rounded-full flex items-center justify-center mx-auto mb-8 text-brand-yellow animate-bounce">
                  <PartyPopper size={40} />
                </div>

                <h2 className="text-3xl font-extrabold mb-4">Congratulations!</h2>
                <p className="text-white/70 mb-8 leading-relaxed">
                  Your <span className="text-brand-yellow font-bold">30% Special Discount</span> has been successfully claimed for the Standard Plan.
                </p>

                <button
                  onClick={() => setShowPopup(false)}
                  className="w-full py-4 bg-brand-yellow text-brand-black font-bold rounded-2xl hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all duration-300"
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
            Transparent <span className="text-gradient-yellow">Pricing</span> Plans
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto mb-10"
          >
            Choose the perfect plan for your business needs. No hidden costs, just premium results.
          </motion.p>

          {!user && !isInitialLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 max-w-xl mx-auto border-brand-yellow/30 bg-brand-yellow/5"
            >
              <div className="w-16 h-16 bg-brand-yellow/20 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-yellow">
                <Lock size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Login to Unlock Plans</h3>
              <p className="text-white/60 mb-8">
                To view our detailed pricing and start your project, please log in to your account first.
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="btn-primary py-4 px-10 text-lg"
              >
                Login / Get Started
              </button>
            </motion.div>
          )}
        </div>

        {user && (
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                ref={plan.highlighted ? standardPlanRef : null}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex flex-col p-6 rounded-3xl border transition-all duration-500 hover:scale-[1.02] ${
                  plan.highlighted
                    ? 'bg-brand-yellow/5 border-brand-yellow shadow-[0_0_30px_rgba(250,204,21,0.15)] z-10'
                    : 'bg-white/5 border-white/10 hover:border-brand-yellow/30'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-yellow text-brand-black text-xs font-bold rounded-full uppercase tracking-widest shadow-lg">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                    plan.highlighted ? 'bg-brand-yellow text-brand-black' : 'bg-white/10 text-brand-yellow'
                  }`}>
                    <plan.icon size={20} />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <div className="flex flex-col gap-0.5 mb-1">
                    {plan.originalPrice && (
                      <span className="text-white/40 text-sm line-through font-medium">₹{plan.originalPrice}</span>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-brand-yellow">₹{plan.price}</span>
                      <span className="text-white/40 text-sm font-semibold">/ project</span>
                    </div>
                  </div>
                  {plan.offer && (
                    <div className="inline-block px-3 py-1 bg-brand-yellow/10 text-brand-yellow text-[10px] font-bold rounded-full uppercase tracking-wider mb-4 border border-brand-yellow/20">
                      {plan.offer}
                    </div>
                  )}
                </div>

                <div className="flex-grow space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.highlighted ? 'bg-brand-yellow text-brand-black' : 'bg-brand-yellow/20 text-brand-yellow'
                      }`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-white/70 text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setViewState('image')}
                  className={`w-full py-3 rounded-xl font-bold text-center transition-all duration-300 flex items-center justify-center gap-2 ${
                    plan.highlighted
                      ? 'bg-brand-yellow text-brand-black hover:shadow-[0_0_20px_rgba(250,204,21,0.4)]'
                      : 'bg-white/10 text-white hover:bg-brand-yellow hover:text-brand-black'
                  }`}
                >
                  Get Started <ArrowRight size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {user && viewState === 'plans' && (
          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm">
              Need a custom enterprise solution? <Link to="/contact" className="text-brand-yellow hover:underline">Contact us</Link> for a tailored quote.
            </p>
          </div>
        )}
      </motion.div>
    )}
  </AnimatePresence>

  <AuthModal 
    isOpen={isAuthModalOpen} 
    onClose={() => setIsAuthModalOpen(false)} 
    onSuccess={() => setIsAuthModalOpen(false)}
  />
</div>
</section>
);
};

export default Pricing;
