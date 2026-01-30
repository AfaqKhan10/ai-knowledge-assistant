import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',  // yeh backend ka address hai (uvicorn wala)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Har request ke saath token automatically add karne ka code
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;