/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1A1A2E",
        secondary: "#16213E",
        accent: "#E94560",
        gold: "#F5A623",
        light: "#F8F9FA",
      },
    },
  },
  plugins: [],
};
