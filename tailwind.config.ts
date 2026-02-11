
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#D4AF37",
          start: "#E0B763",
          end: "#D4AF37",
          light: "#FFE7A1",
          dark: "#A3852C",
        },
        brown: {
          deep: "#2C2B2B",
          darker: "#1A1A1A",
        },
        sand: {
          light: "#FBF8F5",
          warm: "#FDFDFD",
          taupe: "#A09D97",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-gold": "linear-gradient(135deg, theme('colors.gold.start') 0%, theme('colors.gold.end') 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
