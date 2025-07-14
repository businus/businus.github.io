import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIntersectionObserver } from 'react-intersection-observer';
import { 
  CheckCircleIcon, 
  GlobeAltIcon, 
  DocumentCheckIcon, 
  CalculatorIcon, 
  MegaphoneIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  StarIcon,
  ArrowRightIcon,
  PlayIcon,
  ShieldCheckIcon,
  TrophyIcon,
  UsersIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

gsap.registerPlugin(ScrollTrigger);

const PremiumLandingPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeService, setActiveService] = useState(0);
  const [visibleSection, setVisibleSection] = useState('hero');

  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const statsRef = useRef(null);
  const timelineRef = useRef(null);
  const testimonialRef = useRef(null);
  const ctaRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    // Mouse tracking for interactive effects
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // GSAP animations
    gsap.fromTo('.hero-text', {
      y: 100,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out',
      stagger: 0.2
    });

    gsap.fromTo('.floating-element', {
      y: 0,
      rotation: 0
    }, {
      y: -20,
      rotation: 5,
      duration: 3,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1
    });

    // Parallax effects
    gsap.to('.parallax-bg', {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: '.parallax-bg',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Animate button
    gsap.to('.submit-btn', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });

    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      setEmail('');
      
      // Success animation
      gsap.fromTo('.success-message', {
        scale: 0,
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)'
      });
    }, 1000);
  };

  const services = [
    {
      icon: DocumentCheckIcon,
      title: 'Legal Compliance',
      description: 'Navigate complex international regulations with our expert legal team. We ensure your business meets all requirements for seamless global operations.',
      image: 'https://images.unsplash.com/photo-1560250163-17506787d971?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwyfHxidXNpbmVzcyUyMG1lZXRpbmd8ZW58MHx8fGJsdWV8MTc1MjUzMDI4NHww&ixlib=rb-4.1.0&q=85',
      features: ['International Law', 'Regulatory Compliance', 'Documentation', 'Risk Assessment'],
      gradient: 'from-emerald-400 to-teal-600'
    },
    {
      icon: CalculatorIcon,
      title: 'Financial Audits',
      description: 'Comprehensive financial analysis and audit services to maintain transparency and meet international standards.',
      image: 'https://images.unsplash.com/photo-1643962578875-90e5e275d449?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwzfHxmaW5hbmNpYWwlMjBjaGFydHN8ZW58MHx8fGJsdWV8MTc1MjUyNjU4Nnww&ixlib=rb-4.1.0&q=85',
      features: ['Financial Analysis', 'Audit Reports', 'Tax Planning', 'Cost Optimization'],
      gradient: 'from-blue-400 to-indigo-600'
    },
    {
      icon: MegaphoneIcon,
      title: 'Marketing Excellence',
      description: 'Strategic marketing solutions tailored for international markets, ensuring your brand resonates globally.',
      image: 'https://images.unsplash.com/photo-1495653797063-114787b77b23?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwzfHxidXNpbmVzcyUyMGhhbmRzaWFrZXxlbnwwfHx8Ymx1ZXwxNzUyNTMwMjkxfDA&ixlib=rb-4.1.0&q=85',
      features: ['Brand Strategy', 'Market Research', 'Digital Marketing', 'Local Adaptation'],
      gradient: 'from-purple-400 to-pink-600'
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Expansion',
      description: 'End-to-end support for international market entry, from strategy to execution.',
      image: 'https://images.unsplash.com/photo-1580893246395-52aead8960dc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGhhbmRzaWFrZXxlbnwwfHx8Ymx1ZXwxNzUyNTMwMjkxfDA&ixlib=rb-4.1.0&q=85',
      features: ['Market Entry', 'Local Partnerships', 'Cultural Adaptation', 'Growth Strategy'],
      gradient: 'from-orange-400 to-red-600'
    }
  ];

  const stats = [
    { icon: TrophyIcon, number: '500+', label: 'Successful Launches', color: 'text-emerald-400' },
    { icon: UsersIcon, number: '50+', label: 'Countries Served', color: 'text-blue-400' },
    { icon: ChartBarIcon, number: '98%', label: 'Success Rate', color: 'text-purple-400' },
    { icon: ShieldCheckIcon, number: '24/7', label: 'Expert Support', color: 'text-orange-400' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechFlow Solutions',
      content: 'busin.us transformed our global expansion. Their expertise in compliance and market entry was invaluable.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616c6d9be54?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      company: 'TechFlow Solutions'
    },
    {
      name: 'Michael Chen',
      role: 'Founder, Global Ventures',
      content: 'The financial audit services helped us maintain transparency across 12 countries. Exceptional service!',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      company: 'Global Ventures'
    },
    {
      name: 'Emma Rodriguez',
      role: 'COO, International Trade Corp',
      content: 'Professional, efficient, and incredibly knowledgeable. They made complex regulations simple.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      company: 'International Trade Corp'
    }
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Discovery & Analysis',
      description: 'We analyze your business goals, target markets, and create a comprehensive expansion strategy.',
      icon: ChartBarIcon,
      color: 'emerald'
    },
    {
      number: '02',
      title: 'Compliance Framework',
      description: 'Our legal experts establish the regulatory framework for your international operations.',
      icon: ShieldCheckIcon,
      color: 'blue'
    },
    {
      number: '03',
      title: 'Implementation',
      description: 'We guide you through setup, registration, and initial market entry with ongoing support.',
      icon: CheckCircleIcon,
      color: 'purple'
    },
    {
      number: '04',
      title: 'Growth & Optimization',
      description: 'Continuous monitoring, optimization, and scaling strategies to maximize your global success.',
      icon: TrophyIcon,
      color: 'orange'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]"></div>
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg blur opacity-30"></div>
                <div className="relative flex items-center bg-slate-800 rounded-lg px-3 py-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-lg">b</span>
                  </div>
                  <span className="ml-2 text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent">
                    busin.us
                  </span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <a href="tel:+1-555-0123" className="flex items-center text-slate-300 hover:text-emerald-400 transition-colors group">
                <PhoneIcon className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                <span className="text-lg">+1 (555) 012-3456</span>
              </a>
              <a href="mailto:info@busin.us" className="flex items-center text-slate-300 hover:text-emerald-400 transition-colors group">
                <EnvelopeIcon className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                <span className="text-lg">info@busin.us</span>
              </a>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ opacity, scale }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="hero-text"
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  Launch Your Business{' '}
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    Globally
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
                  Transform your vision into a global empire with our comprehensive business assistance, 
                  legal compliance, and strategic growth solutions.
                </p>
              </motion.div>
              
              {/* Premium Email Form */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="max-w-md mx-auto lg:mx-0"
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-30"></div>
                  <div className="relative bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
                    {!isSubmitted ? (
                      <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <div className="space-y-3">
                          <div className="relative">
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter your email address"
                              className="w-full px-4 py-4 bg-slate-900/50 border border-slate-600 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-slate-400 text-lg transition-all duration-300"
                              required
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-600/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
                          </div>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="submit-btn w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-lg font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
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
                        </div>
                      </form>
                    ) : (
                      <motion.div
                        className="success-message text-center"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: 'back.out(1.7)' }}
                      >
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-600 rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-emerald-400">Welcome to the Elite!</h3>
                          <p className="text-slate-300">You've been added to our exclusive waitlist.</p>
                        </div>
                      </motion.div>
                    )}
                    
                    <p className="text-sm text-slate-400 mt-4 text-center">
                      🚀 Be the first to access our premium services
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Hero Image with 3D Effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="relative"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl blur-2xl opacity-20"></div>
                <div className="floating-element relative">
                  <img
                    src="https://images.unsplash.com/photo-1542641728-6ca359b085f4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxidXNpbmVzcyUyMHRlYW18ZW58MHx8fGJsdWV8MTc1MjUyMjE0OHww&ixlib=rb-4.1.0&q=85"
                    alt="Global Business Success"
                    className="rounded-3xl shadow-2xl w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent rounded-3xl"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
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
                    <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                    <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-slate-300 text-sm">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="py-20 relative">
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

      {/* Process Timeline */}
      <section ref={timelineRef} className="py-20 relative">
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
                    <div className={`absolute -inset-1 bg-gradient-to-r from-${step.color}-500 to-${step.color}-600 rounded-2xl blur opacity-25`}></div>
                    <div className="relative bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50">
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r from-${step.color}-500 to-${step.color}-600 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4`}>
                          {step.number}
                        </div>
                        <h3 className="text-2xl font-semibold text-white">{step.title}</h3>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center w-16 h-16 mx-8">
                  <div className={`w-16 h-16 bg-gradient-to-r from-${step.color}-500 to-${step.color}-600 rounded-full flex items-center justify-center`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialRef} className="py-20 relative">
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

      {/* Final CTA */}
      <section ref={ctaRef} className="py-20 relative">
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
                href="tel:+1-555-0123"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-lg font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                <PhoneIcon className="h-6 w-6 mr-2" />
                Call Now: +1 (555) 012-3456
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

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">b</span>
                </div>
                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent">
                  busin.us
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed mb-6">
                The premier destination for global business expansion, legal compliance, and strategic growth solutions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Legal Compliance</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Financial Audits</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Marketing Excellence</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Global Expansion</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-3 text-emerald-400" />
                  <span className="text-slate-300">+1 (555) 012-3456</span>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 mr-3 text-emerald-400" />
                  <span className="text-slate-300">info@busin.us</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-3 text-emerald-400" />
                  <span className="text-slate-300">Global Headquarters<br />New York, NY</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700/50 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 busin.us. All rights reserved. Premium business solutions for global success.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PremiumLandingPage;