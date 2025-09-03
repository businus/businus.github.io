import React, { useState } from 'react';
import { sendWorkflowToTelegram } from './TelegramService';

const WorkflowSignupModal = ({ isOpen, onClose, onExport, nodes, edges, groups }) => {
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [isSignupSubmitted, setIsSignupSubmitted] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    
    if (!signupName.trim()) {
      alert("Please enter your name.");
      return;
    }
    
    if (!isValidEmail(signupEmail)) {
      alert("Please enter a valid email address.");
      return;
    }
    
    // Save to localStorage
    const signupData = {
      name: signupName,
      email: signupEmail,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('busin.us-signup', JSON.stringify(signupData));
    
    // Send to Telegram with workflow data
    sendWorkflowToTelegram(signupName, signupEmail, nodes, edges, groups);
    
    // Mark as submitted
    setIsSignupSubmitted(true);
    
    // Close signup and trigger actual export after a delay
    setTimeout(() => {
      onClose();
      setIsSignupSubmitted(false);
      setSignupName('');
      setSignupEmail('');
      
      // Now actually export since user is authorized
      onExport();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-surface rounded-xl border border-dark-border w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-dark-text-primary">
              {isSignupSubmitted ? 'Thank You!' : 'Join Our Waitlist'}
            </h3>
            <button 
              onClick={onClose}
              className="text-dark-text-secondary hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {isSignupSubmitted ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-dark-text-secondary mb-4">
                Thank you for signing up! Your workflow is being downloaded now.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-dark-bg text-white rounded-lg hover:bg-dark-surface transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <p className="text-dark-text-secondary mb-6">
                Sign up for our newsletter to unlock full export capabilities and receive business planning insights.
              </p>
              
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div>
                  <label className="block text-dark-text-secondary text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-dark-text-primary"
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-dark-text-secondary text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-dark-text-primary"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors"
                >
                  Join Waitlist & Download
                </button>
              </form>
              
              <div className="mt-4 text-xs text-dark-text-secondary">
                By signing up, you agree to our Privacy Policy and Terms of Service.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowSignupModal;