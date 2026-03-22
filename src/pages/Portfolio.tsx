import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECTS } from '../constants';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';

const Portfolio = () => {
  const [filter, setFilter] = useState<'All' | 'Websites' | 'Graphics' | 'Marketing'>('All');

  const filteredProjects = filter === 'All' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === filter);

  const categories = ['All', 'Websites', 'Graphics', 'Marketing'];

  const getCount = (cat: string) => {
    if (cat === 'All') return PROJECTS.length;
    return PROJECTS.filter(p => p.category === cat).length;
  };

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold mb-6"
          >
            Our <span className="text-gradient-yellow">Work</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            A showcase of our best projects across web development, graphic design, and digital marketing.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-8 py-2 rounded-full font-bold transition-all duration-300 flex items-center gap-2 ${
                filter === cat 
                  ? 'bg-brand-yellow text-brand-black shadow-[0_0_15px_rgba(255,215,0,0.3)]' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {cat}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                filter === cat ? 'bg-brand-black/20' : 'bg-white/10'
              }`}>
                {getCount(cat)}
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] bg-white/5"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <span className="text-brand-yellow text-xs font-bold uppercase tracking-widest mb-2">{project.category}</span>
                  <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="text-white/60 text-sm mb-6 line-clamp-2">{project.description}</p>
                  <div className="flex items-center gap-4">
                    <button className="text-sm font-bold flex items-center gap-2 text-white hover:text-brand-yellow transition-colors">
                      View Details <ArrowRight size={16} />
                    </button>
                    {project.link && (
                      <a 
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold flex items-center gap-2 text-white hover:text-brand-yellow transition-colors"
                      >
                        Live Link <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Portfolio CTA */}
        <div className="mt-24 text-center">
          <h3 className="text-3xl font-bold mb-6">Want to see your project here?</h3>
          <Link to="/contact" className="btn-primary">
            Start Your Project
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
