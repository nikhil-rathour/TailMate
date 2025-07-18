/** @type {import('tailwindcss').Config} */
export default {
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#181C2C',
        gold: '#FFD166',
        beige: '#F3E9E1',
        lightgray: '#F5F6FA',
        'accent-orange': '#FFB800',
        softgray: '#AEB2C1',
      },
    },
  },
  plugins: [],
}

