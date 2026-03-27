import React from 'react';
import { motion } from 'motion/react';
import { TESTIMONIALS } from '../constants';
import { Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

const Testimonials = () => {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-extrabold mb-4"
          >
            Client <span className="text-gradient-blue">Success</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base text-white/60 max-w-2xl mx-auto"
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
              className="glass-card p-6 relative"
            >
              <Quote className="absolute top-6 right-6 text-brand-blue/10" size={40} />
              
              <div className="flex gap-1 text-brand-blue mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              <p className="text-base text-white/80 italic mb-6 leading-relaxed relative z-10">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-2 border-brand-blue/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-lg font-bold">{testimonial.name}</h4>
                  <p className="text-xs text-brand-blue font-semibold">{testimonial.role}</p>
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
