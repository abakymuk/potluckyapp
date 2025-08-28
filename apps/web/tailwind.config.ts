import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}', // shared UI
  ],
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config
