// Cover and 16:9 images for the v0.4.0 update, from one bundle.
//   node scripts/update-stills.mjs   -> out/nafkah-v040-*.png
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const STILLS = [
  ["UpdateCover", "nafkah-v040-cover.png"],
  ["Update16x9", "nafkah-v040-x-1-utama.png"],
  ["UpdateHome16x9", "nafkah-v040-x-2-rumah-sendiri.png"],
  ["UpdateSupport16x9", "nafkah-v040-x-3-tanggungan.png"],
  ["UpdateShare16x9", "nafkah-v040-x-4-struk.png"],
];

await mkdir(resolve("out"), { recursive: true });
const serveUrl = await bundle({ entryPoint: resolve("src/index.ts") });
for (const [id, file] of STILLS) {
  const composition = await selectComposition({ serveUrl, id, inputProps: {} });
  const output = resolve("out", file);
  await renderStill({ serveUrl, composition, frame: 0, output, inputProps: {} });
  console.log("still", id, output);
}
