import React, { useEffect, useState } from 'react';
import {
  getDebtData,
  createDebtEntry,
  updateDebtEntry,
  deleteDebtEntry
} from '../api/debt'; // <-- Make sure these API functions exist

import DebtForm from '../components/debt/DebtForm';
import DebtEntry from '../components/debt/DebtEntry';
import DebtAnalysis from '../components/debt/DebtAnalysis';

function DebtPage() {
  const [debts, setDebts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const fetchDebts = async () => {
    const data = await getDebtData();
    setDebts(data);
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  const handleAdd = async (newEntry) => {
    await createDebtEntry(newEntry);
    setIsAdding(false);
    fetchDebts();
  };

  const handleEdit = async (updatedEntry) => {
    await updateDebtEntry(updatedEntry._id, updatedEntry);
    setEditingEntry(null);
    fetchDebts();
  };

  const handleDelete = async (id) => {
    await deleteDebtEntry(id);
    fetchDebts();
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Debt</h1>

      {/* Debt Entries */}
      <div className="space-y-4">
        {debts.map((entry) =>
          editingEntry && editingEntry._id === entry._id ? (
            <DebtForm
              key={entry._id}
              mode="edit"
              initialData={editingEntry}
              onSubmit={handleEdit}
              onCancel={() => setEditingEntry(null)}
            />
          ) : (
            <DebtEntry
              key={entry._id}
              entry={entry}
              onEdit={() => setEditingEntry(entry)}
              onDelete={handleDelete}
            />
          )
        )}
      </div>

      {/* Add Debt Entry */}
      <div className="pt-4">
        {isAdding ? (
          <DebtForm
            mode="create"
            onSubmit={handleAdd}
            onCancel={() => setIsAdding(false)}
          />
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Debt Entry
          </button>
        )}
      </div>

      {/* Analysis Section */}
      <DebtAnalysis entries={debts} />
    </div>
  );
}

export default DebtPage;
