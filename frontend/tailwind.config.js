/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': 'var(--brand-primary)',
        'brand-secondary': 'var(--brand-secondary)',
        'dark-bg': 'var(--dark-bg)',
        'dark-surface': 'var(--dark-surface)',
        'dark-border': 'var(--dark-border)',
        'dark-text-primary': 'var(--dark-text-primary)',
        'dark-text-secondary': 'var(--dark-text-secondary)',
      },
    },
  },
  plugins: [],
};