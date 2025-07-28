// NewsletterSlider.jsx
import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const NewsletterSlider = ({ sliderValue, setSliderValue, onRelease }) => {
  const clampedValue = Math.min(100, Math.max(0, sliderValue));
  const rocketPositionStyle = { left: `calc(${clampedValue}% - 1.5rem)` };

  const handleChange = (e) => {
    setSliderValue(Number(e.target.value));
  };

  const handleKeyUp = (e) => {
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
      onRelease();
    }
  };

  return (
    <>
      <p className="text-slate-300 mb-4 text-center">
        Slide the rocket left (☀️) to skip the newsletter or right (🪐) to confirm subscription.
      </p>
      <div className="relative h-14 mb-6">
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={sliderValue}
          onChange={handleChange}
          onMouseUp={onRelease}
          onTouchEnd={onRelease}
          onKeyUp={handleKeyUp}
          className="w-full h-2 rounded-lg appearance-none bg-gradient-to-r from-yellow-400 to-cyan-600 cursor-pointer"
          aria-label="Select newsletter subscription option"
        />
        <div className="absolute left-0 top-6 text-lg select-none pointer-events-none" aria-hidden="true">
          ☀️ Sun (Skip)
        </div>
        <div className="absolute right-0 top-6 text-lg select-none pointer-events-none" aria-hidden="true">
          🪐 Saturn (Confirm)
        </div>
        <motion.div
          className="absolute top-[-2rem] text-4xl select-none pointer-events-none"
          style={rocketPositionStyle}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          aria-hidden="true"
        >
          🚀
        </motion.div>

        <div aria-live="polite" className="sr-only">
          {sliderValue <= 50 ? "Skip newsletter selected" : "Confirm newsletter selected"}
        </div>
      </div>
    </>
  );
};

NewsletterSlider.propTypes = {
  sliderValue: PropTypes.number.isRequired,
  setSliderValue: PropTypes.func.isRequired,
  onRelease: PropTypes.func.isRequired,
};

export default NewsletterSlider;
