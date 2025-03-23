import React, { useState } from 'react';

function DebtEntry({ entry, onEdit, onDelete }) {
  const {
    debtName,
    balance,
    apr,
    monthlyPayment,
    minimumPayment,
    type,
    dueDate,
    status,
    date,
    dateUpdated,
  } = entry;

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const formatCurrency = (value) =>
    value != null ? `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '—';

  const formatPercent = (value) =>
    value != null ? `${parseFloat(value).toFixed(2)}%` : '—';

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString() : '—';

  return (
    <div className="bg-white p-4 rounded shadow space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{debtName || 'Unnamed Debt'}</h3>
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
        <p><strong>Type:</strong> {type || '—'}</p>
        <p><strong>Status:</strong> {status || '—'}</p>
        <p><strong>Balance:</strong> {formatCurrency(balance)}</p>
        <p><strong>APR:</strong> {formatPercent(apr)}</p>
        <p><strong>Monthly Payment:</strong> {formatCurrency(monthlyPayment)}</p>
        <p><strong>Minimum Payment:</strong> {formatCurrency(minimumPayment)}</p>
        <p><strong>Due Date (monthly):</strong> {dueDate ? `Day ${dueDate}` : '—'}</p>
        <p><strong>Created:</strong> {formatDate(date)}</p>
        <p><strong>Updated:</strong> {formatDate(dateUpdated)}</p>
      </div>
    </div>
  );
}

export default DebtEntry;
