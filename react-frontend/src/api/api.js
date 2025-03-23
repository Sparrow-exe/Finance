import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

export const apiGet = (endpoint) => axios.get(`${API_BASE}${endpoint}`).then(res => res.data);
export const apiPost = (endpoint, data) => axios.post(`${API_BASE}${endpoint}`, data).then(res => res.data);
export const apiPut = (endpoint, data) => axios.put(`${API_BASE}${endpoint}`, data).then(res => res.data);
export const apiDelete = (endpoint) => axios.delete(`${API_BASE}${endpoint}`).then(res => res.data);
