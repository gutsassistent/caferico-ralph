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
        gold: '#D4A574',
        noir: '#1A0F0A'
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif']
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out both'
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
