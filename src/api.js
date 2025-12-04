import axios from 'axios';

// ✅ UPDATED: Pointing to your live Render Backend
const API_URL = 'https://sameera-broker-backend.onrender.com';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API_URL;
