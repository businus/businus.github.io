// src/components/sections/ProcessTimeline.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

const processSteps = [
  {
    number: '01',
    title: 'Discovery & Analysis',
    description: 'We analyze your business goals, target markets, and create a comprehensive expansion strategy.',
    icon: ChartBarIcon,
    color: 'emerald',
  },
  {
    number: '02',
    title: 'Compliance Framework',
    description: 'Our legal experts establish the regulatory framework for your international operations.',
    icon: ShieldCheckIcon,
    color: 'blue',
  },
  {
    number: '03',
    title: 'Implementation',
    description: 'We guide you through setup, registration, and initial market entry with ongoing support.',
    icon: CheckCircleIcon,
    color: 'purple',
  },
  {
    number: '04',
    title: 'Growth & Optimization',
    description: 'Continuous monitoring, optimization, and scaling strategies to maximize your global success.',
    icon: TrophyIcon,
    color: 'orange',
  },
];

const ProcessTimeline = () => {
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
            Our{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent">
              Process
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            A proven methodology that transforms businesses into global success stories
          </p>
        </motion.div>

        <div className="space-y-12">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <div className="flex-1">
                <div className="relative">
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r from-${step.color}-500 to-${step.color}-600 rounded-2xl blur opacity-25`}
                  ></div>
                  <div className="relative bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50">
                    <div className="flex items-center mb-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r from-${step.color}-500 to-${step.color}-600 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4`}
                      >
                        {step.number}
                      </div>
                      <h3 className="text-2xl font-semibold text-white">{step.title}</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center w-16 h-16 mx-8">
                <div
                  className={`w-16 h-16 bg-gradient-to-r from-${step.color}-500 to-${step.color}-600 rounded-full flex items-center justify-center`}
                >
                  <step.icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
