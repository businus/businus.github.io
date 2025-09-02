import React from 'react';
import WorkflowApp from './WorkflowApp';
import ThemeSelector from './components/ThemeSelector';

const WorkflowAI = () => {
  return (
    <div className="flex flex-col h-screen bg-dark-bg text-dark-text-primary">
      <ThemeSelector />
      <WorkflowApp />
    </div>
  );
};

export default WorkflowAI;