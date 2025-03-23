import { apiGet, apiPost, apiPut, apiDelete } from './api';

export const getDebtData = () => apiGet('/debt');
export const createDebtEntry = (data) => apiPost('/debt', data);
export const updateDebtEntry = (id, data) => apiPut(`/debt/${id}`, data);
export const deleteDebtEntry = (id) => apiDelete(`/debt/${id}`);
