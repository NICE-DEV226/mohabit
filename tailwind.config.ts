import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#0A0A0A',
        gold: {
          DEFAULT: '#F5A623',
          50: '#FEF3D9',
          100: '#FDE8B3',
          200: '#FBD180',
          400: '#F5A623',
          500: '#F5A623',
          600: '#D4890E',
          700: '#B36E09',
        },
        blue: {
          DEFAULT: '#1E90FF',
          400: '#1E90FF',
          500: '#1E90FF',
          600: '#1873CC',
        },
        grey: {
          dark: '#1A1A1A',
          mid: '#2C2C2C',
          text: '#A0A0A0',
        },
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      animation: {
        'skeleton-pulse': 'skeleton-pulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        'skeleton-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
