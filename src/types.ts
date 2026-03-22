import { LucideIcon } from 'lucide-react';

export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  image?: string;
  features: string[];
  process: string[];
  ctaText: string;
}

export interface Project {
  id: string;
  title: string;
  category: 'Websites' | 'Graphics' | 'Marketing';
  image: string;
  description: string;
  link?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  subscription?: {
    plan: 'Free' | 'Pro' | 'Enterprise';
    status: 'active' | 'inactive' | 'canceled';
    expiresAt?: any;
  };
  createdAt: any;
}
