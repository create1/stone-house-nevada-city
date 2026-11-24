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
        black: "#0A0A0A",
        gold: {
          DEFAULT: "#C9A84C",
          light: "#DFC078",
          lighter: "#F0D9A8",
          dark: "#A88748",
        },
        // Dark-first palette — stone and offwhite are now dark tones
        stone: {
          DEFAULT: "#1E1C18",
          dark: "#171512",
        },
        offwhite: "#1A1714",
        surface: {
          DEFAULT: "#1A1714",
          100: "#1E1C18",
          200: "#24221D",
          300: "#2A2722",
          400: "#332F29",
        },
        cream: "#F4EDE0",
        muted: "#8A7E6F",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        body: ["var(--font-jost)", "var(--font-inter)", "Jost", "Inter", "sans-serif"],
      },
      fontSize: {
        "display-xl": [
          "clamp(3rem, 6vw, 5.5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.02em" },
        ],
        "display-lg": [
          "clamp(2.25rem, 4vw, 4rem)",
          { lineHeight: "1.1", letterSpacing: "-0.01em" },
        ],
        "display-md": [
          "clamp(1.75rem, 3vw, 2.75rem)",
          { lineHeight: "1.15", letterSpacing: "-0.01em" },
        ],
        "display-sm": [
          "clamp(1.25rem, 2vw, 1.75rem)",
          { lineHeight: "1.2" },
        ],
      },
      spacing: {
        section: "clamp(4rem, 8vw, 8rem)",
        "section-sm": "clamp(2rem, 4vw, 4rem)",
      },
      borderRadius: {
        sm: "2px",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-slow": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(40px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.8s ease-out forwards",
        "fade-in-slow": "fade-in-slow 1.2s ease-out forwards",
        "slide-up": "slide-up 0.6s ease-out forwards",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
