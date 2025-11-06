import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg = error?.response?.data?.error || error.message || 'Request error';
    return Promise.reject(new Error(msg));
  }
);
