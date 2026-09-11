/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#090d16',
          card: '#111827',
          cardHover: '#1f293d',
          border: '#1f293d',
          borderGlow: '#38bdf840',
          accent: '#38bdf8',
          text: '#f3f4f6',
          muted: '#9ca3af',
          red: '#ef4444',
          orange: '#f97316',
          yellow: '#eab308',
          green: '#10b981',
          purple: '#a855f7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.4)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.4)',
        'glow-orange': '0 0 20px rgba(249, 115, 22, 0.4)',
        'glow-blue': '0 0 20px rgba(56, 189, 248, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
};
