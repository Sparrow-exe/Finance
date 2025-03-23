// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import DashboardPage from './pages/DashboardPage';
import IncomeCalculatorPage from './pages/IncomeCalculatorPage';
import ExpensesPage from './pages/ExpensesPage';
import DebtPage from './pages/DebtPage';
import SavingsPage from './pages/SavingsPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/income" element={<IncomeCalculatorPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/debt" element={<DebtPage />} />
          <Route path="/savings" element={<SavingsPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
