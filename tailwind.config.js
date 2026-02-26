/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          50:  '#faf9f7',
          100: '#f4f1ec',
          200: '#e8e2d9',
          300: '#d6cdc0',
          400: '#b8a99a',
          500: '#9a8878',
          600: '#7d6b5c',
          700: '#5e4f43',
          800: '#3e342b',
          900: '#1f1a16',
        },
        ink: {
          DEFAULT: '#1a1714',
          light: '#3d3730',
          muted: '#6b6259',
        },
        accent: {
          crane: '#c8a882',   // warm gold — crane highlight
          fold:  '#8fb3a8',   // muted teal — fold crease
          hover: '#d4b896',   // lighter gold — hover state
        },
      },
      fontFamily: {
        serif: ['"Noto Serif JP"', 'Georgia', 'serif'],
        sans:  ['"Noto Sans JP"', 'system-ui', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in':    'fadeIn 0.6s ease forwards',
        'slide-up':   'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-left': 'slideLeft 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideLeft: { from: { opacity: '0', transform: 'translateX(40px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};
