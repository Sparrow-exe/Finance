import React, { useState } from 'react';
import IncomeForm from '../components/income/IncomeForm';
import IncomeList from '../components/income/IncomeList';

const IncomePage = () => {
  const [reloadFlag, setReloadFlag] = useState(false);
  const [editIncome, setEditIncome] = useState(null);

  const triggerReload = () => setReloadFlag(prev => !prev);
  const startEdit = (income) => setEditIncome(income);
  const stopEdit = () => setEditIncome(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Income Management</h1>
      <IncomeForm reloadIncome={triggerReload} editIncome={editIncome} stopEdit={stopEdit} />
      <h2 className="text-2xl font-semibold my-4">All Income Entries</h2>
      <IncomeList reloadFlag={reloadFlag} startEdit={startEdit} />
    </div>
  );
};

export default IncomePage;
