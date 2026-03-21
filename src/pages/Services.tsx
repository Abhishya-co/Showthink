import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../constants';
import * as Icons from 'lucide-react';
import { ArrowRight } from 'lucide-react';

const Services = () => {
  return (
    <div className="pt-64 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold mb-6"
          >
            Our <span className="text-gradient-gold">Expertise</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            We offer a full suite of digital services designed to help your brand thrive in the modern digital landscape.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {SERVICES.map((service, index) => {
            const IconComponent = (Icons as any)[service.icon];
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/services/${service.id}`}
                  className="group block p-10 glass-card glow-hover h-full relative overflow-hidden"
                >
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-gold/5 rounded-full blur-3xl group-hover:bg-brand-gold/10 transition-all" />
                  
                  <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-brand-gold mb-8 group-hover:bg-brand-gold group-hover:text-brand-black transition-all duration-300">
                    <IconComponent size={40} />
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-6 group-hover:text-brand-gold transition-colors">
                    {service.title}
                  </h2>
                  
                  <p className="text-white/70 text-lg leading-relaxed mb-8">
                    {service.fullDescription}
                  </p>

                  <div className="space-y-4 mb-10">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-white/60">
                        <div className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-brand-gold font-bold group-hover:translate-x-2 transition-transform">
                    View Service Details <ArrowRight size={20} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Custom Solution CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-12 glass-card text-center"
        >
          <h3 className="text-3xl font-bold mb-6">Need a Custom Digital Solution?</h3>
          <p className="text-white/60 mb-10 max-w-xl mx-auto">
            Every business is unique. We can create a tailored strategy that fits your specific goals and budget.
          </p>
          <Link to="/contact" className="btn-primary">
            Let's Talk Strategy
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
