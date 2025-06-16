/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
        secondary: '#6B7280',
        accent: '#F472B6',
        'bg-light': '#F9FAFB',
        'bg-dark': '#0F172A', // Darker background
        success: '#10B981',
        error: '#DC2626',
        'text-light': '#111827',
        'text-dark': '#E5E7EB', // Lighter text for dark mode contrast
      },
    },
  },
  plugins: [],
};