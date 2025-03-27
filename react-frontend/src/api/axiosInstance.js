// src/api/axiosInstance.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

API.interceptors.request.use((config) => {
  let accessToken = localStorage.getItem('token');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    let accessToken = localStorage.getItem('token');
    if (
      error.response?.status === 401 &&
      error.response.data?.message === 'Token expired' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.get('http://localhost:3000/api/auth/refresh', {
          withCredentials: true,
        });
        accessToken = res.data.accessToken;
        localStorage.setItem('token', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return API(originalRequest);
      } catch (refreshErr) {
        // Let the calling component decide what to do
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default API;
