import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1A0E6B',
          secondary: '#2B1EA3',
          accent: '#F4B400',
          dark: '#0B0638',
          light: '#FFFFFF',
          'primary-light': '#2A1E8B',
          'secondary-light': '#3B2EC3',
          'accent-light': '#F6C640',
          'accent-dark': '#D49A00',
          muted: '#8B85B1',
          'dark-surface': '#110B4A',
          'dark-card': '#15103F',
          'glass-border': 'rgba(255, 255, 255, 0.1)',
        },
      },
      fontFamily: {
        heading: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'circuit-pattern': "url('/patterns/circuit.svg')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, #1A0E6B 0%, #2B1EA3 50%, #0B0638 100%)',
        'gradient-accent': 'linear-gradient(135deg, #F4B400 0%, #F6C640 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0B0638 0%, #1A0E6B 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
      },
      boxShadow: {
        'glow-accent': '0 0 20px rgba(244, 180, 0, 0.3)',
        'glow-primary': '0 0 20px rgba(26, 14, 107, 0.5)',
        'glow-blue': '0 0 30px rgba(43, 30, 163, 0.4)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'circuit-flow': 'circuitFlow 3s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(244, 180, 0, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(244, 180, 0, 0.6)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        circuitFlow: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
