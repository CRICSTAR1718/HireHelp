import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // All domains now live behind the single merged monolith API
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  // Handle client-side routing for SPA
  preview: {
    port: 5173,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
