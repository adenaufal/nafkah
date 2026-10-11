// Server statis kecil untuk hasil `next build` (folder out/). Next export
// menulis /metode sebagai metode.html, jadi path tanpa ekstensi dicoba
// dengan .html dan /index.html.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".topojson": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
  ".txt": "text/plain; charset=utf-8",
};

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

export function serveStatic(rootDir, port = 4317) {
  const root = resolve(rootDir);
  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const rel = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, "");
    const base = join(root, rel);
    if (!base.startsWith(root)) {
      res.writeHead(403).end();
      return;
    }
    const candidates = [base, `${base}.html`, join(base, "index.html")];
    for (const file of candidates) {
      if (await isFile(file)) {
        res.writeHead(200, {
          "content-type": TYPES[extname(file)] ?? "application/octet-stream",
        });
        res.end(await readFile(file));
        return;
      }
    }
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    res.end(await readFile(join(root, "404.html")).catch(() => "404"));
  });
  return new Promise((ok) => server.listen(port, () => ok(server)));
}

// node scripts/serve-static.mjs <out-dir> [port]
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/")}`) {
  const [dir = "../out", port = "4317"] = process.argv.slice(2);
  await serveStatic(dir, Number(port));
  console.log(`serving ${resolve(dir)} on http://localhost:${port}`);
}
