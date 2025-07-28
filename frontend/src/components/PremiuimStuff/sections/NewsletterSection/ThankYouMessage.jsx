// ThankYouMessage.jsx
import React from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

const roleMessages = {
  Lawyer: "⚖️ Get ready to provide expert legal guidance to businesses worldwide.",
  Accountant: "💰 Be ready for auditing financials and securing business prosperity.",
  "IT Practitioner": "💻 Prepare to innovate and support global business technologies.",
  "Fellow Entrepreneur": "🚀 Gear up to drive entrepreneurial success on a global scale.",
};

const ThankYouMessage = ({ name, role, newsletterConfirmed, finalSubscribeChecked }) => {
  const isSubscribed = newsletterConfirmed === "subscribed" || finalSubscribeChecked;

  return (
    <motion.div
      role="alert"
      aria-live="polite"
      className="text-center mt-6"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-600 rounded-full flex items-center justify-center">
          <CheckCircleIcon className="h-8 w-8 text-white" />
        </div>

        {name ? (
          <h3 className="text-xl font-semibold text-emerald-400">Thank you, {name}!</h3>
        ) : (
          <h3 className="text-xl font-semibold text-emerald-400">Thank you for your interest!</h3>
        )}

        {role === "Skipped" ? (
          <p className="text-slate-300">You chose to skip role selection.</p>
        ) : (
          <p className="text-slate-300">{roleMessages[role] || "Thank you for joining us!"}</p>
        )}

        <p className="text-slate-300">
          {isSubscribed
            ? "You are subscribed to our newsletter. Welcome aboard!"
            : "You chose to skip newsletter subscription."}
        </p>

        <p className="text-slate-300">You've been added to our exclusive waitlist.</p>
      </div>
    </motion.div>
  );
};

ThankYouMessage.propTypes = {
  name: PropTypes.string,
  role: PropTypes.string.isRequired,
  newsletterConfirmed: PropTypes.string,
  finalSubscribeChecked: PropTypes.bool.isRequired,
};

ThankYouMessage.defaultProps = {
  name: "",
  newsletterConfirmed: null,
};

export default ThankYouMessage;
