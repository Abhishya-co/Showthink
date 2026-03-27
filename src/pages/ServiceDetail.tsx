import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { SERVICES } from '../constants';
import * as Icons from 'lucide-react';
import { ArrowLeft, CheckCircle2, ArrowRight, Twitter, Linkedin, Facebook, Share2 } from 'lucide-react';

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const service = SERVICES.find((s) => s.id === id);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const shareUrl = window.location.href;
  const shareText = `Check out ${service.title} at Showthink!`;

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-[#1DA1F2]'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-[#0A66C2]'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-[#1877F2]'
    }
  ];

  const IconComponent = (Icons as any)[service.icon];

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/services" className="inline-flex items-center gap-2 text-white/60 hover:text-brand-yellow transition-colors mb-12">
          <ArrowLeft size={20} /> Back to Services
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-20 h-20 bg-brand-yellow/10 rounded-3xl flex items-center justify-center text-brand-yellow mb-8">
              <IconComponent size={48} />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-8">{service.title}</h1>
            <p className="text-xl text-white/70 leading-relaxed mb-10">
              {service.fullDescription}
            </p>

            {service.image && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-12 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              >
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            )}

            <div className="space-y-6 mb-12">
              <h3 className="text-2xl font-bold text-brand-yellow">Key Features</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 glass-card">
                    <CheckCircle2 className="text-brand-yellow shrink-0" size={20} />
                    <span className="text-sm font-semibold">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2 w-full sm:w-auto justify-center">
                {service.ctaText} <ArrowRight size={20} />
              </Link>
              
              <div className="flex items-center gap-4 py-2 px-4 rounded-full bg-white/5 border border-white/10">
                <span className="text-xs font-bold text-white/40 flex items-center gap-2 uppercase tracking-wider">
                  <Share2 size={14} /> Share
                </span>
                <div className="h-4 w-[1px] bg-white/10" />
                <div className="flex items-center gap-3">
                  {shareLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-white/60 transition-all duration-300 hover:scale-110 ${link.color}`}
                      title={`Share on ${link.name}`}
                    >
                      <link.icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div className="glass-card p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/5 rounded-full blur-3xl" />
              <h3 className="text-3xl font-bold mb-8">Our Process</h3>
              <div className="space-y-8 relative">
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-brand-yellow/20" />
                {service.process.map((step, i) => (
                  <div key={i} className="relative flex gap-8">
                    <div className="w-8 h-8 rounded-full bg-brand-yellow text-brand-black flex items-center justify-center font-bold shrink-0 z-10">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2">{step}</h4>
                      <p className="text-sm text-white/50">
                        We follow a rigorous methodology to ensure the highest quality results for your {service.title.toLowerCase()} needs.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-8 border-brand-yellow/20 bg-brand-yellow/5">
              <h4 className="text-xl font-bold mb-4">Ready to start?</h4>
              <p className="text-white/60 mb-6">
                Book a free consultation today and let's discuss how we can help your business grow.
              </p>
              <Link to="/contact" className="text-brand-yellow font-bold flex items-center gap-2 hover:translate-x-2 transition-transform">
                Get Free Strategy Call <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
