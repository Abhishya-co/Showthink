import React from 'react';
import DomainSearch from '../components/DomainSearch';
import { motion } from 'motion/react';

const DomainSearchPage = () => {
  return (
    <div className="pt-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <DomainSearch />
      </motion.div>
    </div>
  );
};

export default DomainSearchPage;
