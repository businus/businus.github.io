import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '../components/WorkflowAI/contexts/ThemeContext';

export function Root() {
  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen bg-dark-bg text-dark-text-primary">
        <Outlet />
      </div>
    </ThemeProvider>
  );
}

export default Root;