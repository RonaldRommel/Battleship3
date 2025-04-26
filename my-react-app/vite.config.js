import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Battleship-project", // For GitHub Pages
  server: {
    proxy: {
      "/api": {
        target: "https://battleship3-5.onrender.com", // Your Node server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
