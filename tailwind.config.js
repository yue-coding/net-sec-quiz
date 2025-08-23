/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f9ff',
          100: '#e8f1ff',
          200: '#cfe2ff',
          300: '#a6c8ff',
          400: '#77a5ff',
          500: '#4a7fff',
          600: '#2d5cf2',
          700: '#2346c4',
          800: '#1d399b',
          900: '#1a347d',
        },
      },
      boxShadow: {
        glow: '0 10px 30px -10px rgba(74, 127, 255, 0.5)'
      }
    },
  },
  plugins: [],
}
