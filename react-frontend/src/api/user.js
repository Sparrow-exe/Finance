// src/api/user.js
import axios from './axiosInstance';

export const fetchUserData = async () => {
  const res = await axios.get('/user/me');
  return res.data;
};

export const updateUserSettings = async (newSettings) => {
  const res = await axios.put('/user/settings', newSettings);
  return res.data; // returns the updated settings object
};
