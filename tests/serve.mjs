// Zero-dependency static server for local dev and tests.
import http from "node:http";
import { gzipSync } from "node:zlib";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".svg": "image/svg+xml",
  ".jpg": "image/jpeg", ".png": "image/png", ".json": "application/json", ".webmanifest": "application/manifest+json" };

export function serve(port = Number(process.env.PORT) || 8080) {
  const server = http.createServer(async (req, res) => {
    let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (path.endsWith("/")) path += "index.html";
    const file = normalize(join(root, path));
    if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
    try {
      let body = await readFile(file);
      const headers = { "content-type": TYPES[extname(file)] || "application/octet-stream" };
      if (/gzip/.test(req.headers["accept-encoding"] || "") && /text|javascript|json|svg|manifest/.test(headers["content-type"])) {
        body = gzipSync(body); headers["content-encoding"] = "gzip"; // match production hosts
      }
      res.writeHead(200, headers).end(body);
    } catch {
      try { res.writeHead(404, { "content-type": "text/html" }).end(await readFile(join(root, "404.html"))); }
      catch { res.writeHead(404, { "content-type": "text/plain" }).end("Not found"); }
    }
  });
  return new Promise((r) => server.listen(port, () => r(server)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const s = await serve();
  console.log(`Ember & Bean running at http://localhost:${s.address().port}`);
}
