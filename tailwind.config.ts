import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Adicione suas cores personalizadas aqui
        "leao-amarelo": "var(--leao-amarelo)",
        "leao-vermelho": "var(--leao-vermelho)",
        "leao-preto": "var(--leao-preto)",
        "leao-verde": "var(--leao-verde)"
      },
    },
  },
  plugins: [],
};
export default config;
