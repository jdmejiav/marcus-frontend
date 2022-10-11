
import './App.css';
import React from 'react';
import StockItems from './pages/StockItems';
import { Routes, Route } from "react-router-dom";
import PlaneacionPage from './pages/PlaneacionPage';


function App() {
  return (
    <Routes>
      <Route path="/" element={<PlaneacionPage />} />

      <Route path="/products" element={<StockItems />} />
    </Routes>



  );
}

export default App;
