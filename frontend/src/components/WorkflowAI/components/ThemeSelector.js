import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSelector = () => {
  const { currentTheme, setTheme, themes } = useTheme();

  return (
    <div className="absolute top-4 right-4 z-50">
      <div className="relative group">
        <button className="p-2 rounded-lg bg-dark-surface border border-dark-border text-dark-text-primary hover:bg-dark-bg transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="absolute right-0 mt-2 w-48 bg-dark-surface border border-dark-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
          <div className="p-2">
            <h3 className="text-xs font-semibold text-dark-text-secondary uppercase tracking-wider mb-2 px-2">Themes</h3>
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left transition-colors ${
                  currentTheme === key 
                    ? 'bg-brand-primary/20 text-brand-primary' 
                    : 'text-dark-text-primary hover:bg-dark-bg'
                }`}
              >
                <span className="flex-shrink-0 w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors['brand-primary'] }}></span>
                {theme.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;