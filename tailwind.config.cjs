/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#111827",
        light: "#f8fafc",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
