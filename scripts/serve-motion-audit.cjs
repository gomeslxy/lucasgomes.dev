#!/usr/bin/env node
/* Local QA only. Proxies an existing production preview; never imported by Next. */
const fs = require("node:fs");
const http = require("node:http");
const https = require("node:https");
const path = require("node:path");

function option(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

if (process.argv.includes("--help")) {
  process.stdout.write("Usage: node scripts/serve-motion-audit.cjs [--origin http://localhost:3101] [--port 3110]\nOpen http://localhost:3110/__audit. Start the production preview separately.\n");
  process.exit(0);
}

let origin;
try {
  origin = new URL(option("--origin", process.env.MOTION_AUDIT_ORIGIN || "http://localhost:3101"));
  if (!["http:", "https:"].includes(origin.protocol) || origin.username || origin.password) throw new Error("Use an HTTP(S) origin without credentials.");
} catch (error) {
  process.stderr.write(`Invalid audit origin: ${error.message}\n`);
  process.exit(1);
}

const port = Number(option("--port", process.env.MOTION_AUDIT_PORT || "3110"));
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  process.stderr.write("Audit port must be an integer from 1 to 65535.\n");
  process.exit(1);
}

const harness = fs.readFileSync(path.join(__dirname, "motion-audit.html"));
const transport = origin.protocol === "https:" ? https : http;
const hopHeaders = new Set(["connection", "keep-alive", "proxy-authenticate", "proxy-authorization", "te", "trailer", "transfer-encoding", "upgrade"]);
const sockets = new Set();

const server = http.createServer((request, response) => {
  const pathname = new URL(request.url || "/", "http://localhost").pathname;
  if (pathname === "/__audit" || pathname === "/__audit/") {
    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Length": harness.length,
      "Cache-Control": "no-store",
    });
    response.end(request.method === "HEAD" ? undefined : harness);
    return;
  }

  // Keep the upstream target fixed. The request path cannot select another host.
  const headers = Object.fromEntries(Object.entries(request.headers).filter(([name]) => !hopHeaders.has(name.toLowerCase())));
  headers.host = origin.host;
  const upstream = transport.request({
    protocol: origin.protocol,
    hostname: origin.hostname,
    port: origin.port || (origin.protocol === "https:" ? 443 : 80),
    method: request.method,
    path: request.url || "/",
    headers,
  }, incoming => {
    const outgoing = Object.fromEntries(Object.entries(incoming.headers).filter(([name]) => !hopHeaders.has(name.toLowerCase())));
    if (typeof outgoing.location === "string" && outgoing.location.startsWith(origin.origin + "/")) {
      outgoing.location = outgoing.location.slice(origin.origin.length);
    }
    // Security headers are preserved. SAMEORIGIN/frame-ancestors 'self' work
    // because both the harness and proxied iframe use this local origin.
    response.writeHead(incoming.statusCode || 502, outgoing);
    incoming.pipe(response);
    incoming.on("error", () => response.destroy());
  });

  upstream.on("error", error => {
    if (!response.headersSent) response.writeHead(502, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
    if (!response.destroyed) response.end(`Production preview unavailable at ${origin.origin}. Start it separately.\n${error.code || "UPSTREAM_ERROR"}\n`);
  });
  request.on("aborted", () => upstream.destroy());
  response.on("close", () => { if (!response.writableEnded) upstream.destroy(); });
  request.pipe(upstream);
});

server.on("connection", socket => {
  sockets.add(socket);
  socket.on("close", () => sockets.delete(socket));
});
server.on("error", error => {
  process.stderr.write(`Motion audit server: ${error.message}\n`);
  process.exitCode = 1;
});
server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`Motion audit: http://localhost:${port}/__audit\nProduction origin: ${origin.origin}\nLocal QA only; no production bundle changes. Press Ctrl+C to stop.\n`);
});

function close() {
  server.close();
  for (const socket of sockets) socket.destroy();
}
process.once("SIGINT", close);
process.once("SIGTERM", close);
