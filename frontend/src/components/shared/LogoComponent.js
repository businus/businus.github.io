import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const LogoComponent = ({ onLogoClick, size = 'md', includeAudio = true }) => {
  const audioRef = useRef(null);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const handleLogoClick = () => {
    // Play sound if audioRef is available
    if (audioRef.current && includeAudio) {
      audioRef.current.play();
    }
    
    if (onLogoClick) {
      onLogoClick();
    }
  };

  return (
    <>
      <div 
        className="flex items-center cursor-pointer select-none"
        onClick={handleLogoClick}
      >
        <img
          src="/assets/businslogoupscaled.png"
          alt="busin.us logo"
          className={`${sizeClasses[size]} sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl shadow-lg object-contain drop-shadow-lg`}
          draggable={false}
          loading="eager"
        />
        <span
          className={`ml-2 sm:ml-3 text-sm sm:text-base md:text-xl lg:text-3xl font-extrabold tracking-tight
                     bg-gradient-to-r from-emerald-400 via-teal-500 to-teal-600 bg-clip-text
                     text-transparent select-none drop-shadow-md`}
        >
          Busin.us
        </span>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none absolute bottom-[-2.5rem] sm:bottom-[-2.75rem]
                     left-1/2 -translate-x-1/2 bg-teal-600 bg-opacity-90 text-white
                     text-[9px] sm:text-xs rounded-md px-2 py-1 shadow-lg select-none
                     font-medium tracking-wide whitespace-nowrap max-w-xs sm:max-w-none
                     overflow-hidden text-ellipsis"
        >
          Click logo to play sound
        </motion.div>
      </div>
      {includeAudio && (
        <audio ref={audioRef} src="/assets/This is Businus.mp3" preload="auto" />
      )}
    </>
  );
};

export default LogoComponent;