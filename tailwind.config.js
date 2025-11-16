/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gt: {
          navy: '#0A3255',
          navyDark: '#051B30',
          navyMuted: '#123F6B',
          gold: '#AE9D64',
          goldLight: '#C7B67F',
          cream: '#FDF9EF',
          white: '#FFFFFF',
        },
      },
      boxShadow: {
        glow: '0 18px 38px -12px rgba(10, 50, 85, 0.55)',
        gold: '0 12px 30px -14px rgba(174, 157, 100, 0.7)'
      }
    },
  },
  plugins: [],
}
