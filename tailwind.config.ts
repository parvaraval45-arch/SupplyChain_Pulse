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
        primary: "#0066CC",
        dark: "#071D49",
        accent: "#00A3E0",
        surface: "#F8FAFC",
        white: "#FFFFFF",
        "text-primary": "#0F172A",
        "text-secondary": "#64748B",
        success: "#0D7C3D",
        "success-bg": "#ECFDF3",
        warning: "#B45309",
        "warning-bg": "#FFF7ED",
        danger: "#C4320A",
        "danger-bg": "#FFF1F0",
        border: "#E2E8F0",
        "sidebar-dark": "#071D49",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        heading: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
      },
      fontSize: {
        base: "14px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
