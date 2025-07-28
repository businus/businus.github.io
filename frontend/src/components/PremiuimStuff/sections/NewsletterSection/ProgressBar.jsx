// ProgressBar.jsx
import React from "react";
import PropTypes from "prop-types";

const milestones = [
  { id: 1, label: "Join", icon: "📝" },
  { id: 2, label: "Newsletter", icon: "🚀" },
  { id: 3, label: "Role Select", icon: "👤" },
  { id: 4, label: "Thank You", icon: "✅" },
];

const ProgressBar = ({ currentStep }) => {
  return (
    <nav aria-label="Progress" className="max-w-xl mx-auto mb-8 px-4 select-none">
      <ol className="flex justify-between items-center">
        {milestones.map(({ id, label, icon }, idx) => {
          const isCompleted = id < currentStep;
          const isActive = id === currentStep;

          return (
            <li key={id} className="flex items-center flex-1 relative">
              {/* Circle */}
              <span
                className={`flex items-center justify-center rounded-full border-2 w-10 h-10 z-10 shrink-0
                  ${
                    isCompleted
                      ? "bg-teal-500 border-teal-500 text-white"
                      : isActive
                      ? "border-teal-500 text-teal-500 font-semibold"
                      : "border-gray-300 text-gray-400"
                  }
                `}
              >
                <span aria-hidden="true" style={{ fontSize: "1.25rem" }}>
                  {icon}
                </span>
              </span>

              {/* Connector line (skipped for last item) */}
              {idx !== milestones.length - 1 && (
                <div
                  aria-hidden="true"
                  className={`flex-grow h-1 ml-2 ${
                    isCompleted ? "bg-teal-500" : "bg-gray-300"
                  }`}
                />
              )}

              {/* Label */}
              <span
                className={`absolute -bottom-7 w-max text-xs text-center font-medium left-1/2 -translate-x-1/2
                  ${
                    isCompleted ? "text-teal-600" : isActive ? "text-teal-600" : "text-gray-400"
                  }
                `}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

ProgressBar.propTypes = {
  currentStep: PropTypes.number.isRequired,
};

export default ProgressBar;
