// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow p-4">
      <div className="container mx-auto flex space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
        <Link to="/income" className="text-gray-700 hover:text-blue-600">Income</Link>
        <Link to="/expenses" className="text-gray-700 hover:text-blue-600">Expenses</Link>
        <Link to="/debt" className="text-gray-700 hover:text-blue-600">Debt</Link>
        <Link to="/savings" className="text-gray-700 hover:text-blue-600">Savings</Link>
      </div>
    </nav>
  );
}

export default Navbar;
