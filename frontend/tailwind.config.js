/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#14162B',
          light: '#1E2140',
          lighter: '#2A2E52',
        },
        paper: '#FAFAFC',
        brand: {
          DEFAULT: '#FF6B4A',
          dark: '#E5522F',
          light: '#FF8D73',
        },
        sun: {
          DEFAULT: '#FFC857',
          dark: '#F2AE2E',
        },
        mint: {
          DEFAULT: '#34D399',
          dark: '#10B981',
        },
        slate: {
          soft: '#8A8DA6',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px -4px rgba(20, 22, 43, 0.08)',
        'card-hover': '0 12px 32px -8px rgba(20, 22, 43, 0.18)',
        glow: '0 0 0 4px rgba(255, 107, 74, 0.15)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
