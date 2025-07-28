import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  CheckCircleIcon, 
  GlobeAltIcon, 
  DocumentCheckIcon, 
  CalculatorIcon, 
  MegaphoneIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const processRef = useRef(null);
  const faqRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true });
  const isServicesInView = useInView(servicesRef, { once: true });
  const isProcessInView = useInView(processRef, { once: true });
  const isFaqInView = useInView(faqRef, { once: true });

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      setEmail('');
    }, 1000);
  };

  const services = [
    {
      icon: DocumentCheckIcon,
      title: 'Legal Compliance',
      description: 'Navigate complex international regulations and ensure your business meets all legal requirements in new markets.',
      image: 'https://images.unsplash.com/photo-1560250163-17506787d971?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwyfHxidXNpbmVzcyUyMG1lZXRpbmd8ZW58MHx8fGJsdWV8MTc1MjUzMDI4NHww&ixlib=rb-4.1.0&q=85'
    },
    {
      icon: CalculatorIcon,
      title: 'Financial Audits',
      description: 'Professional accounting services and financial audits to maintain transparency and meet regulatory standards.',
      image: 'https://images.unsplash.com/photo-1643962578875-90e5e275d449?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwzfHxmaW5hbmNpYWwlMjBjaGFydHN8ZW58MHx8fGJsdWV8MTc1MjUyNjU4Nnww&ixlib=rb-4.1.0&q=85'
    },
    {
      icon: MegaphoneIcon,
      title: 'Marketing Assistance',
      description: 'Strategic marketing guidance to help your business establish a strong presence in new international markets.',
      image: 'https://images.unsplash.com/photo-1495653797063-114787b77b23?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwzfHxidXNpbmVzcyUyMGhhbmRzaGFrZXxlbnwwfHx8Ymx1ZXwxNzUyNTMwMjkxfDA&ixlib=rb-4.1.0&q=85'
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Market Entry',
      description: 'Comprehensive support for entering new international markets with confidence and regulatory compliance.',
      image: 'https://images.unsplash.com/photo-1580893246395-52aead8960dc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGhhbmRzaGFrZXxlbnwwfHx8Ymx1ZXwxNzUyNTMwMjkxfDA&ixlib=rb-4.1.0&q=85'
    }
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Initial Consultation',
      description: 'We discuss your business goals and international expansion plans during a comprehensive consultation.'
    },
    {
      number: '02',
      title: 'Market Analysis',
      description: 'Our experts analyze your target markets and provide detailed regulatory and compliance requirements.'
    },
    {
      number: '03',
      title: 'Implementation',
      description: 'We guide you through the legal, financial, and marketing setup process step by step.'
    },
    {
      number: '04',
      title: 'Ongoing Support',
      description: 'Continuous assistance to ensure your business remains compliant and competitive in new markets.'
    }
  ];

  const faqs = [
    {
      question: 'What countries do you provide services for?',
      answer: 'We provide business establishment and compliance services across major international markets including the US, UK, Canada, Australia, and European Union countries.'
    },
    {
      question: 'How long does the business setup process take?',
      answer: 'The timeline varies by country and business type, but typically ranges from 2-8 weeks for complete setup including legal compliance and financial audit preparation.'
    },
    {
      question: 'What is included in your financial audit service?',
      answer: 'Our financial audit service includes comprehensive review of financial records, compliance verification, tax preparation assistance, and ongoing financial health monitoring.'
    },
    {
      question: 'Do you provide ongoing support after setup?',
      answer: 'Yes, we offer continuous support packages including regular compliance updates, financial monitoring, and marketing assistance to ensure your business thrives.'
    },
    {
      question: 'How much do your services cost?',
      answer: 'Our pricing depends on the specific services needed and target markets. Contact us for a personalized quote based on your business requirements.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzFmMjk0ZSIvPgo8cGF0aCBkPSJNMTIgMTBIMjBDMjQuNCAxMCAyOCAxMy42IDI4IDE4QzI4IDIwLjIgMjcuMiAyMi4yIDI1LjggMjMuNkMyNy4yIDI1IDI4IDI3IDI4IDI5QzI4IDMzLjQgMjQuNCAzNyAyMCAzN0gxMlYxMFpNMTYgMTRWMjFIMjBDMjIuMiAyMSAyNCAyMC4yIDI0IDE4QzI0IDE1LjggMjIuMiAxNCAyMCAxNEgxNlpNMTYgMjVWMzNIMjBDMjIuMiAzMyAyNCAzMS4yIDI0IDI5QzI0IDI2LjggMjIuMiAyNSAyMCAyNUgxNloiIGZpbGw9IiMxMGI5ODEiLz4KPHA+dGggZD0iTTIwIDIzTDIzIDI2TDI2IDIzIiBzdHJva2U9IiMxMGI5ODEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo="
                alt="busin.us Logo"
                className="h-8 w-8"
              />
              <span className="ml-2 text-xl font-bold text-slate-900">busin.us</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="tel:+1-555-0123" className="flex items-center text-slate-700 hover:text-emerald-600 transition-colors">
                <PhoneIcon className="h-5 w-5 mr-2" />
                <span className="text-lg">+91 7975 113388</span>
              </a>
              <a href="mailto:info@busin.us" className="flex items-center text-slate-700 hover:text-emerald-600 transition-colors">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                <span className="text-lg">info@busin.us</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-slate-50 to-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Launch Your Business 
                <span className="text-emerald-600"> Globally</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
                Expert assistance for multinational business setup, legal compliance, financial audits, and marketing strategies.
              </p>
              
              {/* Email Signup Form */}
              <div className="max-w-md mx-auto lg:mx-0">
                {!isSubmitted ? (
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="flex-1 px-4 py-3 text-lg border-2 border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-emerald-600 text-white text-lg font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                      >
                        {isLoading ? 'Joining...' : 'Join Waitlist'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center text-emerald-800">
                      <CheckCircleIcon className="h-6 w-6 mr-2" />
                      <span className="text-lg font-semibold">Thank you! You've been added to our waitlist.</span>
                    </div>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-slate-500 mt-4">
                * We'll notify you when we officially launch
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1542641728-6ca359b085f4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxidXNpbmVzcyUyMHRlYW18ZW58MHx8fGJsdWV8MTc1MjUyMjE0OHww&ixlib=rb-4.1.0&q=85"
                alt="Professional business consultation"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isServicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive business assistance to help you succeed in international markets
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isServicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <service.icon className="h-8 w-8 text-emerald-600 mr-3" />
                    <h3 className="text-xl font-semibold text-slate-900">{service.title}</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1639768939489-025b90ba9f23?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwyfHxmaW5hbmNpYWwlMjBjaGFydHN8ZW58MHx8fGJsdWV8MTc1MjUyNjU4Nnww&ixlib=rb-4.1.0&q=85"
                alt="Global business network"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Why Choose busin.us?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-emerald-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Global Expertise</h3>
                    <p className="text-slate-600">Years of experience helping businesses expand internationally across multiple markets and industries.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-emerald-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Comprehensive Support</h3>
                    <p className="text-slate-600">From legal compliance to marketing strategies, we provide end-to-end business assistance.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-emerald-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Proven Track Record</h3>
                    <p className="text-slate-600">Successfully helped hundreds of businesses navigate complex international regulations and establish strong market presence.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section ref={processRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isProcessInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our simple, step-by-step process to get your business established globally
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isProcessInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isFaqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600">
              Common questions about our services and process
            </p>
          </motion.div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isFaqInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{faq.question}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Go Global?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join our waitlist and be the first to access our comprehensive business assistance services.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+1-555-0123"
              className="inline-flex items-center px-6 py-3 bg-white text-emerald-600 text-lg font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              <PhoneIcon className="h-5 w-5 mr-2" />
              Call: +91 7975 113388
            </a>
            <a
              href="mailto:info@busin.us"
              className="inline-flex items-center px-6 py-3 bg-emerald-700 text-white text-lg font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
            >
              <EnvelopeIcon className="h-5 w-5 mr-2" />
              Email: info@busin.us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzFmMjk0ZSIvPgo8cGF0aCBkPSJNMTIgMTBIMjBDMjQuNCAxMCAyOCAxMy42IDI4IDE4QzI4IDIwLjIgMjcuMiAyMi4yIDI1LjggMjMuNkMyNy4yIDI1IDI4IDI3IDI4IDI5QzI4IDMzLjQgMjQuNCAzNyAyMCAzN0gxMlYxMFpNMTYgMTRWMjFIMjBDMjIuMiAyMSAyNCAyMC4yIDI0IDE4QzI0IDE1LjggMjIuMiAxNCAyMCAxNEgxNlpNMTYgMjVWMzNIMjBDMjIuMiAzMyAyNCAzMS4yIDI0IDI5QzI0IDI2LjggMjIuMiAyNSAyMCAyNUgxNloiIGZpbGw9IiMxMGI5ODEiLz4KPHA+dGggZD0iTTIwIDIzTDIzIDI2TDI2IDIzIiBzdHJva2U9IiMxMGI5ODEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo="
                  alt="busin.us Logo"
                  className="h-8 w-8"
                />
                <span className="ml-2 text-xl font-bold">busin.us</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Expert multinational business assistance for global expansion, legal compliance, and financial success.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-3 text-emerald-400" />
                  <span>+91 7975 113388</span>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 mr-3 text-emerald-400" />
                  <span>info@busin.us</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-3 text-emerald-400" />
                  <span>123 Business Avenue, Suite 100<br />New York, NY 10001</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-slate-300">
                <li>Legal Compliance</li>
                <li>Financial Audits</li>
                <li>Marketing Assistance</li>
                <li>Global Market Entry</li>
                <li>Business Registration</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 busin.us. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;