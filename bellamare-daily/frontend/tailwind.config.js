/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sea: {
          50: "#eef7fb",
          100: "#d7ecf4",
          200: "#aed9e9",
          300: "#7cc0da",
          400: "#4aa4c6",
          500: "#2b86ab",
          600: "#1f6a8a",
          700: "#1c5570",
          800: "#1c465c",
          900: "#1a3b4e",
        },
        sun: {
          400: "#ffb648",
          500: "#ff9f1c",
          600: "#e6870a",
        },
      },
      fontSize: {
        base: ["1.125rem", "1.7rem"],
        lg: ["1.3rem", "1.9rem"],
        xl: ["1.6rem", "2.1rem"],
        "2xl": ["2rem", "2.4rem"],
        "3xl": ["2.5rem", "2.9rem"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
