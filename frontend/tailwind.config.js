/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // Include all React files
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF', // Deep blue
        secondary: '#1E3A8A', // Slightly lighter blue
        accent: '#F59E0B', // Amber
        background: '#F3F4F6', // Light gray
      },
    },
  },
  plugins: [],
};

