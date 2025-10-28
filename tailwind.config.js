// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media', // <- follow system dark mode
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#5bb9ba', dark: '#5bb9ba' },
      },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] },
      maxWidth: { content: '64rem' },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
