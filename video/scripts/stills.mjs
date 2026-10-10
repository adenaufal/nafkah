// Render a few frames of a composition (one bundle) for a quick visual check.
//   node scripts/stills.mjs 30 200 480 …                 -> out/stills/f<frame>.png (Teaser)
//   node scripts/stills.mjs --comp=Teaser16x9 30 200 …   -> 16:9 cut
//   add --cover for the matching cover still.
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const args = process.argv.slice(2);
const id = args.find((a) => a.startsWith("--comp="))?.slice("--comp=".length) ?? "Teaser";
const frames = args.map(Number).filter((n) => Number.isFinite(n));
const outDir = resolve("out/stills");
await mkdir(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id, inputProps: { music: false } });
for (const frame of frames) {
  const output = resolve(outDir, `${id}-f${String(frame).padStart(4, "0")}.png`);
  await renderStill({ serveUrl, composition, frame, output, inputProps: { music: false }, scale: 0.5 });
  console.log("still", frame, output);
}
if (args.includes("--cover")) {
  const coverId = id === "Teaser16x9" ? "Cover16x9" : "Cover";
  const cover = await selectComposition({ serveUrl, id: coverId, inputProps: {} });
  await renderStill({ serveUrl, composition: cover, frame: 0, output: resolve(outDir, `${coverId}.png`), scale: 0.5 });
  console.log("cover", coverId);
}
