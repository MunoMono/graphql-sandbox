// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// Copies dist/index.html → dist/404.html after build
// so GitHub Pages SPA routes (e.g. /api) fall back to index.html
function spaFallback404() {
  return {
    name: "spa-fallback-404",
    closeBundle() {
      const dist = path.resolve(__dirname, "dist");
      const index = path.join(dist, "index.html");
      const fourOhFour = path.join(dist, "404.html");
      if (fs.existsSync(index)) {
        fs.copyFileSync(index, fourOhFour);
        console.log("Created 404.html for SPA fallback");
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), spaFallback404()],
  // IMPORTANT for GitHub Pages — repo name as base
  base: "/graphql-sandbox/",
  server: {
    proxy: {
      // anything you call at /ch-graphql/* gets forwarded to the Cooper Hewitt API
      "/ch-graphql": {
        target: "https://api.cooperhewitt.org",
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/ch-graphql/, "/"),
      },
    },
  },
});