// src/components/layout/PremiumLandingPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import HeroSection from "../sections/HeroSection.jsx";
import StatsSection from "../sections/StatsSection";
import ServicesSection from "../sections/ServicesSection.jsx";
import ProcessTimeline from "../sections/ProcessTimeline.jsx";
import TestimonialsSection from "../sections/TestimonialsSection";
import FinalCTA from "../sections/FinalCTA.jsx";
import Footer from "../sections/Footer.jsx";

import Navigation from "./Navigation.jsx"; // add this import

const PremiumLandingPage = () => {
  // States
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeService, setActiveService] = useState(0);

  // Refs (if you want to add scroll-linked things later)
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const statsRef = useRef(null);
  const timelineRef = useRef(null);
  const testimonialRef = useRef(null);
  const ctaRef = useRef(null);

  // Scroll progress and animation controls
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      setEmail("");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]"></div>
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${
              mousePosition.y * 0.02
            }px)`,
          }}
        ></div>
      </div>
      <Navigation />
      {/* Sections */}
      <HeroSection
        email={email}
        setEmail={setEmail}
        isSubmitted={isSubmitted}
        setIsSubmitted={setIsSubmitted} // added here
        isLoading={isLoading}
        setIsLoading={setIsLoading} // added here
        handleEmailSubmit={handleEmailSubmit}
        opacity={opacity}
        scale={scale}
      />

      <StatsSection />

      <ServicesSection
        activeService={activeService}
        setActiveService={setActiveService}
      />

      <ProcessTimeline />

      <TestimonialsSection />

      <FinalCTA />

      <Footer />
    </div>
  );
};

export default PremiumLandingPage;
