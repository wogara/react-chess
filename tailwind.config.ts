//@ts-nocheck

import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        rosewater: "#f5e0dc",
        flamingo: "#f2cdcd",
        pink: "#f5c2e7",
        mauve: "#cba6f7",
        red: "#f38ba8",
        maroon: "#eba0ac",
        peach: "#fab387",
        yellow: "#f9e2af",
        green: "#a6e3a1",
        teal: "#94e2d5",
        sky: "#89dceb",
        sapphire: "#74c7ec",
        blue: "#89b4fa",
        lavender: "#b4befe",
        text: "#cdd6f4",
        subtext1: "#bac2de",
        subtext0: "#a6adc8",
        overlay2: "#9399b2",
        overlay1: "#7f849c",
        overlay0: "#6c7086",
        surface2: "#585b70",
        surface1: "#45475a",
        surface0: "#313244",
        base: "#1e1e2e",
        mantle: "#181825",
        crust: "#11111b",
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            '--tw-prose-headings': theme('colors.text'),
            '--tw-prose-body': theme('colors.text'),
            '--tw-prose-links': theme('colors.blue'),
            '--tw-prose-bold': theme('colors.green'),
            '--tw-prose-counters': theme('colors.text'),
            '--tw-prose-bullets': theme('colors.text'),
            '--tw-prose-hr': theme('colors.peach'),
            '--tw-prose-quotes': theme('colors.text'),
            '--tw-prose-quote-borders': theme('colors.text'),
            '--tw-prose-captions': theme('colors.text'),
            '--tw-prose-code': theme('colors.text'),
            '--tw-prose-pre-code': theme('colors.mantle'),
            '--tw-prose-pre-bg': theme('colors.blue'),
            '--tw-prose-th-borders': theme('colors.text'),
            '--tw-prose-td-borders': theme('colors.text'),
          }
        }
      })
    },
  },
  plugins: [typography],
};

export default config;

