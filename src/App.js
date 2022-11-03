
import './App.css';
import React from 'react';
import StockItems from './pages/StockItems';
import { Routes, Route } from "react-router-dom";
import PlaneacionPage from './pages/PlaneacionPage';
import PlaneacionAlternator from './pages/PlaneacionAlternator';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/alternator" element={<PlaneacionPage />} />
      <Route path="/" element={<PlaneacionAlternator />} />
      <Route path="/products" element={<StockItems />} />
    </Routes>



  );
}

export default App;
