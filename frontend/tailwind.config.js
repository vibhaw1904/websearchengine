/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#000000',
          surface: '#0D0D0D',
          card: '#111111',
        },
        border: {
          DEFAULT: '#1F1F1F',
          accent: '#00E5FF',
        },
        text: {
          primary: '#F5F5F5',
          secondary: '#737373',
        },
        accent: {
          DEFAULT: '#00E5FF',
          dim: '#00B8CC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        blink: 'blink 0.8s step-end infinite',
        'fade-in': 'fadeIn 0.3s ease forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
