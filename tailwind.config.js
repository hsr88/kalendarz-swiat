/** @type {import('tailwindcss').Config} */
export default {
  // Dodajemy tę linię, aby sterować trybem ciemnym za pomocą klasy
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
}