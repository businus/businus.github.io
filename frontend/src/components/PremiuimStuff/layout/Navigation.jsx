// src/components/layout/Navigation.jsx
import React, { forwardRef, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PhoneIcon, EnvelopeIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import LogoComponent from '../../shared/LogoComponent';

const WHATSAPP_NUMBER = "+917975113388"; // international format without spaces or dashes
const PHONE_NUMBER_DISPLAY = "+91 7975 113388";
const PRESET_WHATSAPP_TEXT_BASE = "hello shiva hi there from";

function useDeviceType() {
  const [deviceType, setDeviceType] = useState("desktop");
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(ua)) setDeviceType("mobile");
    else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) setDeviceType("mobile");
    else if (/tablet|ipad|playbook|silk/i.test(ua)) setDeviceType("tablet");
    else setDeviceType("desktop");
  }, []);
  return deviceType;
}

const Navigation = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const [showPhoneOptions, setShowPhoneOptions] = useState(false);

  const deviceType = useDeviceType();

  const handleLogoClick = () => {
    // Audio playback is handled within LogoComponent
  };

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowPhoneOptions(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowPhoneOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // WhatsApp link with preset message text and device type
  const getWhatsAppLink = () => {
    const text = `${PRESET_WHATSAPP_TEXT_BASE} ${deviceType}`;
    return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER.replace(/\D/g, "")}&text=${encodeURIComponent(text)}`;
  };

  return (
    <nav
      ref={ref}
      role="navigation"
      aria-label="Main navigation"
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50
                 w-full max-w-full sm:w-[95%] sm:max-w-7xl
                 bg-white/15 backdrop-blur-[30px] border border-white/25
                 rounded-3xl shadow-[0_10px_30px_rgba(5,150,105,0.25)]
                 backdrop-saturate-150 transition-transform
                 pb-6 sm:pb-4"
      style={{ willChange: "transform" }}
      {...props}
    >
      <div className="px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 py-3 sm:py-4">
          {/* Logo container */}
          <motion.div
            role="button"
            tabIndex={0}
            className="flex items-center cursor-pointer select-none outline-none relative
                       rounded-2xl bg-gradient-to-br from-white/40 via-white/30 to-white/15
                       shadow-[8px_8px_30px_rgba(0,0,0,0.12),-8px_-8px_30px_rgba(255,255,255,0.2)]
                       p-2 sm:p-3 border border-white/40 backdrop-blur-[20px]"
            initial={{ opacity: 0, x: -30 }}
            animate={{
              opacity: 1,
              x: 0,
              y: [0, -15, 0], // bounce animation
              boxShadow: [
                "0 0 10px 5px rgba(5, 150, 105, 0.3)",
                "0 0 20px 10px rgba(5, 200, 135, 0.7)",
                "0 0 10px 5px rgba(5, 150, 105, 0.3)",
              ],
            }}
            transition={{
              y: { repeat: Infinity, repeatType: "loop", duration: 3, ease: "easeInOut" },
              boxShadow: { repeat: Infinity, repeatType: "mirror", duration: 4, ease: "easeInOut" },
              default: { duration: 0.8, ease: "easeOut" },
            }}
            onClick={handleLogoClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleLogoClick();
              }
            }}
            aria-label="Play Busin.us sound"
            whileHover={{
              scale: 1.15,
              boxShadow:
                "0 0 30px 8px rgba(5, 220, 100, 0.8), inset 0 0 12px 5px rgba(6, 255, 140, 0.6)",
              transition: { type: "spring", stiffness: 400, damping: 15 },
            }}
            whileFocus={{
              scale: 1.15,
              boxShadow:
                "0 0 35px 10px rgba(5, 220, 100, 0.9), inset 0 0 14px 6px rgba(6, 255, 140, 0.7)",
              transition: { type: "spring", stiffness: 400, damping: 15 },
            }}
          >
            <LogoComponent onLogoClick={handleLogoClick} size="lg" />
          </motion.div>

          {/* Contact info */}
          <motion.div
            className="flex flex-col sm:flex-row items-center sm:space-x-8 space-y-2 sm:space-y-0 relative
                       text-white/80 text-center sm:text-left"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            ref={containerRef}
          >
            {/* Phone dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={showPhoneOptions}
                onClick={() => setShowPhoneOptions((v) => !v)}
                className="flex items-center hover:text-emerald-400 transition-colors group
                           shadow-sm hover:shadow-md px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <PhoneIcon className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform text-teal-400" />
                <span className="text-sm sm:text-base font-semibold tracking-wide">{PHONE_NUMBER_DISPLAY}</span>
                <ChevronDownIcon className="h-4 w-4 ml-1 text-teal-400" aria-hidden="true" />
              </button>

              {showPhoneOptions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-50 mt-1 right-0 w-44 rounded-md bg-white/90 backdrop-blur-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <a
                    href={`tel:${WHATSAPP_NUMBER}`}
                    onClick={() => setShowPhoneOptions(false)}
                    className="block px-4 py-2 text-sm text-gray-900 hover:bg-emerald-100"
                    role="menuitem"
                    tabIndex={0}
                  >
                    Call {PHONE_NUMBER_DISPLAY}
                  </a>
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowPhoneOptions(false)}
                    className="block px-4 py-2 text-sm text-gray-900 hover:bg-emerald-100"
                    role="menuitem"
                    tabIndex={0}
                  >
                    WhatsApp Chat
                  </a>
                </motion.div>
              )}
            </div>

            {/* Email link */}
            <a
              href="mailto:info@busin.us"
              className="flex items-center hover:text-emerald-400 transition-colors group
                         shadow-sm hover:shadow-md px-3 py-1 rounded-md"
            >
              <EnvelopeIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-2 group-hover:scale-110 transition-transform text-teal-400" />
              <span className="text-sm sm:text-base font-semibold tracking-wide">info@busin.us</span>
            </a>
          </motion.div>
        </div>
      </div>

    </nav>
  );
});

export default Navigation;
