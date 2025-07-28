import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import PremiumLandingPage from './components/PremiumLandingPage';
import PremiumLandingPage from './components/PremiuimStuff/layout/PremiumLandingPage.jsx';
import LandingPage from './components/LandingPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PremiumLandingPage />} />
          <Route path="/simple" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;