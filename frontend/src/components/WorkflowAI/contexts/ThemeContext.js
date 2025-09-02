import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const themes = {
  businus: {
    name: 'Busin.US',
    colors: {
      'brand-primary': '#4f46e5',
      'brand-secondary': '#7c3aed',
      'dark-bg': '#111827',
      'dark-surface': '#1f2937',
      'dark-border': '#374151',
      'dark-text-primary': '#f9fafb',
      'dark-text-secondary': '#9ca3af',
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      'brand-primary': '#3b82f6',
      'brand-secondary': '#8b5cf6',
      'dark-bg': '#0f172a',
      'dark-surface': '#1e293b',
      'dark-border': '#334155',
      'dark-text-primary': '#f1f5f9',
      'dark-text-secondary': '#94a3b8',
    }
  },
  light: {
    name: 'Light',
    colors: {
      'brand-primary': '#3b82f6',
      'brand-secondary': '#8b5cf6',
      'dark-bg': '#f8fafc',
      'dark-surface': '#f1f5f9',
      'dark-border': '#cbd5e1',
      'dark-text-primary': '#0f172a',
      'dark-text-secondary': '#64748b',
    }
  },
  neoBrutalism: {
    name: 'Neo Brutalism',
    colors: {
      'brand-primary': '#ff6b6b',
      'brand-secondary': '#4ecdc4',
      'dark-bg': '#ffd166',
      'dark-surface': '#06d6a0',
      'dark-border': '#118ab2',
      'dark-text-primary': '#073b4c',
      'dark-text-secondary': '#118ab2',
    }
  },
  blackAndWhite: {
    name: 'Black & White',
    colors: {
      'brand-primary': '#000000',
      'brand-secondary': '#000000',
      'dark-bg': '#ffffff',
      'dark-surface': '#ffffff',
      'dark-border': '#000000',
      'dark-text-primary': '#000000',
      'dark-text-secondary': '#000000',
    }
  },
  businGreen: {
    name: 'Busin.US Green',
    colors: {
      'brand-primary': '#14b8a6',
      'brand-secondary': '#34d399',
      'dark-bg': '#0f172a',
      'dark-surface': '#1e293b',
      'dark-border': '#334155',
      'dark-text-primary': '#f1f5f9',
      'dark-text-secondary': '#94a3b8',
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('businus');

  useEffect(() => {
    const savedTheme = localStorage.getItem('workflow-theme') || 'businus';
    setCurrentTheme(savedTheme);
  }, []);

  const setTheme = (themeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem('workflow-theme', themeName);
    
    // Update CSS variables
    const theme = themes[themeName];
    if (theme) {
      Object.entries(theme.colors).forEach(([name, value]) => {
        document.documentElement.style.setProperty(`--${name}`, value);
      });
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};