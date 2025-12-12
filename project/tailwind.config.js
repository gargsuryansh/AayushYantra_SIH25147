/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#05BFDB',
        'background-light': '#f5f8f8',
        'background-dark': '#1A1A1A',
        'surface-dark': '#242424',
        'sidebar-dark': '#141414',
        'accent-lavender': '#C9A9FF',
      },
      fontFamily: {
        display: ['var(--font-playfair)', '"Playfair Display"', 'serif'],
        body: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

