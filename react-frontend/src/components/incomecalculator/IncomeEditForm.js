import React, { useState } from 'react';

function IncomeEditForm({ entry, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    source: entry.source || '',
    notes: entry.notes || '',
    frequency: entry.frequency || 'one-time',
    category: entry.category || '',
    payType: entry.payType || 'salary',
    hourlyRate: entry.hourlyRate ?? '',
    hoursPerWeek: entry.hoursPerWeek ?? '',
    annualSalary: entry.annualSalary ?? '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ['hourlyRate', 'hoursPerWeek', 'annualSalary'].includes(name)
        ? value === '' ? '' : parseFloat(value)
        : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedEntry = {
      ...entry,
      ...form,
    };

    if (form.payType === 'hourly') {
      updatedEntry.annualSalary = null;
    } else if (form.payType === 'salary') {
      updatedEntry.hourlyRate = null;
      updatedEntry.hoursPerWeek = null;
    }

    onSubmit(updatedEntry);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-2">
      <input
        type="text"
        name="source"
        value={form.source}
        onChange={handleChange}
        placeholder="Source"
        className="w-full border p-2 rounded"
        required
      />

      <textarea
        name="notes"
        value={form.notes}
        onChange={handleChange}
        placeholder="Notes"
        className="w-full border p-2 rounded"
      />

      <select
        name="frequency"
        value={form.frequency}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="one-time">One-time</option>
        <option value="recurring">Recurring</option>
      </select>

      <input
        type="text"
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category"
        className="w-full border p-2 rounded"
      />

      <select
        name="payType"
        value={form.payType}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="salary">Salary</option>
        <option value="hourly">Hourly</option>
      </select>

      {form.payType === 'hourly' && (
        <>
          <input
            type="number"
            name="hourlyRate"
            value={form.hourlyRate}
            onChange={handleChange}
            placeholder="Hourly Rate"
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            name="hoursPerWeek"
            value={form.hoursPerWeek}
            onChange={handleChange}
            placeholder="Hours per Week"
            className="w-full border p-2 rounded"
          />
        </>
      )}

      {form.payType === 'salary' && (
        <input
          type="number"
          name="annualSalary"
          value={form.annualSalary}
          onChange={handleChange}
          placeholder="Annual Salary"
          className="w-full border p-2 rounded"
        />
      )}

      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:underline"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default IncomeEditForm;
