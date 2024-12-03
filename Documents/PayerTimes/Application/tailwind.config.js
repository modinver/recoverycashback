/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#4A5568',
          600: '#2D3748',
          700: '#1A202C',
          800: '#171923',
          900: '#0A0C0F',
        },
        accent: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#243B53',
          900: '#102A43',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
        heading: ['Roboto', 'system-ui', 'sans-serif'],
        arabic: ['Roboto', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'elegant': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'hover': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}