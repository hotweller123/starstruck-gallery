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

export default defineConfig(async ({ mode }) => {
  // Inject VITE_* env vars
  const envDefine: Record<string, string> = {};
  const loadedEnv = loadEnv(mode, process.cwd(), "VITE_");
  for (const [key, value] of Object.entries(loadedEnv)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  return {
    define: envDefine,
    preview: {
      allowedHosts: ["starstruck-gallery.onrender.com"],
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
