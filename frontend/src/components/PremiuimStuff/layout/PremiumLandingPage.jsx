// src/components/layout/PremiumLandingPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import HeroSection from "../sections/HeroSection.jsx";
import StatsSection from "../sections/StatsSection";
import ServicesSection from "../sections/ServicesSection.jsx";
import ProcessTimeline from "../sections/ProcessTimeline.jsx";
// import TestimonialsSection from "../sections/TestimonialsSection";
import FinalCTA from "../sections/FinalCTA.jsx";
import Footer from "../sections/Footer.jsx";

import Navigation from "./Navigation.jsx";

const PremiumLandingPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeService, setActiveService] = useState(0);
  const [navHeight, setNavHeight] = useState(0);

  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const statsRef = useRef(null);
  const timelineRef = useRef(null);
  const testimonialRef = useRef(null);
  const ctaRef = useRef(null);

  // Ref for navigation to measure height
  const navRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const updateNavHeight = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight);
      }
    };

    // Initial measurement
    updateNavHeight();

    // Update on window resize
    window.addEventListener("resize", updateNavHeight);

    return () => {
      window.removeEventListener("resize", updateNavHeight);
    };
  }, []);

  useEffect(() => {
    let frameId = null;
    const handleMouseMove = (e) => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        frameId = null;
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      setEmail("");
    }, 1000);
  };

  return (
    <>
      <Navigation ref={navRef} />

      <div
        className="min-h-screen bg-slate-900 text-white"
        style={{ paddingTop: navHeight }}
      >
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]"></div>
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]"
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            }}
          ></div>
        </div>
        <HeroSection
          email={email}
          setEmail={setEmail}
          isSubmitted={isSubmitted}
          setIsSubmitted={setIsSubmitted}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          handleEmailSubmit={handleEmailSubmit}
          opacity={opacity}
          scale={scale}
          ref={heroRef}
        />

        <StatsSection ref={statsRef} />

        <ServicesSection
          activeService={activeService}
          setActiveService={setActiveService}
          ref={servicesRef}
        />

        <ProcessTimeline ref={timelineRef} />

        {/* <TestimonialsSection ref={testimonialRef} /> */}

        <FinalCTA ref={ctaRef} />

        <Footer />
      </div>
    </>
  );
};

export default PremiumLandingPage;
