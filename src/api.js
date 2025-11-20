import axios from 'axios';

const API_URL = 'https://sameera-broker-backend.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add JWT token to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
