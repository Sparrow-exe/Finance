import React from 'react';

const IncomeItem = ({ income, onEdit, onDelete }) => {
  return (
    <li className="flex justify-between items-center p-3 bg-gray-50 my-2 rounded shadow">
      <span>
        <strong>{income.source}</strong>
        {income.notes && ` - ${income.notes}`}
        {income.frequency && ` - ${income.frequency}`}
        {income.category && ` - ${income.category}`}
        {income.payType === 'salary' && income.annualSalary && ` - Salary: $${income.annualSalary}`}
        {income.payType === 'hourly' && income.hourlyRate && ` - Hourly: $${income.hourlyRate}/hr (${income.hoursPerWeek} hrs/week)`}
      </span>
      <div>
        <button className="bg-yellow-400 text-white px-3 py-1 rounded mr-2" onClick={() => onEdit(income)}>Edit</button>
        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => onDelete(income._id)}>Delete</button>
      </div>
    </li>
  );
};

export default IncomeItem;
