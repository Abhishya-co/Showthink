import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CASE_STUDIES } from '../constants';
import { Link } from 'react-router-dom';

const CaseStudies = () => {
  return (
    <section className="py-16 px-6 bg-brand-black relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          >
            Success <span className="text-gradient-yellow">Stories</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            Real results for real businesses. See how we've helped our clients dominate their industries.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {CASE_STUDIES.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card overflow-hidden group hover:border-brand-yellow/30 transition-all duration-500 flex flex-col"
            >
              {/* Before/After Visuals */}
              <div className="relative h-64 overflow-hidden flex">
                <div className="relative w-1/2 h-full overflow-hidden border-r border-white/10">
                  <img
                    src={study.beforeImage}
                    alt="Before"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-brand-black/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10">
                    Before
                  </div>
                </div>
                <div className="relative w-1/2 h-full overflow-hidden">
                  <img
                    src={study.afterImage}
                    alt="After"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-brand-yellow text-brand-black text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                    After
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-brand-yellow text-xs font-bold uppercase tracking-widest mb-1 block">
                      {study.category}
                    </span>
                    <h3 className="text-2xl font-bold">{study.client}</h3>
                  </div>
                </div>

                <div className="space-y-6 mb-8 flex-grow">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-1">The Problem</h4>
                      <p className="text-white/80 text-sm leading-relaxed">{study.problem}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-brand-yellow/10 text-brand-yellow rounded-xl flex items-center justify-center shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-1">The Solution</h4>
                      <p className="text-white/80 text-sm leading-relaxed">{study.solution}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-1">The Result</h4>
                      <p className="text-emerald-400 font-bold text-lg">{study.result}</p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/portfolio"
                  className="w-full py-4 rounded-xl bg-white/5 border border-white/10 font-bold flex items-center justify-center gap-2 group-hover:bg-brand-yellow group-hover:text-brand-black transition-all duration-300"
                >
                  View Full Case Study <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
