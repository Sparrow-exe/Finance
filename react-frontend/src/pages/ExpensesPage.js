import React, { useEffect, useState } from 'react';
import {
  getExpenseData,
  createExpenseEntry,
  updateExpenseEntry,
  deleteExpenseEntry,
} from '../api/expenses';


import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseEntry from '../components/expenses/ExpenseEntry';
import ExpenseAnalysis from '../components/expenses/ExpenseAnalysis';

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const fetchExpenses = async () => {
    const data = await getExpenseData();
    setExpenses(data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAdd = async (newEntry) => {
    await createExpenseEntry(newEntry);
    setIsAdding(false);
    fetchExpenses();
  };

  const handleEdit = async (updatedEntry) => {
    await updateExpenseEntry(updatedEntry._id, updatedEntry);
    setEditingEntry(null);
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    await deleteExpenseEntry(id);
    fetchExpenses();
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Expenses</h1>

      {/* Entries */}
      <div className="space-y-4">
        {expenses.map((entry) =>
          editingEntry && editingEntry._id === entry._id ? (
            <ExpenseForm
              key={entry._id}
              mode="edit"
              initialData={editingEntry}
              onSubmit={handleEdit}
              onCancel={() => setEditingEntry(null)}
            />
          ) : (
            <ExpenseEntry
              key={entry._id}
              entry={entry}
              onEdit={() => setEditingEntry(entry)}
              onDelete={handleDelete}
            />
          )
        )}
      </div>

      {/* Add Button or Form */}
      <div className="pt-4">
        {isAdding ? (
          <ExpenseForm
            mode="create"
            onSubmit={handleAdd}
            onCancel={() => setIsAdding(false)}
          />
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Expense Entry
          </button>
        )}
      </div>

      {/* Analysis Section */}
      <ExpenseAnalysis entries={expenses} />
    </div>
  );
}

export default ExpensesPage;
