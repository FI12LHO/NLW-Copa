/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      backgroundImage: {
        app: 'url("/assets/bg-app.png")'
      },
      fontFamily: {
        sans: 'Roboto, sans-serif'
      }
    },
  },
  plugins: [],
}
