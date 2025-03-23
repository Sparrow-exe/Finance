import { apiGet, apiPost, apiPut, apiDelete } from './api';

// Get all income data
export const getIncomeData = () => apiGet('/income');

// Create a new income entry
export const createIncomeEntry = (data) => apiPost('/income', data);

// Update an existing income entry
export const updateIncome = (id, data) => apiPut(`/income/${id}`, data);

// Delete an income entry
export const deleteIncome = (id) => apiDelete(`/income/${id}`);
