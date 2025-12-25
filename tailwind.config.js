/** @type {import('tailwindcss').Config} */
export default {darkMode: 'class', // BEZ TEGO NIE RUSZY
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Sprawdź, czy ścieżka do src jest poprawna
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
}