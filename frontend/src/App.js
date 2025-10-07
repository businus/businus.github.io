import React from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './components/WorkflowAI/contexts/ThemeContext';
import PremiumLandingPage from './components/PremiuimStuff/layout/PremiumLandingPage.jsx';
import WorkflowAI from './components/WorkflowAI/WorkflowAI';
import PitchDeck from './components/PitchDeck/PitchDeck.jsx';
import './App.css';

// Create hash router for better GitHub Pages compatibility
const router = createHashRouter([
  {
    path: "/",
    element: <PremiumLandingPage />,
  },
  {
    path: "/workflow-ai",
    element: <WorkflowAI />,
  },
  {
    path: "/pitch-deck",
    element: <PitchDeck />,
  },
]);

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}

export default App;