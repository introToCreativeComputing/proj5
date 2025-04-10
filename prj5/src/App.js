import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage';
import OnboardingPage from './pages/OnBoarding/OnBoarding';
import RippleSketch from './components/RippleSketch';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/Mainpage" element={<MainPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
