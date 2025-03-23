import React, { useState } from 'react';

function IncomeEntry({ entry, onEdit, onDelete }) {
  const {
    source,
    notes,
    frequency,
    category,
    payType,
    hourlyRate,
    hoursPerWeek,
    annualSalary,
    date,
    dateUpdated
  } = entry;

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const formatDate = (isoString) => new Date(isoString).toLocaleDateString();
  const formatCurrency = (value) =>
    value != null ? `$${Number(value).toLocaleString()}` : '—';

  return (
    <div className="bg-white p-4 rounded shadow space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{source || 'Unnamed Source'}</h3>
        <div className="flex gap-4">
          <button
            onClick={() => onEdit(entry)}
            className="text-blue-500 hover:underline"
          >
            Edit
          </button>

          {confirmingDelete ? (
            <div className="flex gap-2">
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
            </div>
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

      <div className="text-sm text-gray-700 grid grid-cols-2 gap-x-4 gap-y-1">
        <p><strong>Notes:</strong> {notes || '—'}</p>
        <p><strong>Category:</strong> {category || '—'}</p>
        <p><strong>Frequency:</strong> {frequency}</p>
        <p><strong>Pay Type:</strong> {payType}</p>

        {payType === 'hourly' && (
          <>
            <p><strong>Hourly Rate:</strong> {formatCurrency(hourlyRate)}</p>
            <p><strong>Hours/Week:</strong> {hoursPerWeek ?? '—'}</p>
          </>
        )}

        {payType === 'salary' && (
          <p><strong>Annual Salary:</strong> {formatCurrency(annualSalary)}</p>
        )}

        <p><strong>Date Created:</strong> {formatDate(date)}</p>
        <p><strong>Last Updated:</strong> {formatDate(dateUpdated)}</p>
      </div>
    </div>
  );
}

export default IncomeEntry;
