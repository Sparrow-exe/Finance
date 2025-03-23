import React, { useEffect, useState } from 'react';

function DebtForm({ initialData = {}, onSubmit, onCancel, mode = 'create' }) {
  const [form, setForm] = useState({
    debtName: '',
    balance: '',
    apr: '',
    monthlyPayment: '',
    minimumPayment: '',
    type: '',
    dueDate: '',
    status: '',
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm({
        debtName: initialData.debtName || '',
        balance: initialData.balance ?? '',
        apr: initialData.apr ?? '',
        monthlyPayment: initialData.monthlyPayment ?? '',
        minimumPayment: initialData.minimumPayment ?? '',
        type: initialData.type || '',
        dueDate: initialData.dueDate ?? '',
        status: initialData.status || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: ['balance', 'apr', 'monthlyPayment', 'minimumPayment', 'dueDate'].includes(name)
        ? value === '' ? '' : parseFloat(value)
        : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = initialData._id
      ? { ...initialData, ...form }
      : form;

    onSubmit(payload);

    if (mode === 'create') {
      setForm({
        debtName: '',
        balance: '',
        apr: '',
        monthlyPayment: '',
        minimumPayment: '',
        type: '',
        dueDate: '',
        status: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-2">
      <label className="block text-sm font-medium">Debt Name</label>
      <input
        type="text"
        name="debtName"
        value={form.debtName}
        onChange={handleChange}
        placeholder="e.g. Credit Card, Auto Loan"
        className="w-full border p-2 rounded"
        required
      />

      <label className="block text-sm font-medium">Balance</label>
      <input
        type="number"
        name="balance"
        value={form.balance}
        onChange={handleChange}
        placeholder="Current balance"
        className="w-full border p-2 rounded"
      />

      <label className="block text-sm font-medium">APR (%)</label>
      <input
        type="number"
        name="apr"
        step="0.01"
        value={form.apr}
        onChange={handleChange}
        placeholder="Annual Percentage Rate"
        className="w-full border p-2 rounded"
      />

      <label className="block text-sm font-medium">Monthly Payment</label>
      <input
        type="number"
        name="monthlyPayment"
        step="0.01"
        value={form.monthlyPayment}
        onChange={handleChange}
        placeholder="Total payment per month"
        className="w-full border p-2 rounded"
      />

      <label className="block text-sm font-medium">Minimum Payment</label>
      <input
        type="number"
        name="minimumPayment"
        step="0.01"
        value={form.minimumPayment}
        onChange={handleChange}
        placeholder="Minimum payment due"
        className="w-full border p-2 rounded"
      />

      <label className="block text-sm font-medium">Type</label>
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="">Select type</option>
        <option value="credit">Credit</option>
        <option value="loan">Loan</option>
        <option value="mortgage">Mortgage</option>
        <option value="auto">Auto</option>
        <option value="other">Other</option>
      </select>

      <label className="block text-sm font-medium">Due Date (Day of Month)</label>
      <input
        type="number"
        name="dueDate"
        value={form.dueDate}
        onChange={handleChange}
        placeholder="e.g. 15"
        className="w-full border p-2 rounded"
        min={1}
        max={31}
      />

      <label className="block text-sm font-medium">Status</label>
      <input
        type="text"
        name="status"
        value={form.status}
        onChange={handleChange}
        placeholder="Optional (e.g. Active, Deferred)"
        className="w-full border p-2 rounded"
      />

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:underline"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={`${mode === 'edit' ? 'bg-green-500' : 'bg-blue-600'} text-white px-4 py-2 rounded`}
        >
          {mode === 'edit' ? 'Save' : 'Add'}
        </button>
      </div>
    </form>
  );
}

export default DebtForm;
