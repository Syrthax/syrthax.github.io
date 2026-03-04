import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "rgb(var(--surface) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)"
      },
      boxShadow: {
        dock: "0 10px 35px -18px rgb(0 0 0 / 0.35)"
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at 20% 10%, rgb(180 180 180 / 0.08), transparent 35%), radial-gradient(circle at 80% 90%, rgb(120 120 120 / 0.1), transparent 30%)"
      }
    }
  },
  plugins: []
};

export default config;