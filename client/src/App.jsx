import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Home from './pages/Home.jsx';
import Projects from './pages/Projects.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import About from './pages/About.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';
import NotFound from './pages/NotFound.jsx';
// NEW: import AdminSignup from './admin/pages/AdminSignup.jsx';
// Admin Imports
import AdminLayout from './admin/components/AdminLayout.jsx';
import ProtectedRoute from './admin/utils/ProtectedRoute.jsx';
import Login from './admin/pages/Login.jsx';
// Import Admin Management Pages (to be created later)
import Dashboard from './admin/pages/Dashboard.jsx';
import ManageProjects from './admin/pages/ManageProjects.jsx';
import ManageSkills from './admin/pages/ManageSkills.jsx';
import ManageBlog from './admin/pages/ManageBlog.jsx';
import Analytics from './admin/pages/Analytics.jsx';
import Contact from './pages/Contact.jsx';

function App() {
  return (
    <Routes>
      {/* =====================================================
        1. PUBLIC ROUTES (Wrapped by Navbar and Footer)
        =====================================================
      */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} /> 
        
        {/* Fallback for unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* =====================================================
        2. ADMIN ROUTES 
        =====================================================
      */}
      {/* Login route is outside the protected area */}
      //<Route path="/admin/login" element={<Login />} />
      {/* Protected routes are wrapped by the ProtectedRoute and AdminLayout */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="skills" element={<ManageSkills />} />
          <Route path="blog" element={<ManageBlog />} />
          <Route path="analytics" element={<Analytics />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>

    </Routes>
  );
}

export default App;