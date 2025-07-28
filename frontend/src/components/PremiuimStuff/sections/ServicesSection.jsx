// src/components/sections/ServicesSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  DocumentCheckIcon,
  CalculatorIcon,
  MegaphoneIcon,
  GlobeAltIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const services = [
  {
    icon: DocumentCheckIcon,
    title: 'Legal Compliance',
    description:
      'Navigate complex international regulations with our expert legal team. We ensure your business meets all requirements for seamless global operations.',
    image:
      'https://images.unsplash.com/photo-1560250163-17506787d971?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwyfHxidXNpbmVzcyUyMG1lZXRpbmd8ZW58MHx8fGJsdWV8MTc1MjUzMDI4NHww&ixlib=rb-4.1.0&q=85',
    features: ['International Law', 'Regulatory Compliance', 'Documentation', 'Risk Assessment'],
    gradient: 'from-emerald-400 to-teal-600',
  },
  {
    icon: CalculatorIcon,
    title: 'Financial Audits',
    description:
      'Comprehensive financial analysis and audit services to maintain transparency and meet international standards.',
    image:
      'https://images.unsplash.com/photo-1643962578875-90e5e275d449?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwzfHxmaW5hbmNpYWwlMjBjaGFydHN8ZW58MHx8fGJsdWV8MTc1MjUyNjU4Nnww&ixlib=rb-4.1.0&q=85',
    features: ['Financial Analysis', 'Audit Reports', 'Tax Planning', 'Cost Optimization'],
    gradient: 'from-blue-400 to-indigo-600',
  },
  {
    icon: MegaphoneIcon,
    title: 'Marketing Excellence',
    description:
      'Strategic marketing solutions tailored for international markets, ensuring your brand resonates globally.',
    image:
      'https://images.unsplash.com/photo-1495653797063-114787b77b23?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwzfHxidXNpbmVzcyUyMGhhbmRzaWFrZXxlbnwwfHx8Ymx1ZXwxNzUyNTMwMjkxfDA&ixlib=rb-4.1.0&q=85',
    features: ['Brand Strategy', 'Market Research', 'Digital Marketing', 'Local Adaptation'],
    gradient: 'from-purple-400 to-pink-600',
  },
  {
    icon: GlobeAltIcon,
    title: 'Global Expansion',
    description: 'End-to-end support for international market entry, from strategy to execution.',
    image:
      'https://images.unsplash.com/photo-1580893246395-52aead8960dc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGhhbmRzaWFrZXxlbnwwfHx8Ymx1ZXwxNzUyNTMwMjkxfDA&ixlib=rb-4.1.0&q=85',
    features: ['Market Entry', 'Local Partnerships', 'Cultural Adaptation', 'Growth Strategy'],
    gradient: 'from-orange-400 to-red-600',
  },
];

const ServicesSection = ({ activeService, setActiveService }) => {
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
            Premium{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Comprehensive solutions designed to accelerate your global business success
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
              onMouseEnter={() => setActiveService(index)}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50 h-full">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${service.gradient} bg-opacity-20`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-white mb-3">{service.title}</h3>
                    <p className="text-slate-300 mb-4 leading-relaxed">{service.description}</p>

                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-slate-400">
                          <CheckCircleIcon className="h-4 w-4 text-emerald-400 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-xl">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
