import React, { useState } from 'react';
import { AIGenerateIcon } from './icons';
import LogoComponent from '../../shared/LogoComponent';

export const Header = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt);
    }
  };

  return (
    <header className="flex-shrink-0 bg-dark-surface border-b border-dark-border px-4 py-2 flex items-center justify-between shadow-md z-30">
      <div className="flex items-center gap-3">
        <LogoComponent size="sm" includeAudio={false} />
        <h1 className="text-lg font-bold text-dark-text-primary tracking-tight hidden sm:block">
          Busin.us <span className="text-brand-secondary">Workflow AI</span>
        </h1>
        <h1 className="text-lg font-bold text-dark-text-primary tracking-tight sm:hidden">
          <span className="text-brand-secondary">W</span>AI
        </h1>
      </div>
      
      {/* Mobile prompt input - shown on small screens */}
      <div className="sm:hidden flex-grow mx-2">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your workflow..."
            className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 pl-4 pr-12 text-dark-text-primary placeholder-dark-text-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none transition text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-dark-text-secondary hover:bg-brand-primary hover:text-white disabled:hover:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <AIGenerateIcon className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
      
      {/* Desktop prompt input - hidden on small screens */}
      <div className="hidden sm:flex-grow sm:max-w-2xl sm:mx-8">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your workflow... e.g., 'Onboard a new client and send a contract'"
            className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 pl-4 pr-12 text-dark-text-primary placeholder-dark-text-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-dark-text-secondary hover:bg-brand-primary hover:text-white disabled:hover:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <AIGenerateIcon className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
      
      <div className="w-10 text-right sm:w-40">
        {/* Placeholder for user profile or other actions */}
      </div>
    </header>
  );
};