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
        bg: "#0C0C0C",
        ba: "#1C1C1C",
        w: "#E2E2E1",
        a: "#01FFE0",
        ab: "#0E4D45",
        green: '#3DF57A',
        red: "#ff0320",
      },
      animation: {
        loader: 'pulse 0.35s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
export default config;
