/**
 * Dump ringkas dataset upah aktif (dari JSON berversi, AP-02) untuk pemeriksaan
 * cepat: jumlah record, proporsi confidence, sebaran tahun, dan pengindukan
 * UMP vs UMK mandiri. Jalankan dari root repo: npx tsx data-prep/scripts/dump-wages.ts
 */
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const dir = path.join(root, "public", "data", "v2026.1");

function readJson<T>(name: string): T {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(dir, name), "utf8"),
    ) as T;
  } catch (e) {
    console.error(`Gagal membaca ${name}:`, e instanceof Error ? e.message : e);
    process.exit(1);
  }
}

interface WageDump {
  regionCode: string;
  year: number;
  grossMonthly: number;
  source: string;
  asOf: string;
  confidence: string;
}
interface ManifestDump {
  datasetVersion: string;
}

const manifest = readJson<ManifestDump>("manifest.json");
const wages = readJson<WageDump[]>("wages.json");

console.log("datasetVersion:", manifest.datasetVersion);

let n = 0,
  official = 0;
const years: Record<number, number> = {};
const umpVsUmk: Record<string, number> = {};
for (const w of wages) {
  n += 1;
  if (w.confidence === "official") official += 1;
  years[w.year] = (years[w.year] || 0) + 1;
  const isUmp = /UMP|Upah Minimum Provinsi/i.test(w.source);
  umpVsUmk[isUmp ? "UMP-sourced" : "UMK-sourced"] =
    (umpVsUmk[isUmp ? "UMP-sourced" : "UMK-sourced"] || 0) + 1;
}

console.log("total wage records:", n);
console.log("official:", official);
console.log("years:", years);
console.log("umpVsUmk:", umpVsUmk);
