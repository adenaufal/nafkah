import { ALL_PROVINCE_PACKAGES } from "../../src/data/provinces/index";
import * as fs from "fs";

const out = ALL_PROVINCE_PACKAGES.map((p) => ({
  provinceName: p.provinceName,
  provinceCode: p.provinceCode,
  regions: p.regions.map((r) => ({ code: r.code, name: r.name, tier: r.tier })),
  wages: p.wages.map((w) => ({
    regionCode: w.regionCode,
    year: w.year,
    grossMonthly: w.grossMonthly,
    source: w.source,
    asOf: w.asOf,
    confidence: w.confidence,
  })),
}));
fs.writeFileSync("data-prep/data/wages-2025.json", JSON.stringify(out, null, 1));

let n = 0,
  official = 0;
const years: Record<number, number> = {};
const umpVsUmk: Record<string, number> = {};
for (const p of ALL_PROVINCE_PACKAGES) {
  n += p.wages.length;
  for (const w of p.wages) {
    official += w.confidence === "official" ? 1 : 0;
    years[w.year] = (years[w.year] || 0) + 1;
    const isUmp = /UMP|Upah Minimum Provinsi/i.test(w.source);
    umpVsUmk[isUmp ? "UMP-sourced" : "UMK-sourced"] =
      (umpVsUmk[isUmp ? "UMP-sourced" : "UMK-sourced"] || 0) + 1;
  }
}
console.log(JSON.stringify({ total: n, official, years, umpVsUmk }, null, 1));
