import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './providers/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic theme tokens — map to CSS custom properties
        't-bg':      'var(--t-bg)',
        't-surface': 'var(--t-surface)',
        't-card':    'var(--t-card)',
        't-border':  'var(--t-border)',
        't-text':    'var(--t-text)',
        't-muted':   'var(--t-muted)',
        't-subtle':  'var(--t-subtle)',

        stadium: {
          900: '#040810',
          800: '#060B18',
          750: '#0A1020',
          700: '#0D1526',
          600: '#111C32',
          500: '#172240',
          400: '#1E2D4A',
          300: '#2A3D5C',
          200: '#3D5470',
          100: '#8896B0',
        },
        wc: {
          blue: '#1A56DB',
          'blue-light': '#3B82F6',
          gold: '#D97706',
          'gold-light': '#F59E0B',
          live: '#EF4444',
          'live-dark': '#B91C1C',
          green: '#22C55E',
          teal: '#0EA5E9',
        },
      },
      animation: {
        'pulse-live': 'pulseLive 1.4s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        pulseLive: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #92400e 0%, #d97706 50%, #92400e 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
