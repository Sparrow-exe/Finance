import React, { useState, useEffect } from 'react';
import { createIncomeEntry, updateIncome } from '../../api/income';

const IncomeForm = ({ reloadIncome, editIncome, stopEdit }) => {
  const initialForm = {
    source: '', notes: '', frequency: '', category: '',
    payType: 'salary', annualSalary: '', hourlyRate: '', hoursPerWeek: 40
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (editIncome) {
      setForm({
        source: editIncome.source,
        notes: editIncome.notes || '',
        frequency: editIncome.frequency || '',
        category: editIncome.category || '',
        payType: editIncome.payType,
        annualSalary: editIncome.annualSalary || '',
        hourlyRate: editIncome.hourlyRate || '',
        hoursPerWeek: editIncome.hoursPerWeek || 40
      });
    } else {
      setForm(initialForm);
    }
  }, [editIncome]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      annualSalary: form.payType === 'salary' ? parseFloat(form.annualSalary) : null,
      hourlyRate: form.payType === 'hourly' ? parseFloat(form.hourlyRate) : null,
      hoursPerWeek: form.payType === 'hourly' ? parseFloat(form.hoursPerWeek) : null,
    };

    if (editIncome) {
      await updateIncome(editIncome._id, data);
      stopEdit();
    } else {
      await createIncomeEntry(data);
    }

    setForm(initialForm);
    reloadIncome();
  };

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow" onSubmit={handleSubmit}>
      <input name="source" value={form.source} onChange={handleChange} placeholder="Source" required className="p-2 border rounded"/>
      <input name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="p-2 border rounded"/>
      <input name="frequency" value={form.frequency} onChange={handleChange} placeholder="Frequency" className="p-2 border rounded"/>
      <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="p-2 border rounded"/>

      <select name="payType" value={form.payType} onChange={handleChange} className="p-2 border rounded">
        <option value="salary">Salary</option>
        <option value="hourly">Hourly</option>
      </select>

      {form.payType === 'salary' ? (
        <input name="annualSalary" value={form.annualSalary} onChange={handleChange} type="number" placeholder="Annual Salary ($)" className="p-2 border rounded"/>
      ) : (
        <>
          <input name="hourlyRate" value={form.hourlyRate} onChange={handleChange} type="number" placeholder="Hourly Rate ($)" className="p-2 border rounded"/>
          <input name="hoursPerWeek" value={form.hoursPerWeek} onChange={handleChange} type="number" placeholder="Hours Per Week" className="p-2 border rounded"/>
        </>
      )}

      <button type="submit" className={`col-span-full ${editIncome ? 'bg-green-500' : 'bg-blue-500'} text-white p-2 rounded`}>
        {editIncome ? 'Save Changes' : 'Add Income'}
      </button>

      {editIncome && (
        <button type="button" className="col-span-full bg-gray-500 text-white p-2 rounded" onClick={stopEdit}>
          Cancel Edit
        </button>
      )}
    </form>
  );
};

export default IncomeForm;
