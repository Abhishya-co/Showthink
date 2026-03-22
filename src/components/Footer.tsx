import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-black border-t border-white/10 pt-8 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="https://encouraging-magenta-8xwytk2odx.edgeone.app/Picsart_26-03-22_15-15-37-168.png" 
              alt="Showthink Logo" 
              className="h-10 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="text-2xl font-extrabold tracking-tighter">
              SHOW<span className="text-brand-yellow">THINK</span>
            </span>
          </Link>
          <p className="text-white/60 leading-relaxed">
            Think Smart. Show Powerful. We turn ideas into powerful digital experiences that grow your business.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-black transition-all">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-black transition-all">
              <Facebook size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-black transition-all">
              <Twitter size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-black transition-all">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-4">Quick Links</h4>
          <ul className="space-y-4">
            <li><Link to="/" className="text-white/60 hover:text-brand-yellow transition-colors">Home</Link></li>
            <li><Link to="/services" className="text-white/60 hover:text-brand-yellow transition-colors">Services</Link></li>
            <li><Link to="/portfolio" className="text-white/60 hover:text-brand-yellow transition-colors">Portfolio</Link></li>
            <li><Link to="/testimonials" className="text-white/60 hover:text-brand-yellow transition-colors">Testimonials</Link></li>
            <li><Link to="/contact" className="text-white/60 hover:text-brand-yellow transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-lg font-bold mb-4">Our Services</h4>
          <ul className="space-y-4">
            <li><Link to="/services/digital-marketing" className="text-white/60 hover:text-brand-yellow transition-colors">Digital Marketing</Link></li>
            <li><Link to="/services/website-development" className="text-white/60 hover:text-brand-yellow transition-colors">Web Development</Link></li>
            <li><Link to="/services/graphic-design" className="text-white/60 hover:text-brand-yellow transition-colors">Graphic Design</Link></li>
            <li><Link to="/services/social-media-management" className="text-white/60 hover:text-brand-yellow transition-colors">Social Media</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-bold mb-4">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-white/60">
              <Mail className="text-brand-yellow shrink-0" size={20} />
              <span>a2sfeatures@gmail.com</span>
            </li>
            <li className="flex items-start gap-3 text-white/60">
              <Phone className="text-brand-yellow shrink-0" size={20} />
              <span>+91 9911230354</span>
            </li>
            <li className="flex items-start gap-3 text-white/60">
              <MapPin className="text-brand-yellow shrink-0" size={20} />
              <span>New Delhi, India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-white/5 text-center text-white/40 text-sm">
        <p>© {new Date().getFullYear()} Showthink. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
