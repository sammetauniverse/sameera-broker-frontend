import axios from 'axios';

const API_URL = 'https://sameera-broker-backend.onrender.com'; // <--- MAKE SURE THIS IS CORRECT

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API_URL;
