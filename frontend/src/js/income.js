import { apiGet, apiPost, apiPut, apiDelete } from './api';

export const getIncome = () => apiGet('/income');
export const createIncome = (income) => apiPost('/income', income);
export const updateIncome = (id, income) => apiPut(`/income/${id}`, income);
export const deleteIncome = (id) => apiDelete(`/income/${id}`);
