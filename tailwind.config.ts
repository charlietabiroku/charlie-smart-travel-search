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
        ink: "#14213d",
        sky: "#4a90e2",
        mist: "#edf4ff",
        shell: "#f8fafc",
        line: "#dbe4f0",
        mint: "#d8f5ea",
        rose: "#ffe3e1"
      },
      boxShadow: {
        soft: "0 22px 60px rgba(15, 23, 42, 0.08)",
        card: "0 10px 30px rgba(15, 23, 42, 0.06)"
      },
      fontFamily: {
        sans: ["ui-sans-serif", "SF Pro Display", "SF Pro Text", "Helvetica Neue", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
