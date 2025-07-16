/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <-- Tylko to dodajemy!
  theme: {
    extend: {
      colors: {
        zinc: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Opcjonalnie możesz dodać kolory dla dark mode
        dark: {
          bg: '#0a0a0a',
          surface: '#1a1a1a',
          border: '#2a2a2a',
        }
      },
      // Opcjonalnie animacje dla płynnego przejścia
      animation: {
        'theme-transition': 'themeTransition 0.3s ease-in-out',
      },
      keyframes: {
        themeTransition: {
          '0%': { opacity: '0.8' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}