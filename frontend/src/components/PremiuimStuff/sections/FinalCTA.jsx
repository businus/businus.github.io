// src/components/sections/FinalCTA.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PhoneIcon, EnvelopeIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const FinalCTA = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleJoinWaitlist = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage
      const signupData = {
        name,
        email,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('busin.us-signup', JSON.stringify(signupData));
      
      setIsSubmitted(true);
      setName('');
      setEmail('');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      setErrorMessage('Failed to join waitlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-600/10"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Dominate{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent">
              Global Markets?
            </span>
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
            Join the elite entrepreneurs who chose busin.us for their international expansion
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contact Information */}
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold mb-6 text-white">Get in Touch</h3>
              <div className="space-y-4">
                <a
                  href="tel:+917975113388"
                  className="inline-flex items-center w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-lg font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
                >
                  <PhoneIcon className="h-6 w-6 mr-2" />
                  Call Now: +91 7975 113388
                </a>
                <a
                  href="mailto:info@busin.us"
                  className="inline-flex items-center w-full sm:w-auto px-6 py-4 bg-slate-800/50 backdrop-blur-md text-white text-lg font-semibold rounded-xl hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50 hover:border-emerald-500/50"
                >
                  <EnvelopeIcon className="h-6 w-6 mr-2" />
                  Email: info@busin.us
                </a>
              </div>
            </div>

            {/* Waitlist Form */}
            <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50">
              <h3 className="text-2xl font-bold mb-6 text-white text-center">Join Our Elite Waitlist</h3>
              <p className="text-slate-300 mb-6 text-center">
                Be the first to access our premium business expansion services
              </p>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
                    <CheckCircleIcon className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Thank You!</h4>
                  <p className="text-slate-300">
                    You've been added to our elite waitlist. We'll contact you soon!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleJoinWaitlist} className="space-y-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    disabled={isLoading}
                    className="w-full px-4 py-4 bg-slate-900/70 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-400 text-lg transition"
                    aria-label="Name input"
                    required
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    disabled={isLoading}
                    className="w-full px-4 py-4 bg-slate-900/70 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-400 text-lg transition"
                    aria-label="Email address input"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-lg font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 group"
                    aria-label="Join Elite Waitlist"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Joining Waitlist...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Join Elite Waitlist
                        <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </button>

                  {errorMessage && (
                    <div
                      className="mt-3 text-red-500 text-sm font-semibold bg-red-900/30 rounded-md p-2 animate-fadeIn"
                      role="alert"
                      aria-live="polite"
                    >
                      {errorMessage}
                    </div>
                  )}
                  
                  <p className="text-xs text-slate-400 text-center mt-4">
                    By joining, you agree to our Privacy Policy and Terms of Service
                  </p>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;