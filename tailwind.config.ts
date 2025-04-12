import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors"

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: colors.neutral[50],
        foreground: colors.neutral[900],
        "primary": colors.blue[500],
        "on-surface": "#121212",
        "secondary-container": "#DCE2F9",
        "on-secondary-container": "#151B2C", 
      },
    },
  },
  plugins: [],
} satisfies Config;
