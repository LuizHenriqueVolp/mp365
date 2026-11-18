import type { Config } from "tailwindcss";
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        vino: { DEFAULT: "#6E1426", 900: "#4A0D19", 700: "#8A1D33" },
        oro: { DEFAULT: "#C9A04A", light: "#E6C982" },
        crema: "#FBF6EE",
        tinta: "#2B1B1E",
      },
      fontFamily: {
        display: ["Cinzel", "Georgia", "serif"],
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        body: ["Lora", "Georgia", "serif"],
        sans: ["Montserrat", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
