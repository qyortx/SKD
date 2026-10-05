/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        twk: {
          DEFAULT: '#dc2626',
          50: '#fef2f2',
          100: '#fee2e2',
        },
        tiu: {
          DEFAULT: '#2563eb',
          50: '#eff6ff',
          100: '#dbeafe',
        },
        tkp: {
          DEFAULT: '#059669',
          50: '#ecfdf5',
          100: '#d1fae5',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
