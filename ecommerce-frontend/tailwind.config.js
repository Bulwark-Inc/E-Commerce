/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          500: '#FFD700', // Rich Gold
        },
        purple: {
          700: '#6B21A8', // Deep purple
          800: '#4C1D95',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}