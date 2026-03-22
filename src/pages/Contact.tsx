import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, MessageSquare, AlertCircle, CheckCircle2, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { db, serverTimestamp, handleFirestoreError, OperationType, doc, getDoc, setDoc } from '../firebase';

const Contact = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialPlan = queryParams.get('plan') || 'None';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plan: initialPlan,
    service: 'Digital Marketing',
    state: '',
    city: '',
    message: ''
  });

  useEffect(() => {
    if (initialPlan) {
      setFormData(prev => ({ ...prev, plan: initialPlan }));
    }
  }, [initialPlan]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);

  const checkDuplicate = async (email: string) => {
    // Using email as document ID for unique constraint
    const docRef = doc(db, 'messages', email.toLowerCase().trim());
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setDuplicateError(false);

    try {
      const isDuplicate = await checkDuplicate(formData.email);
      if (isDuplicate) {
        setDuplicateError(true);
        setIsSubmitting(false);
        return;
      }
      setIsConfirming(true);
    } catch (error) {
      console.error('Error checking duplicate:', error);
      // If it's a permission error, it might be because the document doesn't exist 
      // but 'get' is restricted. We'll handle this in firestore.rules.
      setDuplicateError(false);
      setIsConfirming(true); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setIsConfirming(false);
    
    const path = `messages/${formData.email.toLowerCase().trim()}`;
    try {
      // Use setDoc with email as ID to enforce uniqueness at the database level
      await setDoc(doc(db, 'messages', formData.email.toLowerCase().trim()), {
        ...formData,
        email: formData.email.toLowerCase().trim(),
        createdAt: serverTimestamp()
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', plan: 'None', service: 'Digital Marketing', state: '', city: '', message: '' });
      
      // Trigger delightful confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFFFFF', '#FACC15'],
        ticks: 200,
        gravity: 1.2,
        scalar: 1.2,
        shapes: ['circle', 'square']
      });

      // Auto-reset success message after 1 second
      setTimeout(() => {
        setSubmitted(false);
      }, 1000);
    } catch (error) {
      console.error('Error submitting form:', error);
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (duplicateError) setDuplicateError(false);
  };

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Confirmation Modal */}
        <AnimatePresence>
          {isConfirming && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-black/90 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg glass-card p-8 md:p-10 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-yellow" />
                <button 
                  onClick={() => setIsConfirming(false)}
                  className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-brand-yellow/20 rounded-xl flex items-center justify-center text-brand-yellow">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Confirm Details</h3>
                    <p className="text-sm text-white/40">Please review your information before sending.</p>
                  </div>
                </div>

                <div className="space-y-6 mb-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Name</p>
                      <p className="font-medium">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Email</p>
                      <p className="font-medium truncate">{formData.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Phone</p>
                      <p className="font-medium">{formData.phone}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Plan</p>
                      <p className="font-medium">{formData.plan}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Service</p>
                    <p className="font-medium">{formData.service}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">State</p>
                      <p className="font-medium">{formData.state}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">City</p>
                      <p className="font-medium">{formData.city}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Message</p>
                    <p className="text-sm text-white/70 line-clamp-4">{formData.message}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setIsConfirming(false)}
                    className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-4 rounded-xl bg-brand-yellow text-brand-black font-bold hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Sending...' : 'Confirm & Send'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold mb-6"
          >
            Let's <span className="text-gradient-yellow">Connect</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            Ready to start your digital journey? Fill out the form below or reach out to us directly.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-card p-8 space-y-8">
              <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-yellow/10 rounded-xl flex items-center justify-center text-brand-yellow shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm text-white/40 mb-1">Email Us</p>
                  <p className="font-bold">a2sfeatures@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-yellow/10 rounded-xl flex items-center justify-center text-brand-yellow shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-sm text-white/40 mb-1">Call Us</p>
                  <p className="font-bold">+91 9911230354</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-yellow/10 rounded-xl flex items-center justify-center text-brand-yellow shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-sm text-white/40 mb-1">Visit Us</p>
                  <p className="font-bold">New Delhi, India</p>
                </div>
              </div>
            </div>

              <div className="glass-card p-8 bg-brand-yellow/5 border-brand-yellow/20">
                <h4 className="text-xl font-bold mb-4">Chat with us on WhatsApp</h4>
                <p className="text-white/60 mb-6 text-sm">
                  Get instant answers to your questions. Our team is active on WhatsApp.
                </p>
                <a
                  href="https://wa.me/919911230354?text=Hi%2C%20I%20want%20to%20grow%20my%20business%20with%20Showthink"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <MessageSquare size={20} /> WhatsApp Now
                </a>
              </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="glass-card p-8 md:p-12">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 relative overflow-hidden"
                >
                  {/* Decorative Sparkles */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                      rotate: [0, 90, 180, 270, 360]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute top-10 left-10 text-brand-yellow/20"
                  >
                    <Sparkles size={40} />
                  </motion.div>
                  <motion.div
                    animate={{ 
                      scale: [1.2, 1, 1.2],
                      opacity: [0.2, 0.5, 0.2],
                      rotate: [360, 270, 180, 90, 0]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-10 right-10 text-brand-yellow/20"
                  >
                    <Sparkles size={60} />
                  </motion.div>

                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className="absolute inset-0 bg-brand-yellow/20 rounded-full"
                    />
                    <svg
                      viewBox="0 0 52 52"
                      className="relative z-10 w-full h-full text-brand-yellow p-4"
                    >
                      <motion.path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.1 27.2l7.1 7.2 16.7-16.8"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      />
                    </svg>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 border-2 border-brand-yellow rounded-full"
                    />
                  </div>
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl md:text-5xl font-extrabold mb-4"
                  >
                    Message <span className="text-gradient-yellow">Successfully Sent!</span>
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/70 mb-10 text-lg max-w-md mx-auto leading-relaxed"
                  >
                    Thank you for reaching out. Our team has been notified and we'll get back to you within 24 hours.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                  >
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn-primary px-8"
                    >
                      Send Another Message
                    </button>
                    <button
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="btn-secondary px-8"
                    >
                      Back to Top
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                <form onSubmit={handleInitialSubmit} className="space-y-6">
                  {duplicateError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3"
                    >
                      <AlertCircle size={20} />
                      <p className="text-sm font-bold">Already submitted form with this email address.</p>
                    </motion.div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-white/60">Full Name</label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-yellow transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-white/60">Email Address</label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={`w-full bg-white/5 border rounded-xl px-6 py-4 focus:outline-none transition-colors ${
                          duplicateError ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-brand-yellow'
                        }`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-white/60">Phone Number</label>
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 00000 00000"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-yellow transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-white/60">State</label>
                      <select
                        required
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-yellow transition-colors appearance-none"
                      >
                        <option className="bg-brand-black" value="">Select State</option>
                        <option className="bg-brand-black" value="Andhra Pradesh">Andhra Pradesh</option>
                        <option className="bg-brand-black" value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option className="bg-brand-black" value="Assam">Assam</option>
                        <option className="bg-brand-black" value="Bihar">Bihar</option>
                        <option className="bg-brand-black" value="Chhattisgarh">Chhattisgarh</option>
                        <option className="bg-brand-black" value="Goa">Goa</option>
                        <option className="bg-brand-black" value="Gujarat">Gujarat</option>
                        <option className="bg-brand-black" value="Haryana">Haryana</option>
                        <option className="bg-brand-black" value="Himachal Pradesh">Himachal Pradesh</option>
                        <option className="bg-brand-black" value="Jharkhand">Jharkhand</option>
                        <option className="bg-brand-black" value="Karnataka">Karnataka</option>
                        <option className="bg-brand-black" value="Kerala">Kerala</option>
                        <option className="bg-brand-black" value="Madhya Pradesh">Madhya Pradesh</option>
                        <option className="bg-brand-black" value="Maharashtra">Maharashtra</option>
                        <option className="bg-brand-black" value="Manipur">Manipur</option>
                        <option className="bg-brand-black" value="Meghalaya">Meghalaya</option>
                        <option className="bg-brand-black" value="Mizoram">Mizoram</option>
                        <option className="bg-brand-black" value="Nagaland">Nagaland</option>
                        <option className="bg-brand-black" value="Odisha">Odisha</option>
                        <option className="bg-brand-black" value="Punjab">Punjab</option>
                        <option className="bg-brand-black" value="Rajasthan">Rajasthan</option>
                        <option className="bg-brand-black" value="Sikkim">Sikkim</option>
                        <option className="bg-brand-black" value="Tamil Nadu">Tamil Nadu</option>
                        <option className="bg-brand-black" value="Telangana">Telangana</option>
                        <option className="bg-brand-black" value="Tripura">Tripura</option>
                        <option className="bg-brand-black" value="Uttar Pradesh">Uttar Pradesh</option>
                        <option className="bg-brand-black" value="Uttarakhand">Uttarakhand</option>
                        <option className="bg-brand-black" value="West Bengal">West Bengal</option>
                        <option className="bg-brand-black" value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                        <option className="bg-brand-black" value="Chandigarh">Chandigarh</option>
                        <option className="bg-brand-black" value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                        <option className="bg-brand-black" value="Delhi">Delhi</option>
                        <option className="bg-brand-black" value="Jammu and Kashmir">Jammu and Kashmir</option>
                        <option className="bg-brand-black" value="Ladakh">Ladakh</option>
                        <option className="bg-brand-black" value="Lakshadweep">Lakshadweep</option>
                        <option className="bg-brand-black" value="Puducherry">Puducherry</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-white/60">City</label>
                      <input
                        required
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. New Delhi"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-yellow transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-white/60">Select Plan</label>
                      <select
                        name="plan"
                        value={formData.plan}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-yellow transition-colors appearance-none"
                      >
                        <option className="bg-brand-black" value="None">None</option>
                        <option className="bg-brand-black" value="Basic Plan">Basic Plan</option>
                        <option className="bg-brand-black" value="Standard Plan">Standard Plan</option>
                        <option className="bg-brand-black" value="Premium Plan">Premium Plan</option>
                      </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-white/60">Service Interested In</label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-yellow transition-colors appearance-none"
                      >
                        <option className="bg-brand-black" value="Digital Marketing">Digital Marketing</option>
                        <option className="bg-brand-black" value="Website Development">Website Development</option>
                        <option className="bg-brand-black" value="Graphic Design">Graphic Design</option>
                        <option className="bg-brand-black" value="Social Media Management">Social Media Management</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/60">Your Message</label>
                    <textarea
                      required
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project..."
                      rows={6}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-yellow transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Checking...' : (
                      <>
                        Send Message <Send size={20} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
