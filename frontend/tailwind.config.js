import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pastel: {
          yellow: "#FEF9C3", // yellow-100
          pink: "#FCE7F3",   // pink-100
          green: "#DCFCE7",  // green-100
          blue: "#DBEAFE",   // blue-100
          purple: "#F3E8FF", // purple-100
          orange: "#FFEDD5", // orange-100
        },
      },
      fontFamily: {
        hand: ['"Patrick Hand"', "cursive"],
        sans: ['"Inter"', "sans-serif"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light"], // Switch to light theme for the fridge look
  },
};
