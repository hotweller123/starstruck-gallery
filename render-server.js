// render-server.js
// Adapter to run TanStack Start's fetch handler on Render (Node.js)

import { createServer } from "node:http";
import { Readable } from "node:stream";

const PORT = process.env.PORT || 3000;

async function start() {
  const { default: serverEntry } = await import("./dist/server/server.js");

  const httpServer = createServer(async (req, res) => {
    try {
      // Reconstruct full URL
      const protocol = req.headers["x-forwarded-proto"] || "https";
      const host = req.headers.host;
      const url = new URL(req.url, `${protocol}://${host}`);

      // Convert Node headers → Web Headers
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value) {
          headers.set(key, Array.isArray(value) ? value.join(", ") : value);
        }
      }

      // Body handling (for POST/PUT etc.)
      let body;
      if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS") {
        body = Readable.toWeb(req);
      }

      const request = new Request(url, {
        method: req.method,
        headers,
        body,
        duplex: "half",
      });

      // Call TanStack Start handler
      const response = await serverEntry.fetch(request, {}, {});

      // Send response back
      res.statusCode = response.status;
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      if (response.body) {
        const reader = response.body.getReader();
        const pump = async () => {
          const { done, value } = await reader.read();
          if (done) {
            res.end();
            return;
          }
          res.write(Buffer.from(value));
          pump();
        };
        pump();
      } else {
        res.end();
      }
    } catch (err) {
      console.error("Render server error:", err);
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain");
      res.end("Internal Server Error");
    }
  });

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
