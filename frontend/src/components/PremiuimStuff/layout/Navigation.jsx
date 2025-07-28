import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Navigation = () => {
  const audioRef = useRef(null);

  const handleLogoClick = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <nav
      className="
        fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl
        bg-white/15 backdrop-blur-[30px]
        border border-white/25 rounded-3xl
        shadow-[0_10px_30px_rgba(5,150,105,0.25)]
        backdrop-saturate-150 transition-transform
      "
      style={{ willChange: 'transform' }}
    >
      <div className="px-6 sm:px-10 lg:px-16">
        <div className="flex justify-between items-center h-20">

          <motion.div
            role="button"
            tabIndex={0}
            className="
              flex items-center cursor-pointer select-none outline-none relative rounded-2xl
              bg-gradient-to-br from-white/40 via-white/30 to-white/15
              shadow-[8px_8px_30px_rgba(0,0,0,0.12),-8px_-8px_30px_rgba(255,255,255,0.2)]
              p-3 border border-white/40 backdrop-blur-[20px]
            "
            initial={{ opacity: 0, x: -30 }}
            animate={{
              opacity: 1,
              x: 0,
              y: [0, -15, 0],              // bounce up and down
              boxShadow: [
                '0 0 10px 5px rgba(5, 150, 105, 0.3)',
                '0 0 20px 10px rgba(5, 200, 135, 0.7)',
                '0 0 10px 5px rgba(5, 150, 105, 0.3)',
              ],
            }}
            transition={{
              y: { repeat: Infinity, repeatType: 'loop', duration: 3, ease: 'easeInOut' },
              boxShadow: { repeat: Infinity, repeatType: 'mirror', duration: 4, ease: 'easeInOut' },
              default: { duration: 0.8, ease: 'easeOut' }, // for opacity & x at start
            }}
            onClick={handleLogoClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLogoClick();
              }
            }}
            aria-label="Play Busin.us sound"
            whileHover={{
              scale: 1.15,
              boxShadow:
                '0 0 30px 8px rgba(5, 220, 100, 0.8), inset 0 0 12px 5px rgba(6, 255, 140, 0.6)',
              transition: { type: 'spring', stiffness: 400, damping: 15 },
            }}
            whileFocus={{
              scale: 1.15,
              boxShadow:
                '0 0 35px 10px rgba(5, 220, 100, 0.9), inset 0 0 14px 6px rgba(6, 255, 140, 0.7)',
              transition: { type: 'spring', stiffness: 400, damping: 15 },
            }}
          >
            <img
              src="/assets/businslogoupscaled.png"
              alt="busin.us logo"
              className="w-14 h-14 rounded-xl shadow-lg object-contain drop-shadow-lg"
              draggable={false}
              loading="eager"
            />
            <span
              className="
                ml-4 text-3xl font-extrabold tracking-tight
                bg-gradient-to-r from-emerald-400 via-teal-500 to-teal-600
                bg-clip-text text-transparent select-none drop-shadow-md
              "
            >
              Busin.us
            </span>

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="
                pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2
                bg-teal-600 bg-opacity-90 text-white text-xs rounded-md px-3 py-1
                shadow-lg select-none font-medium tracking-wide
              "
            >
              Click logo to play sound
            </motion.div>
          </motion.div>

          <motion.div
            className="flex items-center space-x-12"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <a
              href="tel:+91-7975-113388"
              className="
                flex items-center text-white/80 hover:text-emerald-400
                transition-colors group shadow-sm hover:shadow-md
              "
            >
              <PhoneIcon className="h-7 w-7 mr-3 group-hover:scale-110 transition-transform text-teal-400" />
              <span className="text-lg font-semibold tracking-wide">
                +91 7975 113388
              </span>
            </a>

            <a
              href="mailto:info@busin.us"
              className="
                flex items-center text-white/80 hover:text-emerald-400
                transition-colors group shadow-sm hover:shadow-md
              "
            >
              <EnvelopeIcon className="h-7 w-7 mr-3 group-hover:scale-110 transition-transform text-teal-400" />
              <span className="text-lg font-semibold tracking-wide">
                info@busin.us
              </span>
            </a>
          </motion.div>
        </div>
      </div>

      <audio ref={audioRef} src="/assets/This is Businus.mp3" preload="auto" />
    </nav>
  );
};

export default Navigation;
