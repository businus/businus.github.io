import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PremiumLandingPage from './components/PremiumLandingPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PremiumLandingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;