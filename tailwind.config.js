/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#6366f1', // Indigo 500
        secondary: '#f43f5e', // Rose 500
        background: '#f8fafc', // Slate 50
        surface: '#ffffff',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'pop-in': 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      }
    },
  },
  plugins: [],
}

