import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Star, Users, Zap, Shield, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SERVICES, PROJECTS } from '../constants';
import * as Icons from 'lucide-react';
import SevenDayDelivery from '../components/SevenDayDelivery';
import Pricing from '../components/Pricing';
import CaseStudies from '../components/CaseStudies';
import TestimonialsSlider from '../components/TestimonialsSlider';
import FreeAudit from '../components/FreeAudit';
import DomainSearch from '../components/DomainSearch';
import VideoSection from '../components/VideoSection';
import FAQ from '../components/FAQ';
import WhyChooseUs from '../components/WhyChooseUs';
import Blog from '../components/Blog';
import { auth } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import LeaderboardBanner from '../components/LeaderboardBanner';
import AuthModal from '../components/AuthModal';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/contact');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="w-full relative z-20 pt-[72px]">
        <LeaderboardBanner />
      </div>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col pt-8 px-6">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-yellow/5 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10 flex-grow">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-sm font-bold mb-6"
            >
              Think Smart. Show Powerful.
            </motion.span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6">
              We Turn Ideas Into <span className="text-gradient-yellow">Powerful</span> Digital Experiences
            </h1>
            <p className="text-xl text-white/70 mb-10 max-w-lg leading-relaxed">
              Websites, Marketing & Design That Actually Grow Your Business. Partner with Showthink to dominate your industry.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={handleGetStarted} className="btn-primary flex items-center gap-2">
                Get Started <ArrowRight size={20} />
              </button>
              <Link to="/portfolio" className="btn-secondary">
                View Our Work
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=800"
                alt="Digital Marketing and Design"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" />
            </div>
            {/* Floating Stats */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-6 -right-6 glass-card p-6 shadow-xl z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-yellow rounded-xl flex items-center justify-center text-brand-black">
                  <Star fill="currentColor" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">4.9/5</div>
                  <div className="text-xs text-white/60">Client Rating</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 glass-card p-6 shadow-xl z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-brand-yellow">
                  <Users size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-xs text-white/60">Projects Done</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-6 bg-brand-black relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Comprehensive digital solutions tailored to your brand's unique needs and growth goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((service, index) => {
              const IconComponent = (Icons as any)[service.icon];
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/services/${service.id}`}
                    className="group block h-full p-8 glass-card glow-hover"
                  >
                    <div className="w-14 h-14 bg-brand-yellow/10 rounded-2xl flex items-center justify-center text-brand-yellow mb-6 group-hover:bg-brand-yellow group-hover:text-brand-black transition-all duration-300">
                      <IconComponent size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-4 group-hover:text-brand-yellow transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-6">
                      {service.shortDescription}
                    </p>
                    <div className="flex items-center gap-2 text-brand-yellow text-sm font-bold">
                      Learn More <ArrowRight size={16} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Showthink */}
      <section className="py-16 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Why Showthink?</h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {[
                { icon: Shield, title: 'Premium Quality', desc: 'We never compromise on the quality of our deliverables.' },
                { icon: Clock, title: 'Fast Delivery', desc: 'Your time is valuable. We meet deadlines without fail.' },
                { icon: Zap, title: 'SEO Optimized', desc: 'Built-in SEO best practices to help you rank higher.' },
                { icon: Users, title: '24/7 Support', desc: 'Our team is always here to assist you with any queries.' },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="w-12 h-12 bg-brand-yellow/10 rounded-lg flex items-center justify-center text-brand-yellow">
                    <item.icon size={24} />
                  </div>
                  <h4 className="text-lg font-bold">{item.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800&h=800"
                alt="Our Professional Team"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 glass-card p-8 hidden md:block">
              <div className="text-4xl font-extrabold text-brand-yellow mb-1">100%</div>
              <div className="text-sm font-bold">Satisfaction Guaranteed</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7-Day Delivery Section */}
      <SevenDayDelivery />

      {/* Domain Search Section */}
      <DomainSearch />

      {/* Pricing Section */}
      <Pricing />

      {/* Case Studies Section */}
      <CaseStudies />

      {/* Portfolio Preview */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Portfolio Preview</h2>
              <p className="text-white/60 max-w-xl">
                A glimpse into the powerful digital experiences we've created for our clients.
              </p>
            </div>
            <Link to="/portfolio" className="btn-secondary">
              View All Projects
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.slice(0, 3).map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ y: -10 }}
                className="group relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/3]"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <span className="text-brand-yellow text-xs font-bold uppercase tracking-widest mb-2">{project.category}</span>
                  <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                  <Link to="/portfolio" className="text-sm font-bold flex items-center gap-2 text-white hover:text-brand-yellow transition-colors">
                    View Details <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSlider />

      {/* Free Audit Section */}
      <FreeAudit />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Video Section */}
      <VideoSection />

      {/* FAQ Section */}
      <FAQ />

      {/* Blog Section */}
      <Blog />

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto glass-card p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-yellow to-transparent" />
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Let’s Build Something <span className="text-gradient-yellow">Amazing</span> Together</h2>
          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
            Ready to take your business to the next level? Our team is standing by to help you achieve your digital goals.
          </p>
          <button onClick={handleGetStarted} className="btn-primary text-lg px-12 py-4">
            Contact Us Now
          </button>
        </div>
      </section>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => navigate('/contact')} 
      />
    </div>
  );
};

export default Home;
