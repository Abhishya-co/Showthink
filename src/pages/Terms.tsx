import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, FileText, Lock, Scale } from 'lucide-react';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-yellow/10 text-brand-yellow text-sm font-bold mb-6"
          >
            <Shield size={16} /> Legal Information
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold mb-6"
          >
            Terms & <span className="text-gradient-yellow">Conditions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60"
          >
            Last updated: March 25, 2026
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 md:p-12 space-y-12"
        >
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-brand-yellow">
              <FileText size={24} />
              <h2 className="text-2xl font-bold">1. Agreement to Terms</h2>
            </div>
            <p className="text-white/70 leading-relaxed">
              By accessing or using Showthink's services, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access our services.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-brand-yellow">
              <Lock size={24} />
              <h2 className="text-2xl font-bold">2. Intellectual Property</h2>
            </div>
            <p className="text-white/70 leading-relaxed">
              The Service and its original content, features, and functionality are and will remain the exclusive property of Showthink and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Showthink.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-brand-yellow">
              <Scale size={24} />
              <h2 className="text-2xl font-bold">3. Limitation of Liability</h2>
            </div>
            <p className="text-white/70 leading-relaxed">
              In no event shall Showthink, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-brand-yellow">
              <Shield size={24} />
              <h2 className="text-2xl font-bold">4. Privacy Policy</h2>
            </div>
            <p className="text-white/70 leading-relaxed">
              Your use of our Service is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-yellow">5. Governing Law</h2>
            <p className="text-white/70 leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>
          </section>

          <div className="pt-8 border-t border-white/10">
            <p className="text-sm text-white/40 italic">
              If you have any questions about these Terms, please contact us at a2sfeatures@gmail.com
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
