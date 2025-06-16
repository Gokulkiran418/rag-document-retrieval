// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // Blue for buttons
        secondary: '#6B7280', // Gray for text
        error: '#DC2626', // Red for errors
        success: '#10B981', // Green for success
      },
    },
  },
  plugins: [],
};