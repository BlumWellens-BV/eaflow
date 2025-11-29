/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ArchiMate layer colors
        archimate: {
          strategy: '#F5E6A3',
          business: '#FFFFB5',
          application: '#B5FFFF',
          technology: '#C9E7B7',
          physical: '#C9E7B7',
          implementation: '#FFE0E0',
          composite: '#E0E0E0',
        },
      },
    },
  },
  plugins: [],
};
