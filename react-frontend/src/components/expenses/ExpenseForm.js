import React, { useState, useEffect } from 'react';

function ExpenseForm({ initialData = {}, onSubmit, onCancel, mode = 'create' }) {
  const [form, setForm] = useState({
    category: '',
    description: '',
    budgeted: '',
    actual: '',
    date: '',
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm({
        category: initialData.category || '',
        description: initialData.description || '',
        budgeted: initialData.budgeted ?? '',
        actual: initialData.actual ?? '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ['budgeted', 'actual'].includes(name)
        ? value === '' ? '' : parseFloat(value)
        : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...initialData,
      ...form,
      date: new Date(form.date),
    };
    onSubmit(payload);

    if (mode === 'create') {
      setForm({
        category: '',
        description: '',
        budgeted: '',
        actual: '',
        date: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-2">
      <div>
        <label className="text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="e.g. Rent, Food, Utilities"
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Short explanation of the expense"
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-sm font-medium text-gray-700">Budgeted Amount</label>
          <input
            type="number"
            name="budgeted"
            value={form.budgeted}
            onChange={handleChange}
            placeholder="Planned amount"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Actual Amount</label>
          <input
            type="number"
            name="actual"
            value={form.actual}
            onChange={handleChange}
            placeholder="What was actually spent"
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-2">
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

export default ExpenseForm;
