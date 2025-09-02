import React from "react";
import { motion } from "framer-motion";

const ThankYouMessage = ({ name, role, newsletterConfirmed, finalSubscribeChecked }) => {
  const isSubscribed = newsletterConfirmed === "subscribed" || finalSubscribeChecked;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-4"
    >
      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">
        Thank You{name ? `, ${name.split(" ")[0]}` : ""}!
      </h3>

      <p className="text-slate-300 mb-6">
        {role === "Skipped"
          ? "We appreciate your interest in busin.us."
          : `We're excited to have a ${role} on board.`}
      </p>

      {isSubscribed ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-6">
          <p className="text-emerald-400">
            🎉 You're subscribed to our newsletter! Check your inbox for exclusive business insights.
          </p>
        </div>
      ) : (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
          <p className="text-amber-400">
            You've chosen to skip our newsletter. You can always subscribe later.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <a
          href="/workflow-ai"
          className="inline-block w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
        >
          Create Your Business Plan with AI
        </a>

        <div className="text-sm text-slate-400">
          <p>What happens next?</p>
          <ul className="mt-2 space-y-1 text-left list-disc list-inside">
            <li>We'll send you a welcome email with next steps</li>
            <li>Our team will review your profile and reach out</li>
            <li>Get exclusive access to our business planning tools</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default ThankYouMessage;