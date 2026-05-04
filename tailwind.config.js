/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"Poppins"', "sans-serif"]
      },
      colors: {
        coffee: {
          950: "#160E0B",
          900: "#241511",
          800: "#3E2723",
          700: "#58372F",
          500: "#8C5B43"
        },
        cream: "#F5E6D3",
        gold: "#C9A14A",
        honey: "#E7C16D",
        ink: "#0F0D0B"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(201, 161, 74, 0.24)",
        neumorph: "12px 12px 34px rgba(22, 14, 11, 0.16), -10px -10px 26px rgba(255, 244, 229, 0.72)"
      }
    }
  },
  plugins: []
};
