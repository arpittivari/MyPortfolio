import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api'; // Assuming you have api service

// 1. Create the Context object
const AuthContext = createContext({
  token: null,
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

// 2. The Provider component
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    user: null,
    isLoading: true,
  });

  const login = (token) => {
  // Save to localStorage FIRST
  localStorage.setItem('token', token); 
  // Then update state
  setAuth(prev => ({ 
    ...prev, 
    token, 
    isAuthenticated: true,
    isLoading: false 
  }));
};
  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ token: null, isAuthenticated: false, user: null, isLoading: false });
  };
  
  // Effect to load user data and validate token on startup
  useEffect(() => {
    const validateToken = async () => {
      if (auth.token) {
        try {
          // This endpoint will be used to verify the token and return user data
          const response = await api.get('/auth/me'); 
          setAuth(prev => ({ 
            ...prev, 
            user: response.data.user, 
            isAuthenticated: true, 
            isLoading: false 
          }));
        } catch (error) {
          console.error("Token validation failed:", error);
          logout(); // Log out if token is invalid or expired
        }
      } else {
        setAuth(prev => ({ ...prev, isLoading: false }));
      }
    };
    validateToken();
  }, [auth.token]);


  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {auth.isLoading ? (
        // Render a simple loading screen while checking token
        <div className="flex items-center justify-center min-h-screen">Loading Authentication...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// 3. Export both the context and the provider using a single named export
export { AuthContext, AuthProvider };