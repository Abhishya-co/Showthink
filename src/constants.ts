import { Service, Project, Testimonial } from './types';

export const SERVICES: Service[] = [
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    shortDescription: 'Strategic marketing to boost your online presence and ROI.',
    fullDescription: 'We help you dominate the digital landscape through data-driven strategies that connect your brand with the right audience at the right time.',
    icon: 'Megaphone',
    features: [
      'SEO Optimization',
      'Google Ads Management',
      'Facebook & Instagram Ads',
      'Lead Generation Campaigns'
    ],
    process: [
      'Market Research & Analysis',
      'Strategy Planning & Budgeting',
      'Campaign Execution',
      'Continuous Optimization'
    ],
    ctaText: 'Get Free Strategy Call'
  },
  {
    id: 'website-development',
    title: 'Website Development',
    shortDescription: 'High-performance websites built for conversion and speed.',
    fullDescription: 'Our development team creates stunning, responsive, and lightning-fast websites that serve as a powerful engine for your business growth.',
    icon: 'Code',
    features: [
      'Custom Website Design',
      'E-commerce Solutions',
      'High-Converting Landing Pages',
      'Speed & Performance Optimization'
    ],
    process: [
      'Requirement Gathering',
      'UI/UX Design Mockups',
      'Development & Integration',
      'Testing & Launch'
    ],
    ctaText: 'Start Your Website'
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    shortDescription: 'Visual identities that make your brand unforgettable.',
    fullDescription: 'We translate your brand values into compelling visual stories through premium design that captures attention and builds trust.',
    icon: 'Palette',
    features: [
      'Logo & Brand Identity',
      'Social Media Creatives',
      'Marketing Collateral',
      'Complete Branding Kits'
    ],
    process: [
      'Brand Discovery',
      'Concept Development',
      'Design Iterations',
      'Final Delivery'
    ],
    ctaText: 'Get Design Now'
  },
  {
    id: 'social-media-management',
    title: 'Social Media Management',
    shortDescription: 'Engaging content and growth strategies for social success.',
    fullDescription: 'We take the stress out of social media by managing your presence across platforms, building community, and driving engagement.',
    icon: 'Share2',
    features: [
      'Content Creation & Curation',
      'Post Scheduling & Management',
      'Community Engagement',
      'Growth & Analytics Strategy'
    ],
    process: [
      'Platform Audit',
      'Content Calendar Creation',
      'Daily Management',
      'Performance Reporting'
    ],
    ctaText: 'Grow My Social Media'
  }
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Luxe Real Estate',
    category: 'Websites',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800&h=600',
    description: 'A premium property listing platform with interactive maps.'
  },
  {
    id: '2',
    title: 'Azox Mart',
    category: 'Websites',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800&h=600',
    description: 'A comprehensive e-commerce platform for modern retail.',
    link: 'https://www.azoxmart.com'
  },
  {
    id: '3',
    title: 'Growth Campaign',
    category: 'Marketing',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=600',
    description: '300% ROI increase for a local SaaS provider.'
  },
  {
    id: '4',
    title: 'FitTrack App',
    category: 'Websites',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800&h=600',
    description: 'Modern landing page for a fitness tracking application.'
  },
  {
    id: '5',
    title: 'Social Buzz',
    category: 'Marketing',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800&h=600',
    description: 'Viral social media campaign for a beverage brand.'
  },
  {
    id: '6',
    title: 'Aashray Vani',
    category: 'Websites',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800&h=600',
    description: 'A professional and spiritual platform for community engagement.',
    link: 'https://aashrayvani.com'
  }
];

export const CASE_STUDIES = [
  {
    id: '1',
    client: 'Elite Fitness Studio',
    category: 'Web Development & SEO',
    problem: 'No online presence and relying solely on word-of-mouth referrals.',
    solution: 'Developed a high-converting custom website with integrated booking and local SEO strategy.',
    result: '0 to 12,000+ monthly organic visitors in 6 months.',
    beforeImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600&h=400&grayscale=1',
    afterImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600&h=400'
  },
  {
    id: '2',
    client: 'Eco-Friendly E-commerce',
    category: 'Digital Marketing',
    problem: 'High ad spend with very low return on investment (ROAS).',
    solution: 'Complete overhaul of Meta & Google Ads strategy with data-driven audience targeting.',
    result: '350% increase in ROAS and 2.5x monthly revenue growth.',
    beforeImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600&h=400&blur=5',
    afterImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=600&h=400'
  },
  {
    id: '3',
    client: 'TechStart Solutions',
    category: 'Branding & UI/UX',
    problem: 'Outdated brand identity that failed to attract enterprise-level clients.',
    solution: 'Modern rebranding and a premium UI/UX design for their flagship SaaS product.',
    result: '45% increase in enterprise demo requests within 90 days.',
    beforeImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600&h=400&sepia=1',
    afterImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=600&h=400'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'CEO, TechStart',
    image: 'https://i.pravatar.cc/150?u=sarah',
    content: 'Showthink transformed our digital presence. Their attention to detail and strategic approach led to a 40% increase in our online leads within just three months.',
    rating: 5
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Founder, EcoVibe',
    image: 'https://i.pravatar.cc/150?u=michael',
    content: 'The website they built for us is not only beautiful but also incredibly fast. We constantly get compliments from our customers on the user experience.',
    rating: 5
  },
  {
    id: '3',
    name: 'Emma Williams',
    role: 'Marketing Director, FashionHub',
    image: 'https://i.pravatar.cc/150?u=emma',
    content: 'Their graphic design team is top-notch. They perfectly captured our brand essence and delivered creatives that truly stand out on social media.',
    rating: 5
  },
  {
    id: '4',
    name: 'David Miller',
    role: 'CEO, Global Logistics',
    image: 'https://i.pravatar.cc/150?u=david',
    content: 'Showthink delivered our complex logistics platform ahead of schedule. Their technical expertise and project management are truly world-class.',
    rating: 5
  },
  {
    id: '5',
    name: 'Sophia Rodriguez',
    role: 'Founder, Bloom & Co',
    image: 'https://i.pravatar.cc/150?u=sophia',
    content: 'The branding and social media strategy they developed has completely changed how customers perceive us. Our engagement rates have tripled!',
    rating: 5
  }
];
