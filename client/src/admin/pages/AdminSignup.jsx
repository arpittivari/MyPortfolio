import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Code, AlertTriangle, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import api from '../../services/api.js';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [status, setStatus] = useState(null); // 'success', 'error', 'loading'
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { auth, login } = useAuth(); // We'll use login if successful

  // Optional: Check if a user is already authenticated
  if (auth.isAuthenticated) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('Creating admin account...');

    try {
      // 1. Send registration data to Express backend
      const response = await api.post('/auth/register', formData);
      const token = response.data.token;
      
      // 2. Automatically log in the user after successful registration
      login(token); 
      
      setStatus('success');
      setMessage('Account created successfully! Redirecting...');
      
      // 3. Wait a moment then redirect
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true });
      }, 1500);

    } catch (err) {
      console.error("Registration failed:", err);
      setStatus('error');
      setMessage(err.response?.data?.message || 'Registration failed. User may already exist.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 border border-pcb-green/20">
        
        <div className="text-center mb-8">
          <Code className="w-10 h-10 mx-auto text-pcb-green" />
          <h1 className="text-3xl font-extrabold mt-3 text-gray-900 dark:text-gray-100">
            Admin Registration
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Create the primary content administrator account</p>
        </div>

        {/* Status Message Display */}
        {status && message && (
            <div className={`p-3 rounded-lg mb-4 font-medium flex items-center ${
                status === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 
                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
            }`}>
                {status === 'error' ? <AlertTriangle className="w-5 h-5 mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                {message}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="admin-label">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="admin-input"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="admin-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="admin-input"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="admin-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="admin-input"
            />
          </div>
          
          <Button type="submit" isLoading={status === 'loading'} className="w-full">
            <UserPlus className="w-5 h-5 mr-2" />
            Register Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account? 
            <Link to="/admin/login" className="text-pcb-green hover:underline ml-1">
                Log In
            </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;