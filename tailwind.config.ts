import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: "#07152f",
        midnight: "#0b1026",
        orchid: "#7c3aed",
        azure: "#2563eb"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(99, 102, 241, 0.35)",
        card: "0 22px 70px rgba(15, 23, 42, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
