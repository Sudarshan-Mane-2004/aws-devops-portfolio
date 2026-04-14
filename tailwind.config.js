/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(99, 102, 241, 0.35)',
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.3), transparent 35%), radial-gradient(circle at 80% 0%, rgba(56, 189, 248, 0.2), transparent 35%), linear-gradient(150deg, #020617 0%, #050b1f 60%, #020617 100%)',
      },
    },
  },
  plugins: [],
}

