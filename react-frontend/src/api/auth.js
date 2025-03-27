// src/api/auth.js
import API from './axiosInstance';

export const registerUser = async (email, password) => {
  const res = await API.post('/auth/register', { email, password });
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await API.post('/auth/login', { email, password });
  return res.data;
};
