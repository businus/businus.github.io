import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/WorkflowAI/contexts/ThemeContext';
import PremiumLandingPage from './components/PremiuimStuff/layout/PremiumLandingPage.jsx';
import WorkflowAI from './components/WorkflowAI/WorkflowAI';
import './App.css';

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PremiumLandingPage />} />           
            <Route path="/workflow-ai" element={<WorkflowAI />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;