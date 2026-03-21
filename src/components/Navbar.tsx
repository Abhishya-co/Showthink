import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Zap, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import AuthModal from './AuthModal';
import ProfileModal from './ProfileModal';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import LeaderboardBanner from './LeaderboardBanner';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLinkClick = (path: string) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/contact');
    } else {
      setIsAuthModalOpen(true);
    }
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <LeaderboardBanner />
      <nav
        className={cn(
          'transition-all duration-300 px-6 py-4',
          scrolled ? 'bg-brand-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" onClick={() => handleLinkClick('/')} className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand-gold rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Zap className="text-brand-black fill-brand-black" size={24} />
          </div>
          <span className="text-2xl font-extrabold tracking-tighter">
            SHOW<span className="text-brand-gold">THINK</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => handleLinkClick(link.path)}
              className={cn(
                'text-sm font-semibold transition-colors hover:text-brand-gold',
                location.pathname === link.path ? 'text-brand-gold' : 'text-white/70'
              )}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <User size={16} className="text-brand-gold" />
                )}
                <span className="text-xs font-bold truncate max-w-[100px] group-hover:text-brand-gold transition-colors">{user.displayName?.split(' ')[0] || 'User'}</span>
              </button>
              <button onClick={handleLogout} className="text-white/60 hover:text-brand-gold transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button onClick={handleGetStarted} className="btn-primary py-2 px-6 text-sm">
              Get Started
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-brand-black border-b border-white/10 p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={cn(
                    'text-lg font-semibold',
                    location.pathname === link.path ? 'text-brand-gold' : 'text-white'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <div className="flex flex-col gap-4 mt-2">
                  <div 
                    onClick={() => {
                      setIsProfileModalOpen(true);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <User size={24} className="text-brand-gold" />
                    )}
                    <div className="flex-1">
                      <div className="font-bold">{user.displayName || 'User'}</div>
                      <div className="text-xs text-white/40">{user.email}</div>
                    </div>
                    <div className="text-brand-gold text-[10px] font-bold uppercase tracking-widest">Edit</div>
                  </div>
                  <button onClick={handleLogout} className="btn-secondary w-full flex items-center justify-center gap-2">
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGetStarted}
                  className="btn-primary text-center mt-2"
                >
                  Get Started
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>

    <AuthModal 
      isOpen={isAuthModalOpen} 
      onClose={() => setIsAuthModalOpen(false)} 
      onSuccess={() => navigate('/contact')} 
    />

    <ProfileModal
      isOpen={isProfileModalOpen}
      onClose={() => setIsProfileModalOpen(false)}
      user={user}
    />
    </div>
  );
};

export default Navbar;
