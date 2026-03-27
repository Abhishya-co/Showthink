import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Portfolio from './pages/Portfolio';
import PricingPage from './pages/PricingPage';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import DomainSearchPage from './pages/DomainSearchPage';

export default function App() {
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServiceDetail />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="domain-search" element={<DomainSearchPage />} />
          <Route path="contact" element={<Contact />} />
          <Route path="terms" element={<Terms />} />
        </Route>
      </Routes>
    </Router>
  );
}
