// src/components/sections/FinalCTA.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const FinalCTA = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-600/10"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Dominate{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent">
              Global Markets?
            </span>
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join the elite entrepreneurs who chose busin.us for their international expansion
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+917975113388"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-lg font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
            >
              <PhoneIcon className="h-6 w-6 mr-2" />
              Call Now: +91 7975 113388
            </a>
            <a
              href="mailto:info@busin.us"
              className="inline-flex items-center px-8 py-4 bg-slate-800/50 backdrop-blur-md text-white text-lg font-semibold rounded-xl hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50 hover:border-emerald-500/50"
            >
              <EnvelopeIcon className="h-6 w-6 mr-2" />
              Email: info@busin.us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
