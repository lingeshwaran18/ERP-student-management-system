/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // support class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB', // Blue
          dark: '#1D4ED8',
        },
        secondary: {
          DEFAULT: '#10B981', // Emerald
          dark: '#059669',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        surface: {
          DEFAULT: '#F8FAFC',
          dark: '#0F172A',
        },
        border: {
          DEFAULT: '#E5E7EB',
          dark: '#334155',
        },
        text: {
          primary: '#111827',
          secondary: '#6B7280',
          darkPrimary: '#F8FAFC',
          darkSecondary: '#94A3B8',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
