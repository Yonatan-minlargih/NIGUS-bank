export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bae5ba',
          300: '#8dd48d',
          400: '#5cb85c',
          500: '#388e3c',
          600: '#2e7d32',
          700: '#1b5e20',
          800: '#145214',
          900: '#0a360a',
        },
        accent: {
          yellow: '#ffa000',
          red: '#d9534f',
          blue: '#5bc0de',
          orange: '#f0ad4e',
        },
        sidebar: '#388e3c',
        'card-bg': '#66bb6a',
        'main-bg': '#f5f5f5',
        'text-dark': '#333333',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

