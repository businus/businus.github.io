// src/components/sections/StatsSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { TrophyIcon, UsersIcon, ChartBarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const stats = [
  { icon: TrophyIcon, number: '1', label: 'Successful Launches', color: 'text-emerald-400' },
  { icon: UsersIcon, number: '50+', label: 'Countries Served', color: 'text-blue-400' },
  { icon: ChartBarIcon, number: '98%', label: 'Success Rate', color: 'text-purple-400' },
  { icon: ShieldCheckIcon, number: '24/7', label: 'Expert Support', color: 'text-orange-400' },
];

const StatsSection = () => {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 rounded-xl blur"></div>
                  <div className="relative bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
                    <Icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                    <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-slate-300 text-sm">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
