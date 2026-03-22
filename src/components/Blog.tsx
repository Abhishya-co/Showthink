import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';

const categories = ["All", "Marketing", "Website", "Social Media"];

const blogPosts = [
  {
    id: 1,
    title: "10 SEO Strategies to Boost Your Organic Traffic in 2024",
    category: "Marketing",
    date: "March 15, 2024",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    excerpt: "Discover the latest search engine optimization techniques that are driving real results for modern businesses."
  },
  {
    id: 2,
    title: "Why Minimalist Design is Winning the Web",
    category: "Website",
    date: "March 12, 2024",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
    excerpt: "Less is more. Learn how clean, focused web design improves user experience and conversion rates."
  },
  {
    id: 3,
    title: "Mastering the Art of Social Media Engagement",
    category: "Social Media",
    date: "March 10, 2024",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800",
    excerpt: "Stop just posting and start connecting. Here's how to build a loyal community on social platforms."
  },
  {
    id: 4,
    title: "The Future of AI in Digital Marketing",
    category: "Marketing",
    date: "March 08, 2024",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    excerpt: "Artificial intelligence is changing the game. Are you ready to leverage AI for your marketing campaigns?"
  },
  {
    id: 5,
    title: "Building High-Performance E-commerce Stores",
    category: "Website",
    date: "March 05, 2024",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
    excerpt: "Speed and security are paramount for online sales. Explore our guide to building robust e-commerce sites."
  },
  {
    id: 6,
    title: "How to Create Viral Content for Instagram Reels",
    category: "Social Media",
    date: "March 02, 2024",
    image: "https://images.unsplash.com/photo-1611267254323-4db7b39c732c?auto=format&fit=crop&q=80&w=800",
    excerpt: "Short-form video is king. Learn the secrets behind content that gets shared and goes viral."
  }
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = activeCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <section className="py-16 px-6 bg-brand-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-sm font-bold mb-6"
            >
              <BookOpen size={16} />
              Our Blog
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold mb-6"
            >
              Latest <span className="text-gradient-yellow">Insights</span> & News
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/60"
            >
              Expert advice and industry trends to help your business stay ahead in the digital landscape.
            </motion.p>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
                  activeCategory === category
                    ? 'bg-brand-yellow border-brand-yellow text-brand-black'
                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <motion.article
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="glass-card group overflow-hidden flex flex-col h-full"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-brand-black/80 backdrop-blur-md text-brand-yellow text-xs font-bold border border-brand-yellow/30">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-white/40 text-sm mb-4">
                    <Calendar size={14} />
                    {post.date}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-yellow transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-white/60 mb-8 line-clamp-3 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto">
                    <button className="flex items-center gap-2 text-brand-yellow font-bold group/btn">
                      Read More
                      <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-2" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
            View All Articles
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;
