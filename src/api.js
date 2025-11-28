// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sameera-broker-backend.onrender.com/api/',
});

// Attach JWT access token from localStorage to every request
api.interceptors.request.use((config) => {
  // KEY NAME MUST MATCH Login.jsx
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('No auth token found in localStorage');
  }

  return config;
});

export default api;
