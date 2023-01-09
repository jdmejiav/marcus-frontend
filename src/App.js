
import './App.css';
import React from 'react';
import StockItems from './pages/StockItems';
import { Routes, Route } from "react-router-dom";
import PlaneacionAlternator from './pages/PlaneacionAlternator';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import RecipesPage from './pages/RecipesPage';
import AdminUsersPage from './pages/AdminUsersPage';
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/" element={<PlaneacionAlternator />} />
      <Route path="/recipes" element={<RecipesPage />} />
      <Route path="/products" element={<StockItems />} />
      <Route path="/AdminUsersPage" element={<AdminUsersPage />} />
    </Routes>
  );
}

export default App;
