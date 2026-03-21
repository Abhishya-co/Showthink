import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, CheckCircle2, AlertCircle, Send, Globe, User, Mail } from 'lucide-react';

const FreeAudit = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log('Audit Request:', formData);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', website: '' });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section className="py-24 px-6 bg-brand-black relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-gold/5 blur-[120px] rounded-full -mr-20" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-brand-gold/5 blur-[100px] rounded-full -ml-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-sm font-bold mb-6">
              <Search size={16} />
              Free Performance Check
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
              Get Your <span className="text-gradient-gold">Free Website Audit</span>
            </h2>
            <p className="text-xl text-white/60 mb-10 leading-relaxed">
              Is your website underperforming? Let our experts take a deep dive into your digital presence and provide actionable insights.
            </p>

            <ul className="space-y-6 mb-10">
              {[
                'We analyze your website structure & speed',
                'Suggest conversion rate improvements',
                'Help increase organic traffic with SEO tips'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0 mt-1">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-white/80 font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Limited Availability</p>
                <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Only 5 free audits available per week</p>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-8 md:p-10 relative"
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Request Received!</h3>
                <p className="text-white/60">Our team will analyze your site and get back to you within 48 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/60 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                    <input
                      required
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-brand-gold/50 focus:outline-none transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/60 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                    <input
                      required
                      type="email"
                      placeholder="john@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-brand-gold/50 focus:outline-none transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/60 ml-1">Website URL</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                    <input
                      required
                      type="url"
                      placeholder="https://yourwebsite.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-brand-gold/50 focus:outline-none transition-all"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-5 text-lg font-bold shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.5)] transition-all"
                >
                  Get Free Audit
                </button>
                
                <p className="text-center text-xs text-white/30">
                  By clicking, you agree to our terms and privacy policy.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FreeAudit;
