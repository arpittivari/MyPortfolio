// client/src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', 
  timeout: 10000, // Increased timeout
  headers: {'Content-Type': 'application/json'},
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