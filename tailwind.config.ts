import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0057A8",
        dark: "#003A75",
        accent: "#00A3E0",
        surface: "#F4F6F9",
        white: "#FFFFFF",
        "text-primary": "#1A1A2E",
        "text-secondary": "#5A6A7A",
        success: "#00875A",
        warning: "#FF8B00",
        danger: "#DE350B",
        border: "#DDE1E7",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["DM Serif Display", "serif"],
      },
      fontSize: {
        base: "14px",
      },
    },
  },
  plugins: [],
};
export default config;
