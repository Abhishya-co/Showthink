import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { 
  signInWithGoogle, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail,
  auth,
  db,
  setDoc,
  doc,
  serverTimestamp,
  handleFirestoreError,
  OperationType
} from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Reset state when modal opens/closes or initialMode changes
  React.useEffect(() => {
    if (isOpen) {
      setIsLogin(initialMode === 'login');
      setIsForgotPassword(false);
      setError(null);
      setSuccessMessage(null);
      setFormData({ name: '', email: '', password: '' });
    }
  }, [isOpen, initialMode]);

  const getErrorMessage = (err: any) => {
    const code = err.code || '';
    const message = err.message || '';

    if (code === 'auth/email-already-in-use') return 'This email is already registered. Please sign in instead.';
    if (code === 'auth/invalid-credential') return 'Invalid email or password. Please check your details and try again.';
    if (code === 'auth/user-not-found') return 'No account found with this email. Please sign up first.';
    if (code === 'auth/wrong-password') return 'Incorrect password. Please try again.';
    if (code === 'auth/weak-password') return 'Password should be at least 6 characters.';
    if (code === 'auth/popup-closed-by-user') return 'Sign-in window was closed. Please try again.';
    if (code === 'auth/cancelled-popup-request') return 'Sign-in request was cancelled.';
    
    if (message.includes('auth/invalid-credential')) return 'Invalid email or password. Please check your details.';
    
    return message || 'An unexpected error occurred. Please try again.';
  };

  const saveUserToFirestore = async (user: any, name: string) => {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name || user.displayName || 'User',
        email: user.email,
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp()
      }, { merge: true });
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        await saveUserToFirestore(user, user.displayName || '');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isForgotPassword) {
        await sendPasswordResetEmail(auth, formData.email);
        setSuccessMessage('Password reset email sent! Please check your inbox.');
        return;
      }

      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(userCredential.user, {
          displayName: formData.name
        });
        await saveUserToFirestore(userCredential.user, formData.name);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass-card p-6 md:p-8 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-yellow to-transparent" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-4">
                {isForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Join Showthink')}
              </h2>
              
              {/* Tabs */}
              {!isForgotPassword && (
                <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 mb-6">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                      isLogin ? 'bg-brand-yellow text-brand-black shadow-lg' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                      !isLogin ? 'bg-brand-yellow text-brand-black shadow-lg' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {isForgotPassword && (
                <p className="text-sm text-white/60 mb-6">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs text-center">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {!isLogin && !isForgotPassword && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/40 ml-1 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input
                      required
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white focus:border-brand-yellow/50 focus:outline-none transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-white/40 ml-1 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input
                    required
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white focus:border-brand-yellow/50 focus:outline-none transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {!isForgotPassword && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Password</label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        className="text-[10px] text-brand-yellow hover:underline font-bold uppercase tracking-wider"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input
                      required
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white focus:border-brand-yellow/50 focus:outline-none transition-all"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 text-base font-bold flex items-center justify-center gap-2 mt-1"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Sign Up')} <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {isForgotPassword && (
              <button
                onClick={() => setIsForgotPassword(false)}
                className="w-full text-center mt-4 text-xs text-brand-yellow font-bold hover:underline uppercase tracking-wider"
              >
                Back to Sign In
              </button>
            )}

            {!isForgotPassword && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-brand-black px-4 text-white/40 font-bold tracking-widest">Or continue with</span>
                  </div>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-white text-brand-black font-bold flex items-center justify-center gap-3 hover:bg-white/90 transition-all text-sm"
                >
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                  Sign in with Google
                </button>

                <p className="text-center mt-6 text-sm text-white/40">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setIsForgotPassword(false);
                    }}
                    className="text-brand-yellow font-bold hover:underline"
                  >
                    {isLogin ? 'Create one' : 'Sign in'}
                  </button>
                </p>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
