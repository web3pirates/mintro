import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "#37474F",
        primary: "#4CAF50",
        secondary: "var(--secondary)",
        
        "primary-accent": "var(--primary-accent)",
        "foreground-accent": "var(--foreground-accent)",
        "hero-background": "var(--hero-background)",
        
        // Light mode specific colors
        "light-bg": "#ffffff",
        "light-surface": "#f8f9fa",
        "light-border": "#e5e7eb",
        "light-text": "#1f2937",
        "light-text-secondary": "#6b7280",
        "light-hover": "#f3f4f6",
      },
    },
  },
  plugins: [],
};
export default config;