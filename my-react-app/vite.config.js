import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    base: "/Battleship-project", // For GitHub Pages
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL || "http://localhost:3000", // Fallback to localhost in dev
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
