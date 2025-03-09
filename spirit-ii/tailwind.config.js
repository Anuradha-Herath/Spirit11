module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'fade-out': 'fadeOut 0.3s ease-in forwards',
        'fade-in-out': 'fadeIn 0.3s ease-out forwards, fadeOut 0.3s ease-in forwards 2.7s',
      },
      transitionProperty: {
        'width': 'width',
        'height': 'height',
      }
    },
  },
  plugins: [],
}