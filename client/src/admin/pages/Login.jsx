import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Code } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import api from '../../services/api.js';
import { useAuth } from '../../hooks/useAuth.js';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Send credentials to Express backend
      const response = await api.post('/auth/login', formData);
      const token = response.data.token;
      
      // 2. Store token and update global state
      login(token); 
      
      // 3. Redirect to the admin dashboard
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 border border-pcb-green/20">
        
        <div className="text-center mb-8">
          <Code className="w-10 h-10 mx-auto text-pcb-green" />
          <h1 className="text-3xl font-extrabold mt-3 text-gray-900 dark:text-gray-100">
            Admin Login
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Access the content management system</p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg mb-4 text-red-700 dark:text-red-300 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                         focus:ring-pcb-green focus:border-pcb-green outline-none"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                         focus:ring-pcb-green focus:border-pcb-green outline-none"
            />
          </div>
          
          <Button type="submit" isLoading={loading} className="w-full">
            <LogIn className="w-5 h-5 mr-2" />
            Sign In
          </Button>
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
    No account yet? 
    <Link to="/admin/register" className="text-pcb-green hover:underline ml-1">
        Create Admin Account
    </Link>
    </p>
        </form>
      </div>
    </div>
  );
};

export default Login;