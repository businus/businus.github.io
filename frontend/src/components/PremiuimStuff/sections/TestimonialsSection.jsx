// src/components/sections/TestimonialsSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/outline';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CEO, TechFlow Solutions',
    content: 'busin.us transformed our global expansion. Their expertise in compliance and market entry was invaluable.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616c6d9be54?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    company: 'TechFlow Solutions',
  },
  {
    name: 'Michael Chen',
    role: 'Founder, Global Ventures',
    content: 'The financial audit services helped us maintain transparency across 12 countries. Exceptional service!',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    company: 'Global Ventures',
  },
  {
    name: 'Emma Rodriguez',
    role: 'COO, International Trade Corp',
    content: 'Professional, efficient, and incredibly knowledgeable. They made complex regulations simple.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    company: 'International Trade Corp',
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Success{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent">
              Stories
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Real results from real businesses that trusted us with their global expansion
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50 h-full">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-slate-300 mb-6 italic">"{testimonial.content}"</p>

                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                    <div className="text-sm text-emerald-400">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
