import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import LeaderboardBanner from './LeaderboardBanner';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
          <Link to="/contact" onClick={() => handleLinkClick('/contact')} className="btn-primary py-2 px-6 text-sm">
            Get Started
          </Link>
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
              <Link
                to="/contact"
                onClick={() => handleLinkClick('/contact')}
                className="btn-primary text-center mt-2"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </div>
  );
};

export default Navbar;
