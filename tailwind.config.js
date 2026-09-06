/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        khmer: ['"Noto Sans Khmer"', '"Khmer OS"', 'system-ui', 'sans-serif'],
        pali: ['"Noto Serif Khmer"', '"Khmer OS Muol Light"', 'serif'],
        iast: ['"Noto Serif"', 'Georgia', 'serif'],
      },
      colors: {
        saffron: {
          50: '#fff8ed', 100: '#ffefd4', 200: '#ffdba8', 300: '#ffc071',
          400: '#ff9c38', 500: '#ff7f11', 600: '#f06307', 700: '#c74908',
          800: '#9e3a0f', 900: '#7f3110',
        },
        leaf: {
          50: '#f2fbf3', 100: '#e0f7e3', 200: '#c2eec9', 300: '#92dfa0',
          400: '#5bc76f', 500: '#35ac4b', 600: '#268c39', 700: '#216e30',
          800: '#1f582b', 900: '#1b4926',
        },
      },
      keyframes: {
        pop: { '0%': { transform: 'scale(.9)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        slideup: { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } },
        shake: { '0%,100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(-6px)' }, '75%': { transform: 'translateX(6px)' } },
      },
      animation: {
        pop: 'pop .18s ease-out',
        slideup: 'slideup .2s ease-out',
        shake: 'shake .3s ease-in-out',
      },
    },
  },
  plugins: [],
};
