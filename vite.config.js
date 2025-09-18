// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // anything you call at /ch-graphql/* gets forwarded to the Cooper Hewitt API
      "/ch-graphql": {
        target: "https://api.cooperhewitt.org",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/ch-graphql/, "/"),
      },
    },
  },
});