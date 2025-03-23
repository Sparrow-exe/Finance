import React, { useState } from 'react';

function ExpenseEntry({ entry, onEdit, onDelete }) {
  const {
    category,
    description,
    budgeted,
    actual,
    date,
    dateUpdated
  } = entry;

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const formatCurrency = (value) =>
    value != null ? `$${Number(value).toLocaleString()}` : '—';

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString() : '—';

  const overUnder = actual - budgeted;
  const overUnderText =
    overUnder > 0 ? `Over by ${formatCurrency(overUnder)}` :
    overUnder < 0 ? `Under by ${formatCurrency(Math.abs(overUnder))}` :
    'On budget';

  return (
    <div className="bg-white p-4 rounded shadow space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{category || 'Uncategorized'}</h3>
        <div className="flex gap-4">
          <button
            onClick={() => onEdit(entry)}
            className="text-blue-500 hover:underline"
          >
            Edit
          </button>

          {confirmingDelete ? (
            <>
              <button
                onClick={() => onDelete(entry._id)}
                className="text-red-600 font-semibold hover:underline"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmingDelete(false)}
                className="text-gray-500 hover:underline"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirmingDelete(true)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700">
        <p><strong>Description:</strong> {description || '—'}</p>
        <p><strong>Date:</strong> {formatDate(date)}</p>
        <p><strong>Budgeted:</strong> {formatCurrency(budgeted)}</p>
        <p><strong>Actual:</strong> {formatCurrency(actual)}</p>
        <p><strong>Status:</strong> {overUnderText}</p>
        <p><strong>Last Updated:</strong> {formatDate(dateUpdated)}</p>
      </div>
    </div>
  );
}

export default ExpenseEntry;
