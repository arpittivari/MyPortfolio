import axios from 'axios';

// Define the API URL using the Vite environment variable
// Fallback to localhost:5001/api if the VITE_ variable isn't set (for local dev)
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'; 

// Log the URL being used - helpful for debugging deployment issues
console.log("Using API Base URL:", API_URL); 

// Create the Axios instance
const api = axios.create({
  baseURL: API_URL, // Use the defined variable here
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});
// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    // Read token FRESHLY from localStorage on EVERY request
    const token = localStorage.getItem('token'); 
    console.log("Axios Interceptor: Attaching token:", token); // DEBUG LOG
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    } else {
        console.log("Axios Interceptor: No token found in localStorage."); // DEBUG LOG
    }
    return config;
  },
  (error) => {
      console.error("Axios Request Interceptor Error:", error); // DEBUG LOG
      return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR (Handles global 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios Response Interceptor Error:", error.response?.status, error.message); // DEBUG LOG
    if (error.response && error.response.status === 401) {
      console.log("Axios Interceptor: Received 401, logging out."); // DEBUG LOG
      // Don't call logout() directly here to avoid potential loops
      localStorage.removeItem('token');
      // Force a reload to login page
      window.location.href = '/admin/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;