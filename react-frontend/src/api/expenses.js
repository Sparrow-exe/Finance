// src/api/expenses.js
import { apiGet, apiPost, apiPut, apiDelete } from './api'; // <-- shared api utils

export const getExpenseData = () => apiGet('/expenses');
export const createExpenseEntry = (data) => apiPost('/expenses', data);
export const updateExpenseEntry = (id, data) => apiPut(`/expenses/${id}`, data);
export const deleteExpenseEntry = (id) => apiDelete(`/expenses/${id}`);
