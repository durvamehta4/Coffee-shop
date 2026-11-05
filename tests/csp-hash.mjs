// Re-computes CSP hashes for inline <script> blocks in index.html. Run after editing an inline script:
//   node tests/csp-hash.mjs
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const p = new URL("../index.html", import.meta.url);
let s = await readFile(p, "utf8");
const hashes = [...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => `'sha256-${createHash("sha256").update(m[1]).digest("base64")}'`);
s = s.replace(/(script-src 'self' https:\/\/cdnjs\.cloudflare\.com)[^;]*;/, `$1 ${hashes.join(" ")};`);
await writeFile(p, s);
console.log(`Updated ${hashes.length} inline script hashes`);
