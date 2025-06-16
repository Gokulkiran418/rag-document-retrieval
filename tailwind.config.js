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
        primary: '#1D4ED8',
        secondary: '#6B7280',
        error: '#DC2626', // Red for dark mode buttons
        'error-dark': '#B91C1C', // Darker red for hover
        success: '#10B981',
        dark: '#111827', // Dark gray for text in light mode
        black: '#000000', // Pure black for inputs in dark mode
      },
    },
  },
  plugins: [],
};