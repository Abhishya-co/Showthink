import React from 'react';
import { motion } from 'motion/react';
import { TESTIMONIALS } from '../constants';
import { Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

const Testimonials = () => {
  return (
    <div className="pt-64 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold mb-6"
          >
            Client <span className="text-gradient-gold">Success</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            We pride ourselves on delivering results that matter. Here's what our partners have to say about working with Showthink.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-10 relative"
            >
              <Quote className="absolute top-8 right-8 text-brand-gold/10" size={80} />
              
              <div className="flex gap-1 text-brand-gold mb-8">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>

              <p className="text-xl text-white/80 italic mb-10 leading-relaxed relative z-10">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full border-2 border-brand-gold/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xl font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-brand-gold font-semibold">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* More Reviews Section */}
        <div className="mt-24 grid lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1">
            <h2 className="text-4xl font-bold mb-6">Trusted by 200+ Brands Worldwide</h2>
            <p className="text-white/60 mb-8">
              From startups to established enterprises, we've helped businesses across various industries achieve digital excellence.
            </p>
            <Link to="/contact" className="btn-secondary">
              Join Our Success Stories
            </Link>
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-8 opacity-40">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-16 bg-white/10 rounded-lg flex items-center justify-center font-bold text-xl">
                LOGO {i}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
