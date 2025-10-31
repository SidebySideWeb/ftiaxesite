import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
    "./pages/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-roboto)", "system-ui", "sans-serif"],
        heading: ["var(--font-roboto-condensed)", "var(--font-roboto)", "system-ui", "sans-serif"],
      },
      colors: {
        // --- Brand colors
        brand: {
          navy: "#1B264F",
          teal: "#4ECDC4",
        },

        // --- Semantic design tokens (used by Shadcn / v0)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary, 230 40% 20%))", // fallback to navy
          foreground: "hsl(var(--primary-foreground, 0 0% 100%))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary, 174 64% 52%))", // fallback to teal
          foreground: "hsl(var(--secondary-foreground, 0 0% 0%))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted, 210 16% 96%))",
          foreground: "hsl(var(--muted-foreground, 215 20% 40%))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent, 174 64% 52%))",
          foreground: "hsl(var(--accent-foreground, 230 40% 20%))",
        },
        border: "hsl(var(--border, 220 15% 85%))",
        input: "hsl(var(--input, 220 15% 85%))",
        ring: "hsl(var(--ring, 230 40% 30%))",

        card: {
          DEFAULT: "hsl(var(--card, 0 0% 100%))",
          foreground: "hsl(var(--card-foreground, 230 40% 15%))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover, 0 0% 100%))",
          foreground: "hsl(var(--popover-foreground, 230 40% 15%))",
        },

        destructive: {
          DEFAULT: "hsl(var(--destructive, 0 84% 60%))",
          foreground: "hsl(var(--destructive-foreground, 0 0% 100%))",
        },

        chart: {
          1: "hsl(var(--chart-1, 210 100% 56%))",
          2: "hsl(var(--chart-2, 160 84% 39%))",
          3: "hsl(var(--chart-3, 45 97% 64%))",
          4: "hsl(var(--chart-4, 280 72% 60%))",
          5: "hsl(var(--chart-5, 12 89% 60%))",
        },
      },

      borderRadius: {
        xl: "0.75rem",
        lg: "var(--radius, 10px)",
        md: "calc(var(--radius, 10px) - 2px)",
        sm: "calc(var(--radius, 10px) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config

