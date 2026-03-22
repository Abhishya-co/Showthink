import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Camera, Loader2, Check, AlertCircle, CreditCard, Shield, Calendar, LogOut } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { useNavigate } from 'react-router-dom';
import { 
  auth, 
  db, 
  setDoc, 
  doc, 
  getDoc,
  updateProfile,
  signOut,
  handleFirestoreError,
  OperationType
} from '../firebase';
import { getCroppedImg } from '../utils/imageUtils';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription'>('profile');
  const [name, setName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Cropping state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen, user?.uid]);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for original image
        setError('Image size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    
    try {
      setIsLoading(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setPhotoURL(croppedImage);
      setIsCropping(false);
      setImageSrc(null);
    } catch (e) {
      console.error(e);
      setError('Failed to crop image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Update Auth Profile (only if photoURL is short enough)
      // Firebase Auth photoURL has a limit of ~2000 characters
      const authUpdate: any = { displayName: name };
      if (photoURL && photoURL.length < 2000) {
        authUpdate.photoURL = photoURL;
      }
      
      await updateProfile(auth.currentUser, authUpdate);

      // 2. Update Firestore (Firestore documents can be up to 1MB, so long URLs are fine here)
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        name: name,
        email: auth.currentUser.email,
        photoURL: photoURL
      }, { merge: true });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Profile update error:', err);
      handleFirestoreError(err, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-black/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass-card p-6 md:p-8 overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
              
              {/* Tabs */}
              <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'profile' ? 'bg-brand-gold text-brand-black' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <User size={14} /> Profile
                </button>
                <button
                  onClick={() => setActiveTab('subscription')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'subscription' ? 'bg-brand-gold text-brand-black' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <CreditCard size={14} /> Subscription
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {activeTab === 'profile' ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Profile Image Section */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full border-2 border-brand-gold/30 overflow-hidden bg-white/5 flex items-center justify-center">
                        {photoURL ? (
                          <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User size={40} className="text-white/20" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 w-8 h-8 bg-brand-gold rounded-full flex items-center justify-center text-brand-black shadow-lg hover:scale-110 transition-transform"
                      >
                        <Camera size={16} />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Recommended: Square Image</p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
                      <AlertCircle size={14} /> {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 ml-1 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input
                        required
                        type="text"
                        placeholder="Your Name"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white focus:border-brand-gold/50 focus:outline-none transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 ml-1 uppercase tracking-wider">Email Address</label>
                    <input
                      disabled
                      type="email"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white/40 cursor-not-allowed"
                      value={user?.email || ''}
                    />
                    <p className="text-[10px] text-white/20 ml-1 italic">Email cannot be changed</p>
                  </div>

                    <button
                      type="submit"
                      disabled={isLoading || success}
                      className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                        success 
                          ? 'bg-green-500 text-white' 
                          : 'bg-brand-gold text-brand-black hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                      }`}
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : success ? (
                        <>
                          <Check size={20} /> Profile Updated
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>

                    <div className="pt-4 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-full py-3 rounded-xl border border-red-500/30 text-red-500 font-bold text-sm hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                      >
                        <LogOut size={16} /> Logout Account
                      </button>
                    </div>
                  </form>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                          <Shield size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-white/40 uppercase font-bold tracking-wider">Current Plan</p>
                          <h3 className="text-xl font-bold text-white">{userProfile?.subscription?.plan || 'Free'} Plan</h3>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        userProfile?.subscription?.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-white/10 text-white/40'
                      }`}>
                        {userProfile?.subscription?.status || 'Active'}
                      </span>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/40 flex items-center gap-2"><Calendar size={14} /> Billing Cycle</span>
                        <span className="text-white font-medium">Monthly</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/40 flex items-center gap-2"><CreditCard size={14} /> Next Payment</span>
                        <span className="text-white font-medium">
                          {userProfile?.subscription?.expiresAt 
                            ? new Date(userProfile.subscription.expiresAt.seconds * 1000).toLocaleDateString()
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-gold/20 to-transparent border border-brand-gold/20">
                    <h4 className="font-bold mb-2">Upgrade to Pro</h4>
                    <p className="text-xs text-white/60 mb-4">Get access to premium features, priority support, and more.</p>
                    <button className="w-full py-3 bg-brand-gold text-brand-black rounded-xl font-bold text-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all">
                      View Plans
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Logout Confirmation Overlay */}
            <AnimatePresence>
              {showLogoutConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[130] flex items-center justify-center bg-brand-black/95 p-6 text-center"
                >
                  <div className="max-w-xs w-full space-y-6">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
                      <LogOut size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Logout Confirmation</h3>
                      <p className="text-sm text-white/60">Are you sure you want to log out of your account?</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowLogoutConfirm(false)}
                        className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 font-bold text-sm hover:bg-white/10 transition-all"
                      >
                        No, Stay
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            await signOut(auth);
                            onClose();
                            navigate('/');
                          } catch (error) {
                            console.error('Logout error:', error);
                          }
                        }}
                        className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all"
                      >
                        Yes, Logout
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cropper Overlay */}
            <AnimatePresence>
              {isCropping && imageSrc && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[120] flex flex-col bg-brand-black"
                >
                  <div className="p-4 flex items-center justify-between border-b border-white/10">
                    <h3 className="text-lg font-bold">Crop Image</h3>
                    <button 
                      onClick={() => {
                        setIsCropping(false);
                        setImageSrc(null);
                      }}
                      className="text-white/40 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="relative flex-1 bg-black/50">
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                      cropShape="round"
                      showGrid={false}
                    />
                  </div>

                  <div className="p-6 bg-brand-black border-t border-white/10 space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        <span>Zoom</span>
                        <span>{Math.round(zoom * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setIsCropping(false);
                          setImageSrc(null);
                        }}
                        className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 font-bold text-xs hover:bg-white/10 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCropSave}
                        disabled={isLoading}
                        className="flex-1 py-2 rounded-lg bg-brand-gold text-brand-black font-bold text-xs hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2"
                      >
                        {isLoading ? <Loader2 className="animate-spin" size={14} /> : 'Apply'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
