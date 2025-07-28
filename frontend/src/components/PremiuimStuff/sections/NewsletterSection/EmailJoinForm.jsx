// EmailJoinForm.jsx
import React, { useState } from "react";
import { ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

const EmailJoinForm = ({ name, setName, email, setEmail, isLoading, onJoin }) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleJoin = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      await onJoin();
      setSuccessMessage("You have been added to the waitlist!");
    } catch {
      setErrorMessage("Failed to join waitlist. Please try again.");
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoading) {
      handleJoin();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={handleNameChange}
        placeholder="Enter your name"
        disabled={isLoading}
        className="w-full px-4 py-4 bg-slate-900/70 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-400 text-lg transition"
        aria-label="Name input"
        required
      />
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Enter your email address"
        disabled={isLoading}
        className="w-full px-4 py-4 bg-slate-900/70 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-400 text-lg transition"
        aria-label="Email address input"
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-lg font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
        aria-label="Join Elite Waitlist"
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

      {successMessage && (
        <div
          className="mt-3 flex items-center text-green-400 text-sm font-semibold bg-green-900/30 rounded-md p-2 animate-fadeIn"
          role="alert"
          aria-live="polite"
        >
          <CheckCircleIcon className="h-5 w-5 mr-1" />
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div
          className="mt-3 text-red-500 text-sm font-semibold bg-red-900/30 rounded-md p-2 animate-fadeIn"
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </div>
      )}
    </form>
  );
};

EmailJoinForm.propTypes = {
  name: PropTypes.string.isRequired,
  setName: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onJoin: PropTypes.func.isRequired,
};

export default EmailJoinForm;
