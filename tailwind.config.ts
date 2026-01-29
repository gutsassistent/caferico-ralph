import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './messages/**/*.json'
  ],
  theme: {
    extend: {
      colors: {
        espresso: '#3C1518',
        roast: '#69140E',
        cream: '#F2E8CF',
        gold: {
          DEFAULT: '#C9A962',
          light: '#D4B87A',
          dark: '#B89A52',
          muted: '#D4A574',
        },
        noir: '#1A0F0A',
        primary: '#C9A962',
        secondary: '#2C2419',
        background: '#FAF9F7',
        surface: {
          dark: '#1A0F0A',
          medium: '#2C2419',
          light: '#FAF9F7',
        },
      },
      spacing: {
        '4.5': '18px',
        '13': '52px',
        '15': '60px',
        '18': '72px',
        '22': '88px',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif']
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        cartBounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.35)' },
          '70%': { transform: 'scale(0.9)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out both',
        'cart-bounce': 'cartBounce 0.4s ease-out',
      },
      backgroundImage: {
        'coffee-glow': 'radial-gradient(circle at top, rgba(212, 165, 116, 0.25), transparent 55%)',
        'coffee-grain': 'radial-gradient(circle at 1px 1px, rgba(242, 232, 207, 0.15) 1px, transparent 0)'
      }
    }
  },
  plugins: []
};

export default config;
