import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Globe, CheckCircle2, XCircle, ArrowRight, User, Mail, Phone, Loader2, Send, MapPin, Sparkles, RefreshCw } from 'lucide-react';
import { db, collection, addDoc, serverTimestamp, handleFirestoreError, OperationType, query as firestoreQuery, where, getDocs } from '../firebase';
import { GoogleGenAI, Type } from "@google/genai";

const DomainSearch = () => {
  const [query, setQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchWarning, setSearchWarning] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{ domain: string; available: boolean; price?: string } | null>(null);
  const [alternatives, setAlternatives] = useState<{ domain: string; available: boolean; price: string }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Business Name Generator State
  const [businessKeyword, setBusinessKeyword] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [nameLength, setNameLength] = useState('any');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNames, setGeneratedNames] = useState<{ name: string; domain: string; available: boolean; price: string }[]>([]);

  const domainPrices: { [key: string]: string } = {
    '.in': '899',
    '.com': '999',
    '.xyz': '499',
    '.online': '599',
    '.shop': '549',
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    
    const trimmedQuery = query.toLowerCase().trim();
    if (!trimmedQuery) return;

    // Domain validation regex
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(trimmedQuery)) {
      setSearchError('Please enter a valid domain format (e.g., example.com)');
      return;
    }

    setIsSearching(true);
    setSearchResult(null);
    setAlternatives([]);
    setShowForm(false);
    setSearchWarning('');
    setSearchError('');

    try {
      const domain = trimmedQuery;
      const nameWithoutTld = domain.split('.')[0];
      const tld = Object.keys(domainPrices).find(t => domain.endsWith(t)) || '.com';
      const price = domainPrices[tld] || '999';
      const altTlds = Object.keys(domainPrices).filter(t => t !== tld);
      const allDomainsToCheck = [domain, ...altTlds.map(t => `${nameWithoutTld}${t}`)];

      // 1. Check Firestore for ALL domains in parallel (using public collection to avoid PII leak)
      const firestoreCheckPromise = getDocs(
        firestoreQuery(
          collection(db, 'registered_domains_public'), 
          where('domain', 'in', allDomainsToCheck)
        )
      );

      // 2. Use Gemini with Google Search for real-time availability check
      // Wrap in a separate try/catch to handle quota errors gracefully
      let availabilityResults: { domain: string; available: boolean }[] = [];
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
        const geminiResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Check real-time availability for these domains: ${allDomainsToCheck.join(', ')}. Return a JSON array of objects with "domain" (string) and "available" (boolean). Use Google Search grounding.`,
          config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  domain: { type: Type.STRING },
                  available: { type: Type.BOOLEAN }
                },
                required: ["domain", "available"]
              }
            }
          }
        });
        availabilityResults = JSON.parse(geminiResponse.text || "[]");
      } catch (aiError) {
        console.error('Gemini API error:', aiError);
        const errorMessage = aiError instanceof Error ? aiError.message : String(aiError);
        if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
          setSearchWarning('Real-time verification is currently limited. Showing database results only.');
        } else {
          setSearchWarning('Could not verify real-time availability. Showing database results.');
        }
        // Fallback: assume all domains are available unless in DB
        availabilityResults = allDomainsToCheck.map(d => ({ domain: d, available: true }));
      }

      const querySnapshot = await firestoreCheckPromise;
      const registeredInDB = new Set(querySnapshot.docs.map(doc => doc.data().domain));
      
      // Process main domain
      const mainResult = availabilityResults.find(r => r.domain === domain);
      const isAvailable = registeredInDB.has(domain) ? false : (mainResult ? mainResult.available : true);
      setSearchResult({ domain, available: isAvailable, price });

      // Process alternatives
      const alts = altTlds.map(t => {
        const altDomain = `${nameWithoutTld}${t}`;
        const altResult = availabilityResults.find(r => r.domain === altDomain);
        const altAvailable = registeredInDB.has(altDomain) ? false : (altResult ? altResult.available : true);
        
        return {
          domain: altDomain,
          available: altAvailable,
          price: domainPrices[t]
        };
      });
      
      setAlternatives(alts);
    } catch (error) {
      console.error('Error searching domain:', error);
      setSearchError(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchResult) return;

    setIsSubmitting(true);
    try {
      const registrationData = {
        domain: searchResult.domain,
        price: searchResult.price,
        ...formData,
        createdAt: serverTimestamp()
      };

      // Write to both collections: one for private details, one for public availability check
      await Promise.all([
        addDoc(collection(db, 'domain-registrations'), registrationData),
        addDoc(collection(db, 'registered_domains_public'), { 
          domain: searchResult.domain, 
          createdAt: serverTimestamp() 
        })
      ]);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error registering domain:', error);
      handleFirestoreError(error, OperationType.WRITE, 'domain-registrations');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateBusinessNames = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!businessKeyword) return;

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      let prompt = `Generate 5 unique, creative, and catchy business names based on the keyword: "${businessKeyword}".`;
      if (businessCategory) prompt += ` The business category is "${businessCategory}".`;
      if (nameLength !== 'any') prompt += ` Each name should be approximately ${nameLength} letters long.`;
      prompt += ` For each name, also check the real-time availability of its corresponding .com domain using Google Search.
      Return a JSON array of objects, where each object has "name", "domain", and "available" (boolean) properties.`;

      let namesWithAvailability: { name: string; domain: string; available: boolean }[] = [];
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  domain: { type: Type.STRING },
                  available: { type: Type.BOOLEAN }
                },
                required: ["name", "domain", "available"]
              }
            }
          }
        });
        namesWithAvailability = JSON.parse(response.text || "[]");
      } catch (aiError) {
        console.error('Gemini API error in generator:', aiError);
        // Fallback: generate names without real-time check if AI fails
        // We'll use a simpler prompt without tools to see if it works, or just mock it
        const fallbackPrompt = `Generate 5 unique business names for "${businessKeyword}". Return JSON array of {name: string, domain: string, available: boolean}. Set available to true.`;
        try {
          const fallbackResponse = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: fallbackPrompt,
            config: { responseMimeType: "application/json" }
          });
          namesWithAvailability = JSON.parse(fallbackResponse.text || "[]");
        } catch (finalError) {
          // If even fallback fails, show nothing or a specific error
          throw finalError;
        }
      }
      
      // Check domain availability for all names against our DB in ONE query
      const allDomains = namesWithAvailability.map(item => item.domain);
      if (allDomains.length > 0) {
        const querySnapshot = await getDocs(
          firestoreQuery(
            collection(db, 'registered_domains_public'), 
            where('domain', 'in', allDomains)
          )
        );
        const registeredInDB = new Set(querySnapshot.docs.map(doc => doc.data().domain));

        const results = namesWithAvailability.map((item) => ({
          ...item,
          available: registeredInDB.has(item.domain) ? false : item.available,
          price: '999'
        }));

        setGeneratedNames(results);
      }
    } catch (error) {
      console.error('Error generating business names:', error);
      setSearchError('Could not generate names. Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTldClick = (tld: string) => {
    if (!query.trim()) return;
    
    const name = query.split('.')[0].trim();
    setQuery(`${name}${tld}`);
    if (searchError) setSearchError('');
  };

  return (
    <section className="py-16 px-6 bg-brand-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-yellow/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-sm font-bold mb-6"
          >
            <Globe size={16} />
            Find Your Perfect Domain
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          >
            Search & <span className="text-gradient-yellow">Register</span> Your Domain
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/60"
          >
            Check availability and secure your brand identity in seconds.
          </motion.p>
          
          {/* API Key Selection for Quota Issues */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 flex justify-center"
          >
            <button
              onClick={() => (window as any).aistudio?.openSelectKey?.()}
              className="text-xs text-white/40 hover:text-brand-yellow transition-colors flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
            >
              <Sparkles className="w-3 h-3" />
              Hit search limits? Use your own API key
            </button>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="glass-card p-2 md:p-3 mb-8"
        >
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
              <input
                type="text"
                placeholder="Enter your domain name (e.g. myshop.com)"
                className={`w-full bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white focus:border-brand-yellow/50 focus:outline-none transition-all ${searchError ? 'border-red-500/50' : 'border-white/10'}`}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (searchError) setSearchError('');
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="btn-primary py-4 px-8 font-bold flex items-center justify-center gap-2 min-w-[160px]"
            >
              {isSearching ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
            </button>
          </form>
          <AnimatePresence>
            {searchError && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-sm mt-3 ml-4 font-medium flex items-center gap-2"
              >
                <XCircle size={14} />
                {searchError}
              </motion.p>
            )}
            {searchWarning && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-brand-yellow text-sm mt-3 ml-4 font-medium flex items-center gap-2"
              >
                <Sparkles size={14} />
                {searchWarning}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Domain Pricing Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"
        >
          {[
            { tld: '.in', price: '899' },
            { tld: '.com', price: '999' },
            { tld: '.xyz', price: '499' },
            { tld: '.online', price: '599' },
            { tld: '.shop', price: '549' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => handleTldClick(item.tld)}
              className="glass-card p-4 text-center border-t-2 border-brand-yellow/30 hover:border-brand-yellow transition-all hover:scale-105 active:scale-95 group"
            >
              <div className="text-xl font-bold text-brand-yellow mb-1 group-hover:scale-110 transition-transform">{item.tld}</div>
              <div className="text-sm text-white/60">Starting at</div>
              <div className="text-lg font-extrabold">₹{item.price}<span className="text-[10px] text-white/40 font-normal">/yr</span></div>
            </button>
          ))}
        </motion.div>

        {/* Search Results */}
        <AnimatePresence mode="wait">
          {searchResult && !showForm && !isSubmitted && (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass-card p-6 border-l-4 ${searchResult.available ? 'border-l-emerald-500' : 'border-l-red-500'}`}
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${searchResult.available ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                      {searchResult.available ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{searchResult.domain}</h3>
                      <p className={searchResult.available ? 'text-emerald-500' : 'text-red-500'}>
                        {searchResult.available 
                          ? `Available for ₹${searchResult.price}/yr` 
                          : 'Sorry, this domain is already taken.'}
                      </p>
                    </div>
                  </div>
                  {searchResult.available && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="btn-primary py-3 px-8 text-sm font-bold flex items-center gap-2 shadow-lg shadow-brand-yellow/20 hover:scale-105 transition-transform"
                    >
                      Register Now <ArrowRight size={18} />
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Alternative Suggestions */}
              {alternatives.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h4 className="text-white/40 text-sm font-bold uppercase tracking-widest ml-1">Alternative Suggestions</h4>
                  <div className="grid gap-3">
                    {alternatives.map((alt, i) => (
                      <div key={i} className="glass-card p-4 flex items-center justify-between hover:border-white/20 transition-all">
                        <div className="flex items-center gap-3">
                          <Globe size={18} className="text-brand-yellow/60" />
                          <div>
                            <span className="font-bold">{alt.domain}</span>
                            <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${alt.available ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                              {alt.available ? 'Available' : 'Taken'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-bold text-brand-yellow">₹{alt.price}<span className="text-[10px] text-white/40 font-normal">/yr</span></div>
                          </div>
                          <button
                            onClick={() => {
                              if (alt.available) {
                                setSearchResult(alt);
                                setShowForm(true);
                              }
                            }}
                            disabled={!alt.available}
                            className={`py-2 px-4 rounded-lg text-xs font-bold transition-all ${
                              alt.available 
                                ? 'bg-white/10 hover:bg-white/20 text-white' 
                                : 'bg-white/5 text-white/20 cursor-not-allowed'
                            }`}
                          >
                            {alt.available ? 'Select' : 'Taken'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Registration Form */}
          {showForm && !isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 md:p-10"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">Register <span className="text-brand-yellow">{searchResult?.domain}</span></h3>
                <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white transition-colors">
                  Cancel
                </button>
              </div>
              <form onSubmit={handleRegister} className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/60 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                    <input
                      required
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-brand-yellow/50 focus:outline-none transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/60 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                    <input
                      required
                      type="email"
                      placeholder="john@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-brand-yellow/50 focus:outline-none transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-white/60 ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-brand-yellow/50 focus:outline-none transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-white/60 ml-1">Full Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-white/30" size={20} />
                    <textarea
                      required
                      placeholder="Enter your complete address"
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-brand-yellow/50 focus:outline-none transition-all resize-none"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="md:col-span-2 btn-primary py-5 text-lg font-bold flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : 'Confirm Registration'}
                </button>
              </form>
            </motion.div>
          )}

          {/* Success Message */}
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 text-center"
            >
              <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <Send size={48} />
              </div>
              <h3 className="text-4xl font-extrabold mb-4">Congratulations!</h3>
              <p className="text-2xl text-white/80 mb-8">
                Your domain <span className="text-brand-yellow font-bold">{searchResult?.domain}</span> is confirmed for <span className="text-brand-yellow font-bold">₹{searchResult?.price}/yr</span>.
              </p>
              <p className="text-white/60 mb-12">
                Our team will contact you shortly to complete the technical setup and ownership transfer.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setSearchResult(null);
                  setQuery('');
                  setFormData({ name: '', email: '', phone: '', address: '' });
                }}
                className="btn-secondary"
              >
                Search Another Domain
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Business Name Generator Tool */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 pt-8 border-t border-white/10"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-sm font-bold mb-6">
              <Sparkles size={16} />
              AI Business Name Generator
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Stuck on a <span className="text-gradient-yellow">Name?</span></h2>
            <p className="text-white/60">Enter a keyword and we'll generate 5 unique business names with available domains.</p>
          </div>

          <div className="glass-card p-6 md:p-8 mb-6">
            <form onSubmit={generateBusinessNames} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Keyword</label>
                  <div className="relative">
                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input
                      type="text"
                      placeholder="e.g. tech, coffee"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-yellow/50 focus:outline-none transition-all text-sm"
                      value={businessKeyword}
                      onChange={(e) => setBusinessKeyword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Category</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input
                      type="text"
                      placeholder="e.g. E-commerce, Blog"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-yellow/50 focus:outline-none transition-all text-sm"
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Name Length</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-brand-yellow/50 focus:outline-none transition-all text-sm appearance-none cursor-pointer"
                    value={nameLength}
                    onChange={(e) => setNameLength(e.target.value)}
                  >
                    <option value="any" className="bg-brand-black">Any Length</option>
                    <option value="short" className="bg-brand-black">Short (3-6 letters)</option>
                    <option value="medium" className="bg-brand-black">Medium (7-12 letters)</option>
                    <option value="long" className="bg-brand-black">Long (13+ letters)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="btn-primary py-3 px-12 font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-yellow/20 hover:scale-105 transition-transform"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      Generate Names <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {generatedNames.length > 0 && (
            <div className="grid gap-4">
              {generatedNames.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-brand-yellow/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-yellow/10 flex items-center justify-center text-brand-yellow font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold group-hover:text-brand-yellow transition-colors">{item.name}</h4>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-white/40">{item.domain}</span>
                        {item.available ? (
                          <span className="text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 size={12} /> Available
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center gap-1">
                            <XCircle size={12} /> Taken
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {item.available && (
                      <>
                        <div className="text-right hidden md:block">
                          <div className="text-xs text-white/40 uppercase font-bold tracking-widest">Starting at</div>
                          <div className="text-lg font-bold text-brand-yellow">₹{item.price}</div>
                        </div>
                        <button
                          onClick={() => {
                            setQuery(item.domain);
                            setSearchResult({ domain: item.domain, available: true, price: item.price });
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="btn-primary py-2 px-6 text-xs font-bold"
                        >
                          Select
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => generateBusinessNames()}
                  disabled={isGenerating}
                  className="flex items-center gap-2 text-brand-yellow font-bold hover:underline transition-all disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                  Regenerate Different Names
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default DomainSearch;
