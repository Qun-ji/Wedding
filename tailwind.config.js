/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f59e0b',
        rose: '#fda4af',
        gold: '#FFD700',
        champagne: '#F7E7CE',
        ivory: '#FFF8F0',
      },
      fontFamily: {
        cursive: ['"Dancing Script"', 'cursive'],
      },
      backgroundImage: {
        'gradient-pink-gold': 'linear-gradient(90deg, #fda4af 0%, #FFD700 100%)',
        'gradient-pink-champagne': 'linear-gradient(90deg, #fda4af 0%, #F7E7CE 100%)',
      },
    },
  },
  plugins: [],
}
