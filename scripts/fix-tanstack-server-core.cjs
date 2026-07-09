#!/usr/bin/env node

/**
 * Safety script to detect and remove corrupted @tanstack/start-server-core files.
 *
 * This can happen if a vite transform hook ever mutates node_modules
 * (e.g. injecting TypeScript syntax like "globalThis as any" into a .js file).
 *
 * Run automatically on postinstall, or manually via:
 *   npm run fix:server-core
 */

const fs = require("fs");
const path = require("path");

const TARGET_FILE = path.join(
  "node_modules",
  "@tanstack",
  "start-server-core",
  "dist",
  "esm",
  "request-response.js",
);

const BAD_PATTERNS = [
  "globalThis as any",
  "TANSTACK_SSR_ERROR_CAPTURE",
  "handler(request, requestOpts)).catch",
];

function checkAndFix() {
  if (!fs.existsSync(TARGET_FILE)) {
    return { found: false };
  }

  let content;
  try {
    content = fs.readFileSync(TARGET_FILE, "utf8");
  } catch (e) {
    return { found: true, error: e.message };
  }

  const isCorrupted = BAD_PATTERNS.some((p) => content.includes(p));

  if (isCorrupted) {
    try {
      fs.unlinkSync(TARGET_FILE);

      // Also clear vite/tanstack caches so the bad module isn't cached in memory
      const cacheDirs = [".vite", "node_modules/.vite", ".tanstack", "dist"];
      cacheDirs.forEach((dir) => {
        if (fs.existsSync(dir)) {
          try {
            fs.rmSync(dir, { recursive: true, force: true });
          } catch {}
        }
      });

      console.log("[fix-tanstack-server-core] Removed corrupted @tanstack/start-server-core file.");
      console.log('  Run "npm install" again to restore a clean copy.');
      return { found: true, fixed: true };
    } catch (e) {
      return { found: true, fixed: false, error: e.message };
    }
  }

  return { found: true, fixed: false, clean: true };
}

const result = checkAndFix();

if (result.found && result.fixed) {
  process.exit(0);
}

if (result.error) {
  console.warn("[fix-tanstack-server-core] Warning:", result.error);
}
