// src/components/layout/Navigation.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 
      bg-white/10 backdrop-blur-lg border border-white/20 
      rounded-b-2xl shadow-lg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-16">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 rounded-xl blur opacity-40"></div>
              <div className="relative flex items-center bg-white/20 rounded-xl px-4 py-2 backdrop-blur-md shadow-inner">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">b</span>
                </div>
                <span className="ml-3 text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent select-none">
                  busin.us
                </span>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="flex items-center space-x-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a
              href="tel:+91-7975-113388"
              className="flex items-center text-white/80 hover:text-emerald-400 transition-colors group"
            >
              <PhoneIcon className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
              <span className="text-lg font-semibold">+91 7975 113388</span>
            </a>
            <a
              href="mailto:info@busin.us"
              className="flex items-center text-white/80 hover:text-emerald-400 transition-colors group"
            >
              <EnvelopeIcon className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
              <span className="text-lg font-semibold">info@busin.us</span>
            </a>
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
