import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

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
  plugins: [tailwindcssAnimate],
} satisfies Config
