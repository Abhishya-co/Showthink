import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "How long does it take to build a website?",
    answer: "Typically, a standard business website takes 4-6 weeks from discovery to launch. However, the timeline can vary depending on the complexity of the project, the number of pages, and how quickly we receive feedback and content from your side."
  },
  {
    question: "Do you provide revisions?",
    answer: "Yes, we offer multiple rounds of revisions during the design and development phases. Our goal is to ensure you are 100% satisfied with the final product. We work closely with you at every step to align with your vision."
  },
  {
    question: "What is included in pricing?",
    answer: "Our pricing is comprehensive and typically includes strategy, design, development, basic SEO optimization, mobile responsiveness, and a round of testing. We provide a detailed breakdown in our initial proposal so there are no hidden costs."
  },
  {
    question: "How do I contact support?",
    answer: "You can reach our support team via email at a2sfeatures@gmail.com or through our WhatsApp support line at +91 9911230354. For existing clients, we also provide a dedicated project management dashboard for direct communication."
  }
];

interface FAQItemProps {
  key?: React.Key;
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => {
  return (
    <div className={`border-b border-white/10 transition-colors ${isOpen ? 'bg-white/5' : ''}`}>
      <button
        onClick={onClick}
        className="w-full py-6 px-4 flex items-center justify-between text-left group"
      >
        <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-brand-yellow' : 'text-white/80 group-hover:text-white'}`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`${isOpen ? 'text-brand-yellow' : 'text-white/40'}`}
        >
          <ChevronDown size={24} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-6 text-white/60 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 px-6 bg-brand-black">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-sm font-bold mb-6"
          >
            <HelpCircle size={16} />
            Common Questions
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          >
            Frequently Asked <span className="text-gradient-yellow">Questions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/60"
          >
            Everything you need to know about working with us.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card overflow-hidden"
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
