/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#fcf9f8',
        'primary-text': '#1d110c',
        'accent': '#ffa07a',
        'tertiary-text': '#a15f45',
        'light-bg': '#f4eae6',
      },
    },
  },
  plugins: [],
}
