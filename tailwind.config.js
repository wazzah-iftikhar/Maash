/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        teal:      { DEFAULT: '#0B4F6C', light: '#EAF4F8', dark: '#083D55' },
        navy:      { DEFAULT: '#1A1A2E', light: '#252545' },
        gold:      { DEFAULT: '#C9A84C', light: '#E8C96A', pale: '#FEF9EC' },
        charcoal:  '#2C2C3E',
        offwhite:  '#F7F5F0',
        muted:     '#6B7280',
        border:    '#E2DDD5',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
