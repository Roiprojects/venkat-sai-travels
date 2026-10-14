/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#B5121B',
          50: '#FDF2F2',
          100: '#FCE4E4',
          200: '#FAC8C9',
          300: '#F59A9C',
          400: '#E85B5F',
          500: '#D71920',
          600: '#B5121B',
          700: '#8F0E15',
          800: '#6C0B10',
          900: '#4D080B',
        },
        red: {
          brand: '#B5121B',
          light: '#D71920',
          dark: '#8F0E15',
        },
        surface: {
          white: '#FFFFFF',
          offwhite: '#FAFAF8',
          light: '#F7F7F5',
          muted: '#F0F0ED',
          border: '#E5E5E5',
        },
        charcoal: {
          DEFAULT: '#222222',
          900: '#171717',
          800: '#252525',
          700: '#333333',
          600: '#555555',
          500: '#666666',
          400: '#888888',
          300: '#AAAAAA',
        },
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', '"Outfit"', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', '"Plus Jakarta Sans"', 'sans-serif'],
        button: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #D71920 0%, #B5121B 50%, #8F0E15 100%)',
        'light-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF8 50%, #F7F7F5 100%)',
        'card-gradient': 'linear-gradient(135deg, #FFFFFF 0%, #FAFAF8 100%)',
      },
      boxShadow: {
        brand: '0 4px 20px rgba(181, 18, 27, 0.25)',
        'brand-lg': '0 8px 30px rgba(181, 18, 27, 0.35)',
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        card: '0 4px 24px -2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 16px 36px -4px rgba(0, 0, 0, 0.1), 0 0 16px rgba(181, 18, 27, 0.08)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.06)',
        'glass-hover': '0 16px 48px 0 rgba(181, 18, 27, 0.12)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        shimmer: 'shimmer 2.5s infinite',
        pulseSlow: 'pulseSlow 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
