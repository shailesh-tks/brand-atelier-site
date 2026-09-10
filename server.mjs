/**
 * Static file server for the pre-built export.
 *
 * The site has no API routes, no server actions and no dynamic routes — every
 * page is static — so it needs a file server, not a Next runtime. Building on
 * the host was OOM-killed repeatedly; the export is committed instead and this
 * only serves it. No dependencies: node:http and node:fs cover it.
 */

import { createServer } from "node:http";
import { createReadStream, promises as fs } from "node:fs";
import { join, resolve, extname, normalize } from "node:path";

const ROOT = resolve(process.env.STATIC_ROOT ?? "out");
const PORT = Number(process.env.PORT ?? 3000);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

/**
 * Resolve a URL path to a file inside ROOT, or null.
 * Everything here is a trust boundary: the returned path is checked to be
 * inside ROOT, so an encoded traversal can't escape the export directory.
 */
async function locate(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split("?")[0]);
  } catch {
    return null; // malformed percent-encoding
  }
  if (decoded.includes("\0")) return null;

  const candidate = resolve(join(ROOT, normalize(decoded)));
  if (candidate !== ROOT && !candidate.startsWith(ROOT + "/")) return null;

  try {
    const stat = await fs.stat(candidate);
    if (stat.isDirectory()) {
      const index = join(candidate, "index.html");
      await fs.access(index);
      return index;
    }
    return candidate;
  } catch {
    // trailingSlash: true means /about resolves to /about/index.html
    try {
      const asDir = join(candidate, "index.html");
      await fs.access(asDir);
      return asDir;
    } catch {
      return null;
    }
  }
}

const server = createServer(async (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { allow: "GET, HEAD" }).end("Method Not Allowed");
    return;
  }

  const file = await locate(req.url ?? "/");
  const target = file ?? join(ROOT, "404.html");
  const ext = extname(target);

  const headers = {
    "content-type": TYPES[ext] ?? "application/octet-stream",
    "x-content-type-options": "nosniff",
    // Hashed build assets are immutable; pages must revalidate.
    "cache-control": target.includes("/_next/")
      ? "public, max-age=31536000, immutable"
      : "public, max-age=0, must-revalidate",
  };

  try {
    await fs.access(target);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not Found");
    return;
  }

  res.writeHead(file ? 200 : 404, headers);
  if (req.method === "HEAD") return res.end();
  createReadStream(target).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Serving ${ROOT} on http://localhost:${PORT}`);
});
