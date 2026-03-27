import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Zap, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { auth, db, doc, onSnapshot } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import AuthModal from './AuthModal';
import ProfileModal from './ProfileModal';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profileData, setProfileData] = useState<{ name?: string; photoURL?: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    let unsubscribeFirestore: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Listen to Firestore for real-time profile updates
        unsubscribeFirestore = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            setProfileData(docSnap.data());
          }
        });
      } else {
        setProfileData(null);
        if (unsubscribeFirestore) unsubscribeFirestore();
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Domain Search', path: '/domain-search' },
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

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={cn(
          'transition-all duration-300 px-6 py-4',
          scrolled ? 'bg-brand-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" onClick={() => handleLinkClick('/')} className="flex items-center gap-2 group">
          <img 
            src="https://i.ibb.co/DfjZPT7q/Picsart-26-03-27-23-32-37-542.png" 
            alt="Showthink Logo" 
            className="h-10 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="text-2xl font-extrabold tracking-tighter">
            SHOW<span className="text-brand-yellow">THINK</span>
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
                'text-sm font-semibold transition-colors hover:text-brand-yellow',
                location.pathname === link.path ? 'text-brand-yellow' : 'text-white/70'
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
                {(profileData?.photoURL || user.photoURL) ? (
                  <img src={profileData?.photoURL || user.photoURL || ''} alt={profileData?.name || user.displayName || ''} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <User size={16} className="text-brand-yellow" />
                )}
                <span className="text-xs font-bold truncate max-w-[100px] group-hover:text-brand-yellow transition-colors">
                  {(profileData?.name || user.displayName)?.split(' ')[0] || 'User'}
                </span>
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
                    location.pathname === link.path ? 'text-brand-yellow' : 'text-white'
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
                    {(profileData?.photoURL || user.photoURL) ? (
                      <img src={profileData?.photoURL || user.photoURL || ''} alt={profileData?.name || user.displayName || ''} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <User size={24} className="text-brand-yellow" />
                    )}
                    <div className="flex-1">
                      <div className="font-bold">{profileData?.name || user.displayName || 'User'}</div>
                      <div className="text-xs text-white/40">{user.email}</div>
                    </div>
                    <div className="text-brand-yellow text-[10px] font-bold uppercase tracking-widest">Edit</div>
                  </div>
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
