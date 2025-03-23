import React, { useState, useEffect } from 'react';

function IncomeForm({ initialData = {}, onSubmit, onCancel, mode = 'create' }) {
  const [form, setForm] = useState({
    source: '',
    notes: '',
    frequency: 'one-time',
    category: '',
    payType: 'salary',
    hourlyRate: '',
    hoursPerWeek: '',
    annualSalary: '',
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm({
        source: initialData.source || '',
        notes: initialData.notes || '',
        frequency: initialData.frequency || 'one-time',
        category: initialData.category || '',
        payType: initialData.payType || 'salary',
        hourlyRate: initialData.hourlyRate ?? '',
        hoursPerWeek: initialData.hoursPerWeek ?? '',
        annualSalary: initialData.annualSalary ?? '',
      });
    }
  }, [initialData]);

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

    const cleaned = { ...form };

    if (form.payType === 'hourly') {
      cleaned.annualSalary = null;
    } else if (form.payType === 'salary') {
      cleaned.hourlyRate = null;
      cleaned.hoursPerWeek = null;
    }

    const payload = initialData._id ? { ...initialData, ...cleaned } : cleaned;
    onSubmit(payload);

    if (mode === 'create') {
      setForm({
        source: '',
        notes: '',
        frequency: 'one-time',
        category: '',
        payType: 'salary',
        hourlyRate: '',
        hoursPerWeek: '',
        annualSalary: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4 max-w-xl">
      <div>
        <label className="text-sm font-medium text-gray-700">Source</label>
        <input
          type="text"
          name="source"
          value={form.source}
          onChange={handleChange}
          placeholder="e.g. Paycheck, Freelance"
          className="w-80 border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Optional notes or details"
          className="w-80 border p-2 rounded"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Frequency</label>
        <select
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          className="w-80 border p-2 rounded"
        >
          <option value="one-time">One-time</option>
          <option value="recurring">Recurring</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="e.g. Work, Bonus, Side Hustle"
          className="w-80 border p-2 rounded"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Pay Type</label>
        <select
          name="payType"
          value={form.payType}
          onChange={handleChange}
          className="w-80 border p-2 rounded"
        >
          <option value="salary">Salary</option>
          <option value="hourly">Hourly</option>
        </select>
      </div>

      {form.payType === 'hourly' && (
        <>
          <div>
            <label className="text-sm font-medium text-gray-700">Hourly Rate</label>
            <input
              type="number"
              name="hourlyRate"
              value={form.hourlyRate}
              onChange={handleChange}
              placeholder="e.g. 20"
              className="w-80 border p-2 rounded"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Hours per Week</label>
            <input
              type="number"
              name="hoursPerWeek"
              value={form.hoursPerWeek}
              onChange={handleChange}
              placeholder="e.g. 40"
              className="w-80 border p-2 rounded"
            />
          </div>
        </>
      )}

      {form.payType === 'salary' && (
        <div>
          <label className="text-sm font-medium text-gray-700">Annual Salary</label>
          <input
            type="number"
            name="annualSalary"
            value={form.annualSalary}
            onChange={handleChange}
            placeholder="e.g. 50000"
            className="w-80 border p-2 rounded"
          />
        </div>
      )}

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

export default IncomeForm;
