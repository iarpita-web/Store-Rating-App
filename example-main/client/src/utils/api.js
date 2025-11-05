import axios from "axios";

// Always include /api since your backend mounts routes under /api
const baseURL =
  import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "http://localhost:3000/api";

export const api = axios.create({
  baseURL,
  withCredentials: true, // optional, if you plan to use cookies/sessions
});

// Optional: a clean response interceptor for better error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg =
      error?.response?.data?.error ||
      error?.message ||
      "Network or server error";
    return Promise.reject(new Error(msg));
  }
);
