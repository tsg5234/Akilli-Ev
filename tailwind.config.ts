import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./stores/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Avenir Next", "Segoe UI", "Trebuchet MS", "system-ui", "sans-serif"],
        display: ["Avenir Next", "Segoe UI", "Trebuchet MS", "system-ui", "sans-serif"]
      },
      boxShadow: {
        panel: "0 20px 60px rgba(15, 23, 42, 0.12)",
        glow: "0 18px 50px rgba(32, 178, 170, 0.25)"
      },
      backgroundImage: {
        "panel-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,248,255,0.84))"
      }
    }
  },
  plugins: []
};

export default config;
