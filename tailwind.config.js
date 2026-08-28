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
        emerald: {
          850: '#064e3b',
          950: '#022c22',
        },
        sage: {
          50: '#f4f7f5',
          100: '#e5ede8',
          200: '#ceddc3',
          300: '#a7c49b',
          400: '#7fa673',
          500: '#58884c',
          600: '#436d3a',
          700: '#35562e',
          800: '#2b4426',
          900: '#243921',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      fontFamily: {
        amiri: ['Amiri', 'serif'],
        cairo: ['Cairo', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
