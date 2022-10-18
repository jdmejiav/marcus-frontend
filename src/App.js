
import './App.css';
import React from 'react';
import StockItems from './pages/StockItems';
import { Routes, Route } from "react-router-dom";
import PlaneacionPage from './pages/PlaneacionPage';
import PlaneacionAlternator from './pages/PlaneacionAlternator';

function App() {
  return (
    <Routes>
      <Route path="/alternator" element={<PlaneacionPage />} />
      <Route path="/" element={<PlaneacionAlternator />} />
      <Route path="/products" element={<StockItems />} />
    </Routes>



  );
}

export default App;
