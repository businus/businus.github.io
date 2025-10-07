import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import useSound from 'use-sound';

const slides = [
  {
    title: "Welcome to Busin.us",
    subtitle: "Empowering Global Business Expansion",
    description: "Your gateway to seamless international growth.",
  },
  {
    title: "Problem",
    bullets: [
      "Businesses face complexity expanding internationally",
      "Legal compliance and audits across borders are challenging",
      "Non-compliance risks and operational hurdles stall growth",
    ],
  },
  {
    title: "Solution",
    description: "Busin.us simplifies global expansion with end-to-end services:",
    bullets: [
      "Legal compliance consulting",
      "Financial audits",
      "Marketing growth strategies",
    ],
  },
  {
    title: "Market Opportunity",
    description: "Growing demand for cross-border business services.",
    bullets: [
      "Startups and SMEs expanding globally",
      "Multibillion-dollar services market",
    ],
  },
  {
    title: "Business Model",
    bullets: [
      "Consulting fees and compliance packages",
      "Subscription for ongoing support",
      "Remote contractor model for global talent and cost efficiency",
    ],
  },
  {
    title: "Competitive Advantage",
    bullets: [
      "Expertise in legal and financial cross-border complexities",
      "Integrated services in one platform",
      "Remote-first approach for 24/7 support",
    ],
  },
  {
    title: "Traction",
    description: "Established partnerships and successful client projects demonstrating growth and market presence.",
  },
  {
    title: "Team",
    description: "Core team with expertise in legal, financial, and marketing services partnered with a diverse remote workforce.",
  },
  {
    title: "Ask",
    bullets: [
      "Funding for scaling services",
      "Strategic partnerships",
      "Opportunities to collaborate with global startups and SMEs",
    ],
  },
  {
    title: "Contact",
    description: "Visit us at busin.us",
    contact: {
      website: "https://www.busin.us",
      email: "contact@busin.us",
    },
  },
];

const PitchDeck = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [playSlideSound] = useSound('/assets/slide-transition.mp3', { volume: 0.25 });

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressAnimation = useAnimation();

  const minSwipeDistance = 50;

  const handleSlideSound = useCallback(() => {
    try {
      playSlideSound();
    } catch (error) {
      console.warn('Failed to play slide sound:', error);
    }
  }, [playSlideSound]);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < slides.length - 1) {
      goToNextSlide();
    } else if (isRightSwipe && currentSlide > 0) {
      goToPrevSlide();
    }
  };

  const goToNextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
      handleSlideSound();
    }
  }, [currentSlide, handleSlideSound]);

  const goToPrevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
      handleSlideSound();
    }
  }, [currentSlide]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      goToNextSlide();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrevSlide();
    }
  }, [goToNextSlide, goToPrevSlide]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        if (currentSlide < slides.length - 1) {
          goToNextSlide();
        } else {
          setIsAutoPlaying(false);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, currentSlide, goToNextSlide]);

  useEffect(() => {
    progressAnimation.start({
      width: `${((currentSlide + 1) / slides.length) * 100}%`,
      transition: { duration: 0.3 }
    });
  }, [currentSlide, progressAnimation]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const Slide = ({ data, isVisible }) => (
    <div className="flex flex-col justify-center min-h-[60vh] md:min-h-0 md:h-full">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient leading-tight"
      >
        {data.title}
      </motion.h1>
      {data.subtitle && (
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl text-white/90 font-semibold mb-3 sm:mb-4 md:mb-6 leading-snug"
        >
          {data.subtitle}
        </motion.h2>
      )}
      {data.description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl text-white/80 mb-6 sm:mb-8 leading-relaxed"
        >
          {data.description}
        </motion.p>
      )}
      {data.bullets && (
        <ul className="space-y-3 sm:space-y-4 md:space-y-6">
          {data.bullets.map((bullet, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
              className="flex items-start sm:items-center text-lg sm:text-xl md:text-2xl text-white/80 leading-snug"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: isVisible ? 1 : 0 }}
                exit={{ scale: 0 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
                className="text-brand-primary text-xl sm:text-2xl mr-3 sm:mr-4 mt-1 sm:mt-0 flex-shrink-0"
              >
                →
              </motion.span>
              <span className="flex-1">{bullet}</span>
            </motion.li>
          ))}
        </ul>
      )}
      {data.contact && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 sm:mt-8 space-y-2 sm:space-y-3"
        >
          <a
            href={data.contact.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg sm:text-xl text-brand-primary hover:text-brand-secondary transition-colors inline-block hover:underline"
          >
            {data.contact.website}
          </a>
          <p className="text-lg sm:text-xl text-white/80">{data.contact.email}</p>
        </motion.div>
      )}
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-bg/95 overflow-hidden relative"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-secondary/10" />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-dark-border z-20">
        <motion.div
          className="h-full bg-brand-primary"
          animate={progressAnimation}
        />
      </div>

      {/* Header with dots navigation */}
      <div className="fixed top-0 left-0 w-full z-20 bg-gradient-to-b from-black/80 via-black/50 to-transparent pt-safe-top pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 pt-4 sm:pt-6">
            {/* Navigation dots */}
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 order-2 sm:order-1 max-w-full overflow-x-auto px-2 -mx-2 pb-2 sm:pb-0">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentSlide ? 1 : -1);
                    setCurrentSlide(index);
                    handleSlideSound();
                  }}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 flex-shrink-0 ${
                    index === currentSlide 
                      ? 'bg-brand-primary w-6 sm:w-8 shadow-lg shadow-brand-primary/30' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center space-x-4 order-1 md:order-2">
              {/* Slide counter */}
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium">
                {currentSlide + 1} / {slides.length}
              </div>

              {/* Auto-play toggle */}
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isAutoPlaying 
                    ? 'text-brand-primary bg-white/20' 
                    : 'text-white/90 hover:bg-white/20'
                }`}
                aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
              >
                {isAutoPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-28 sm:pb-32 min-h-screen flex items-center justify-center relative z-10">
        <motion.div 
          className="w-full max-w-[90vw] sm:max-w-5xl bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl relative overflow-hidden border border-white/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-secondary/10 opacity-75 sm:opacity-100" />
          
          {/* Content container */}
          <div className="relative z-10 p-6 sm:p-12 md:p-16">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 }
                }}
              >
                <Slide data={slides[currentSlide]} isVisible={true} />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Navigation controls */}
      <div className="fixed bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3 sm:space-x-4 z-30">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToPrevSlide}
          disabled={currentSlide === 0}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/90 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-primary hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-dark-bg shadow-lg"
          aria-label="Previous slide"
        >
          <span className="text-lg sm:text-xl">◀</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToNextSlide}
          disabled={currentSlide === slides.length - 1}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/90 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-primary hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-dark-bg shadow-lg"
          aria-label="Next slide"
        >
          <span className="text-lg sm:text-xl">▶</span>
        </motion.button>
      </div>

      {/* Keyboard hint */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-20 sm:bottom-24 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm text-white/70 bg-black/50 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg z-30"
      >
        {window.matchMedia('(pointer: fine)').matches 
          ? 'Use arrow keys or buttons to navigate' 
          : 'Swipe left/right or use buttons to navigate'}
      </motion.div>
      
      {/* Safe area spacing for mobile */}
      <div className="h-safe-bottom" />
    </div>
  );
};

export default PitchDeck;