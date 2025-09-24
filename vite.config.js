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
        // Insert meta no-cache tags into index.html
        let html = fs.readFileSync(index, "utf-8");
        if (!html.includes("Cache-Control")) {
          html = html.replace(
            "</head>",
            `
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
</head>`
          );
          fs.writeFileSync(index, html);
          console.log("Injected no-cache meta tags into index.html");
        }

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
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      },
    },
  },
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