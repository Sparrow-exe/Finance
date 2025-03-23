import React, { useEffect, useState } from 'react';
import {
  getIncomeData,
  createIncomeEntry,
  updateIncomeEntry,
  deleteIncomeEntry
} from '../api/income';

import IncomeForm from '../components/incomecalculator/IncomeForm';
import IncomeEntry from '../components/incomecalculator/IncomeEntry';
import IncomeAnalysis from '../components/incomecalculator/IncomeAnalysis';

function IncomePage() {
  const [income, setIncome] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  // Fetch data
  const fetchIncome = async () => {
    const data = await getIncomeData();
    setIncome(data);
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  // Add entry
  const handleAdd = async (newEntry) => {
    await createIncomeEntry(newEntry);
    setIsAdding(false);
    fetchIncome();
  };

  // Edit entry
  const handleEdit = async (updatedEntry) => {
    await updateIncomeEntry(updatedEntry._id, updatedEntry);
    setEditingEntry(null);
    fetchIncome();
  };

  // Delete entry
  const handleDelete = async (id) => {
    await deleteIncomeEntry(id);
    fetchIncome();
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Income</h1>

      {/* Income Entries */}
      <div className="space-y-4">
        {income.map((entry) =>
          editingEntry && editingEntry._id === entry._id ? (
            <IncomeForm
              key={entry._id}
              mode="edit"
              initialData={editingEntry}
              onSubmit={handleEdit}
              onCancel={() => setEditingEntry(null)}
            />
          ) : (
            <IncomeEntry
              key={entry._id}
              entry={entry}
              onEdit={() => setEditingEntry(entry)}
              onDelete={handleDelete}
            />
          )
        )}
      </div>

      {/* Add Income Entry Button / Form */}
      <div className="pt-4">
        {isAdding ? (
          <IncomeForm
            mode="create"
            onSubmit={handleAdd}
            onCancel={() => setIsAdding(false)}
          />
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Income Entry
          </button>
        )}
      </div>

      {/* Income Analysis */}
      <IncomeAnalysis entries={income} />
    </div>
  );
}

export default IncomePage;
