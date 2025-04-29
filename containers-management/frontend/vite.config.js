import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(),
    tailwindcss()],
  server: {
    proxy: {
      "/containers": {
        target: "http://localhost:4200",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
