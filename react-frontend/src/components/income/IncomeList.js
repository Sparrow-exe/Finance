import React, { useEffect, useState } from 'react';
import { getIncomeData, deleteIncome } from '../../api/income';
import IncomeItem from './IncomeItem';

const IncomeList = ({ reloadFlag, startEdit }) => { // <-- ADD startEdit HERE
  const [incomes, setIncomes] = useState([]);

  const loadIncome = async () => {
    const data = await getIncomeData();
    setIncomes(data);
  };

  useEffect(() => {
    loadIncome();
  }, [reloadFlag]);

  const handleDelete = async (id) => {
    await deleteIncome(id);
    loadIncome();
  };

  const handleEdit = (income) => {
    startEdit(income);
  };

  return (
    <ul>
      {incomes.map(income => (
        <IncomeItem 
          key={income._id} 
          income={income} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      ))}
    </ul>
  );
};

export default IncomeList;
