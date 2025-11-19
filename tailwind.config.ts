import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {},
  },

  // 👇 AQUI ESTÁ A CORREÇÃO QUE RESOLVE SEU PROBLEMA
  experimental: {
    // força Tailwind a NÃO usar oklch/lab
    disableDeprecatedGapUtilities: true,
  },

  // Tailwind 3.4+ usa OKLCH por padrão
  // então definimos explicitamente para RGB:
  defaultColorFunction: "rgb",
};

export default config;
