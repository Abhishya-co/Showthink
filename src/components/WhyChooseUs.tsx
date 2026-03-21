import React from 'react';
import { motion } from 'motion/react';
import { Clock, Palette, Search, Headphones, CheckCircle2 } from 'lucide-react';

const reasons = [
  {
    icon: Clock,
    title: "7-Day Delivery",
    description: "Get your professional website live in just one week. We prioritize speed without compromising on quality.",
    color: "text-blue-400",
    bg: "bg-blue-400/10"
  },
  {
    icon: Palette,
    title: "Premium Design",
    description: "Custom-crafted visuals that reflect your brand's unique identity and captivate your target audience.",
    color: "text-purple-400",
    bg: "bg-purple-400/10"
  },
  {
    icon: Search,
    title: "SEO Optimized",
    description: "Built-in search engine optimization to ensure your business ranks high and gets discovered by customers.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10"
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "24/7 priority assistance from our expert team. We're always here to help your business grow.",
    color: "text-brand-gold",
    bg: "bg-brand-gold/10"
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 px-6 bg-brand-black relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] -mr-48 -mt-48" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-bold mb-6"
          >
            <CheckCircle2 size={16} className="text-brand-gold" />
            The Showthink Advantage
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold mb-6"
          >
            Why Choose <span className="text-gradient-gold">Showthink?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            We combine speed, creativity, and strategy to deliver digital results that actually move the needle for your business.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-card p-8 group hover:border-brand-gold/50 transition-all duration-300"
            >
              <div className={`w-16 h-16 ${reason.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <reason.icon className={`w-8 h-8 ${reason.color}`} />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-gold transition-colors">
                {reason.title}
              </h3>
              <p className="text-white/60 leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
