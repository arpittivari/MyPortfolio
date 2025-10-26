import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Explicitly set the client port to 5174 to avoid conflict with the backend (5001)
    port: 5174, 
    proxy: {
      // Routes all /api requests from the frontend to the backend server
      '/api': 'http://localhost:5001', 
    },
  },
});
