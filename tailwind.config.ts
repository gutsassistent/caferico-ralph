import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './messages/**/*.{json}'
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
      backgroundImage: {
        'coffee-glow': 'radial-gradient(circle at top, rgba(212, 165, 116, 0.25), transparent 55%)',
        'coffee-grain': 'radial-gradient(circle at 1px 1px, rgba(242, 232, 207, 0.15) 1px, transparent 0)'
      }
    }
  },
  plugins: []
};

export default config;
