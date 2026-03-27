import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Loader2, MessageCircle, Sparkles, User, Bot } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { SERVICES, PROJECTS } from '../constants';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const ChatBot = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hi! I am Showthink AI. How can I help you grow your business today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "What services do you offer?",
    "How much does a website cost?",
    "Can you build a site in 7 days?",
    "Show me your portfolio",
    "How to contact the team?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      // Prepare context about the website
      const servicesContext = SERVICES.map(s => `- ${s.title}: ${s.shortDescription}`).join('\n');
      const projectsContext = PROJECTS.map(p => `- ${p.title} (${p.category}): ${p.description}`).join('\n');
      
      const systemInstruction = `
        You are Showthink AI, a helpful and professional assistant for Showthink, a premium digital agency.
        Your goal is to answer questions about Showthink's services, portfolio, and how we can help businesses grow.
        
        About Showthink:
        - We turn ideas into powerful digital experiences.
        - We offer: ${servicesContext}
        - Our Portfolio includes: ${projectsContext}
        - Key Value: 7-day delivery guarantee for websites.
        - Contact: Users can reach us via the contact page or WhatsApp.
        - Pricing: We have various plans for Digital Marketing, Web Development, and Graphic Design.
        
        Guidelines:
        - Be concise, professional, and friendly.
        - If you don't know something, suggest contacting the team.
        - Use emojis occasionally to be engaging.
        - Keep responses short (max 2-3 sentences) as this is a chat bubble.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction,
          temperature: 0.7,
          topP: 0.95,
        },
      });

      const botResponse = response.text || "I'm sorry, I couldn't process that. Please try again or contact our support.";
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having some trouble connecting. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-24 right-6 w-[300px] md:w-[340px] h-[420px] bg-brand-black border border-white/10 rounded-3xl shadow-2xl z-[60] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-3 bg-brand-yellow text-brand-black flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-brand-black rounded-full flex items-center justify-center text-brand-yellow">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Showthink AI</h3>
                <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold opacity-70">
                  <span className="w-1 h-1 bg-brand-black rounded-full animate-pulse" />
                  Online
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-brand-black/10 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === 'user' ? 15 : -15 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-brand-yellow/20 text-brand-yellow' : 'bg-white/10 text-white/60'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-2.5 rounded-2xl text-[13px] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-brand-yellow text-brand-black font-medium rounded-tr-none' 
                      : 'bg-white/5 text-white/80 border border-white/10 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 className="animate-spin text-brand-yellow" size={14} />
                  <span className="text-[11px] text-white/40">AI is thinking...</span>
                </div>
              </div>
            )}
            
            {/* Suggestions */}
            {!isLoading && messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(suggestion)}
                    className="text-[11px] bg-white/5 hover:bg-brand-yellow hover:text-brand-black border border-white/10 rounded-full px-3 py-1.5 transition-all duration-300 text-white/60"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-white/5">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask me anything..."
                className="w-full bg-brand-black border border-white/10 rounded-xl py-2.5 pl-3 pr-10 text-[13px] text-white focus:border-brand-yellow/50 focus:outline-none transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-brand-yellow text-brand-black rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
              >
                <Send size={14} />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-center gap-1 text-[9px] text-white/30 uppercase tracking-widest font-bold">
              <Sparkles size={9} /> Powered by Showthink AI
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatBot;
