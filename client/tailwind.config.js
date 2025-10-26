// client/tailwind.config.js - DEFINITIVE FIX (CommonJS Syntax)

// 1. We must import the default theme utility using 'require' for consistency
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = { // CRITICAL: Switched to module.exports
  // CRITICAL: Content must be correct for scanning files
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // CRITICAL: Uses the 'dark' class applied by ThemeContext
  darkMode: 'class', 
  theme: {
    extend: {
      fontFamily: {
        // Uses the correctly imported defaultTheme for fallback
        sans: ['Inter', ...defaultTheme.fontFamily.sans], 
      },
      colors: {
        // MODERN PCB AESTHETIC COLORS (Finalized)
        'pcb-green': {
          light: '#28a745', // Lighter, vibrant green
          DEFAULT: '#006400', // Classic, deep PCB green
          dark: '#004d00', // Darker shade
        },
        'terminal-bg': '#0D1117',
        'terminal-text': '#C9D1D9',
        'terminal-header': '#161B22',
      },
    },
  },
  // CRITICAL: Plugins MUST use require()
  plugins: [
    require('@tailwindcss/typography'),
  ],
};