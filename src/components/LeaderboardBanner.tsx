import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const LeaderboardBanner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isClaimed, setIsClaimed] = useState(false);

  useEffect(() => {
    // Initial check from URL or localStorage
    const urlClaimed = new URLSearchParams(location.search).get('claimed') === 'true';
    const localClaimed = localStorage.getItem('claimed_offer') === 'true';
    
    if (urlClaimed || localClaimed) {
      setIsClaimed(true);
    }

    // Listen for auth changes to reset on logout
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // User logged out, reset claim status
        setIsClaimed(false);
        localStorage.removeItem('claimed_offer');
      }
    });

    return () => unsubscribe();
  }, [location.search]);

  const handleClaim = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClaimed(true);
    localStorage.setItem('claimed_offer', 'true');
    // Optional: navigate to pricing after a short delay to show "Congratulations"
    setTimeout(() => {
      navigate('/pricing?claimed=true');
    }, 1500);
  };

  return (
    <div className="w-full flex justify-center items-center overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full min-h-[100px] bg-gradient-to-r from-brand-yellow/20 to-brand-yellow/5 border-y border-brand-yellow/20 flex flex-col sm:flex-row items-center justify-between p-4 sm:px-12 group cursor-default overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-full bg-brand-yellow/10 skew-x-[-20deg] translate-x-10 group-hover:translate-x-5 transition-transform duration-500" />
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="hidden sm:flex w-12 h-12 bg-brand-yellow rounded-full items-center justify-center text-brand-black font-bold text-xl shadow-lg shadow-brand-yellow/20">
            %
          </div>
          <div>
            <h3 className="text-brand-yellow font-bold text-lg sm:text-xl leading-tight">
              Special Offer: 30% OFF
            </h3>
            <p className="text-white/60 text-xs sm:text-sm">
              On all Digital Marketing packages this month!
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <button 
            onClick={handleClaim}
            disabled={isClaimed}
            className={`bg-brand-yellow text-brand-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-all ${
            isClaimed 
              ? 'animate-pulse shadow-[0_0_15px_rgba(255,215,0,0.6)] scale-110 cursor-default' 
              : 'hover:scale-105 cursor-pointer active:scale-95'
          }`}>
            {isClaimed ? 'Congratulations!' : 'Claim Now'}
          </button>
        </div>

        {/* Glossy effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </motion.div>
    </div>
  );
};

export default LeaderboardBanner;
