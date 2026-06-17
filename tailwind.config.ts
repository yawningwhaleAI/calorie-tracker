import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        display: ["var(--font-display)", "serif"],
      },
      colors: {
        canvas: "#F7F5F2",
        ink: {
          DEFAULT: "#1C1510",
          dark: "#0F0A07",
        },
        warm: {
          50: "#F7F5F2",
          100: "#EDE9E3",
          200: "#DDD8CF",
          300: "#C8C0B4",
          400: "#A89A8C",
          500: "#8C7B6B",
          600: "#70604F",
          700: "#584A3C",
          800: "#3D3229",
          900: "#1C1510",
        },
        ember: {
          DEFAULT: "#C05621",
          50: "#FEF3EE",
          100: "#FCDEC8",
          200: "#F9BE97",
          300: "#F59155",
          400: "#F16522",
          500: "#C05621",
          600: "#9C4318",
          700: "#7A3312",
          800: "#5C2509",
          900: "#3D1804",
        },
      },
    },
  },
  plugins: [],
};

export default config;
