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
        cream: "#FFF8F0",
        peach: "#FFD4B8",
        pink: "#FFB5C5",
        mint: "#B8F0D8",
        lavender: "#D4C5F9",
        sky: "#B8E4FF",
        coral: "#FF8A80",
        soft: {
          text: "#5D4E60",
          muted: "#9B8FA8",
        },
      },
      fontFamily: {
        cute: ["var(--font-cute)", "Apple SD Gothic Neo", "Malgun Gothic", "sans-serif"],
      },
      animation: {
        bounce: "bounce 1s infinite",
        wiggle: "wiggle 0.5s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "race-run": "raceRun 0.6s ease-in-out infinite alternate",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        raceRun: {
          "0%": { transform: "translateY(0) scaleX(1)" },
          "100%": { transform: "translateY(-4px) scaleX(1.05)" },
        },
      },
      boxShadow: {
        cute: "0 4px 20px rgba(255, 181, 197, 0.35)",
        card: "0 8px 32px rgba(93, 78, 96, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
