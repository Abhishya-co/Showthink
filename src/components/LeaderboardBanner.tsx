import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';

const LeaderboardBanner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isClaimed = new URLSearchParams(location.search).get('claimed') === 'true' || localStorage.getItem('claimed_offer') === 'true';

  const handleClaim = () => {
    localStorage.setItem('claimed_offer', 'true');
    navigate('/pricing?claimed=true');
  };

  return (
    <div className="w-full bg-brand-black border-b border-white/5 flex justify-center items-center py-4 px-4 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={handleClaim}
        className="relative w-full max-w-[728px] h-[90px] bg-gradient-to-r from-brand-gold/20 to-brand-gold/5 rounded-lg border border-brand-gold/20 flex items-center justify-between px-8 group cursor-pointer overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-full bg-brand-gold/10 skew-x-[-20deg] translate-x-10 group-hover:translate-x-5 transition-transform duration-500" />
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="hidden sm:flex w-12 h-12 bg-brand-gold rounded-full items-center justify-center text-brand-black font-bold text-xl shadow-lg shadow-brand-gold/20">
            %
          </div>
          <div>
            <h3 className="text-brand-gold font-bold text-lg sm:text-xl leading-tight">
              Special Offer: 30% OFF
            </h3>
            <p className="text-white/60 text-xs sm:text-sm">
              On all Digital Marketing packages this month!
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <button className={`bg-brand-gold text-brand-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-all ${
            isClaimed 
              ? 'animate-pulse shadow-[0_0_15px_rgba(255,215,0,0.6)] scale-110' 
              : 'hover:scale-105'
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
