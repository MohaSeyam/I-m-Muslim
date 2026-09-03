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
        coolgreen: {
          50: '#EBF9F5',
          100: '#D2F2E9',
          200: '#A6E5D4',
          300: '#72D2BA',
          400: '#3EBA9B',
          500: '#1B9E7E',
          600: '#148267',
          700: '#0F6550',
          800: '#0C4E3D',
          900: '#08372C',
          950: '#04211A',
        },
        iceblue: {
          50: '#F2F8FB',
          100: '#E2F0F7',
          200: '#C7E2EE',
          300: '#9ECFE2',
          400: '#6CB5D3',
          500: '#469BC0',
          600: '#347EA0',
          700: '#2A6480',
          800: '#265369',
          900: '#234658',
          950: '#0E2430',
        },
        burgundy: {
          50: '#FDF2F4',
          100: '#FCE7EC',
          200: '#F8D0D9',
          300: '#F1A9B9',
          400: '#E47590',
          500: '#CF476B',
          600: '#B62C51',
          700: '#991F3F',
          800: '#801C36',
          900: '#6C1B31',
          950: '#420B1A',
        },
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
        sans: ['"IBM Plex Sans Arabic"', 'Tajawal', 'sans-serif'],
        display: ['Tajawal', '"IBM Plex Sans Arabic"', 'sans-serif'],
        quran: ['"Amiri Quran"', '"Scheherazade New"', 'Amiri', 'serif'],
        uthmani: ['"Scheherazade New"', '"Amiri Quran"', 'serif'],
        naskh: ['"Noto Naskh Arabic"', 'Amiri', 'serif'],
        amiri: ['Amiri', 'serif'],
        cairo: ['"IBM Plex Sans Arabic"', 'Tajawal', 'sans-serif'],
        readex: ['"Readex Pro"', '"IBM Plex Sans Arabic"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
