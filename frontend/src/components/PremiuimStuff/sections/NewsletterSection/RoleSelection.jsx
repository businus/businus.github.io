import React from "react";
import PropTypes from "prop-types";

const RoleSelection = ({
  newsletterConfirmed,
  finalSubscribeChecked,
  setFinalSubscribeChecked,
  roles,
  onRoleSelect,
  onSkipRole,
}) => {
  const handleCheckboxChange = (e) => {
    setFinalSubscribeChecked(e.target.checked);
  };

  return (
    <div className="text-center space-y-6 mt-4">
      <p className="text-slate-400 mb-2">
        Newsletter Status:{" "}
        {newsletterConfirmed === "subscribed" ? (
          <span className="text-emerald-400 font-semibold">Subscribed ✅</span>
        ) : (
          <span className="text-yellow-400 font-semibold">Skipped ⚠️</span>
        )}
      </p>

      {newsletterConfirmed === "skipped" && (
        <div className="mb-4">
          <input
            id="final-subscribe-checkbox"
            type="checkbox"
            checked={finalSubscribeChecked}
            onChange={handleCheckboxChange}
            className="form-checkbox h-5 w-5 text-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1"
          />
          <label
            htmlFor="final-subscribe-checkbox"
            className="ml-2 cursor-pointer text-slate-300 select-none"
          >
            Subscribe to our newsletter (optional)
          </label>
        </div>
      )}

      <h3 className="text-lg font-semibold text-slate-300 mb-4">Are you a:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roles.map(({ name, emoji }) => (
          <button
            key={name}
            onClick={() => onRoleSelect(name)}
            className="px-4 py-3 bg-slate-700 hover:bg-emerald-600 rounded-lg text-white font-medium transition flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1"
            type="button"
            aria-label={`Select role ${name}`}
          >
            <span>{emoji}</span>
            <span>{name}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onSkipRole}
        className="mt-6 px-6 py-3 border border-slate-600 hover:border-emerald-500 rounded-xl text-slate-400 hover:text-emerald-400 font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1"
        aria-label="Skip role selection"
      >
        Skip role selection
      </button>
    </div>
  );
};

RoleSelection.propTypes = {
  newsletterConfirmed: PropTypes.string,
  finalSubscribeChecked: PropTypes.bool.isRequired,
  setFinalSubscribeChecked: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      emoji: PropTypes.string.isRequired,
    })
  ).isRequired,
  onRoleSelect: PropTypes.func.isRequired,
  onSkipRole: PropTypes.func.isRequired,
};

RoleSelection.defaultProps = {
  newsletterConfirmed: null,
};

export default RoleSelection;
