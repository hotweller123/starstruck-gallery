import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

// =================================================================
// Clean standalone Vite config for TanStack Start
// No more Lovable wrapper. No string-replacement into node_modules (that was causing the Rollup parse error).
// Error handling for SSR is handled in src/server.ts (for production) + normal Vite error overlay (for dev).
// =================================================================

export default defineConfig(({ mode }) => {
  // Inject VITE_* env vars
  const envDefine: Record<string, string> = {};
  const loadedEnv = loadEnv(mode, process.cwd(), "VITE_");
  for (const [key, value] of Object.entries(loadedEnv)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  return {
    define: envDefine,
    preview: {
      allowedHosts: true,
    },

    resolve: {
      alias: {
        "@": `${process.cwd()}/src`,
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },

    server: {
      host: "::",
      port: 8080,
    },

    plugins: [
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({
        server: { entry: "server" },
      }),
      viteReact(),
    ],
  };
});

// configuration for render static site

// export default defineConfig({
//   plugins: [
//     react(),
//     tanstackStart({
//   // Force static/SPA mode
//       ssr: false,
//       prerender: true,   // or false if you want pure SPA
//     })
//   ],
//   build: {
//     outDir: 'dist',     // important for static
//   }
// })
// Step 2: Update package.json Scripts
// JSON{
//   "scripts": {
//     "build": "vite build",
//     "preview": "vite preview"
//   }
// }
// Step 3: Create render.yaml (Recommended)
// In your project root, create this file:
// YAMLservices:
//   - type: static
//     name: artora-mint-static
//     buildCommand: npm run build
//     publishPath: dist
//     pullRequestPreviewsEnabled: true
// Step 4: Deploy on Render

// Go to Render Dashboard → New Static Site
// Connect your GitHub repo
// Set these fields:
// Build Command: npm run build
// Publish Directory: dist

// Click Create Static Site

// Important Notes for Static Deployment

// All routes will be handled client-side (SPA mode) → You may see a blank page or 404 on direct refresh unless you configure redirects.
// For SPA routing on Render Static Site, you need to add a Redirect rule:In your service settings → Redirects/Rewrites:
// Add this rule:
// Source Path: /*
// Destination Path: /index.html
// Status Code: 200
