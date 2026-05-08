import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f6f3ff",
          100: "#eee8ff",
          200: "#ddd2ff",
          300: "#c3adff",
          400: "#a07cff",
          500: "#7f52ff",
          600: "#6f3bfa",
          700: "#5e2de3",
          800: "#4f29b7",
          900: "#432694",
        },
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1rem",
      },
      boxShadow: {
        card: "0 8px 30px rgba(35, 21, 88, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
