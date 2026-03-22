import React from 'react';
import { motion } from 'motion/react';
import { Clock, Search, Smartphone, Zap, CheckCircle2, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SevenDayDelivery = () => {
  const timelineSteps = [
    {
      days: 'Day 1–2',
      title: 'Planning & Design',
      description: 'We define your brand strategy and create high-fidelity UI/UX mockups for your approval.',
      icon: Calendar
    },
    {
      days: 'Day 3–5',
      title: 'Development',
      description: 'Our expert developers bring the design to life using clean, high-performance code.',
      icon: Zap
    },
    {
      days: 'Day 6',
      title: 'Testing & Revisions',
      description: 'Rigorous testing across all devices and browsers, followed by final refinements.',
      icon: Search
    },
    {
      days: 'Day 7',
      title: 'Final Delivery',
      description: 'Your website goes live! We handle the deployment and provide a full walkthrough.',
      icon: CheckCircle2
    }
  ];

  const trustBadges = [
    { icon: Clock, label: 'On-Time Delivery Guarantee' },
    { icon: Search, label: 'SEO Ready' },
    { icon: Smartphone, label: 'Mobile Optimized' },
    { icon: Zap, label: 'Fast Performance' }
  ];

  return (
    <section className="py-16 px-6 bg-brand-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-yellow/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-extrabold mb-6"
          >
            ⚡ Get Your Website Delivered in <span className="text-gradient-yellow">Just 7 Days</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            Stop waiting months for your website. Our streamlined process delivers premium results at lightning speed.
          </motion.p>
        </div>

        {/* Timeline UI */}
        <div className="relative mb-16">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 hidden lg:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {timelineSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-8 relative group hover:border-brand-yellow/30 transition-all"
              >
                <div className="w-12 h-12 bg-brand-yellow text-brand-black rounded-full flex items-center justify-center font-bold text-lg mb-6 shadow-[0_0_15px_rgba(255,215,0,0.3)] group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                <div className="text-brand-yellow font-bold text-sm uppercase tracking-widest mb-2">
                  {step.days}
                </div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustBadges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <badge.icon className="text-brand-yellow shrink-0" size={20} />
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">{badge.label}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA & Urgency */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <Link to="/contact" className="btn-primary text-lg px-12 py-4 flex items-center gap-3 mb-6">
              Start My Website <ArrowRight size={24} />
            </Link>
            <p className="text-brand-yellow font-bold flex items-center justify-center gap-2 animate-pulse">
              <span className="w-2 h-2 bg-brand-yellow rounded-full" />
              Limited slots available each week
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SevenDayDelivery;
