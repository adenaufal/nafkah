/**
 * Data untuk video, dihitung dari dataset dan kode kalkulasi aplikasi yang
 * sama (src/lib/calculations.ts) supaya setiap angka di video cocok dengan
 * yang tampil di nafkah.adenaufal.com.
 *
 *   npm run data   ->  src/data/map.json, src/data/numbers.json
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import {
  AFFORDABILITY_BANDS,
  DEFAULT_ASSUMPTIONS,
  computeMetrics,
} from "@/lib/calculations";
import { EXPENSE_CATEGORIES } from "@/data/costs";
import { regionLabel } from "@/lib/names";
import type {
  AffordabilityBand,
  Assumptions,
  CostProfile,
  Region,
  WageRecord,
} from "@/lib/types";

const DATA = "../public/data/v2026.1";
const OUT = "src/data";

const regions: Region[] = JSON.parse(readFileSync(`${DATA}/regions.json`, "utf8"));
const wages = new Map(
  (JSON.parse(readFileSync(`${DATA}/wages.json`, "utf8")) as WageRecord[]).map(
    (w) => [w.regionCode, w],
  ),
);
const costs = new Map(
  (JSON.parse(readFileSync(`${DATA}/costs.json`, "utf8")) as CostProfile[]).map(
    (c) => [c.regionCode, c],
  ),
);
const byCode = new Map(regions.map((r) => [r.code, r]));
const byLabel = (label: string) => {
  const r = regions.find((x) => regionLabel(x) === label);
  if (!r) throw new Error(`Daerah tidak ada: ${label}`);
  return r;
};

/* ---------- Geometri ---------- */

// Sama dengan topologyToFeatureCollection di src/lib/geometry.ts: pcode HDX
// "ID3471" -> "34.71", poligon danau/hutan (.88/.99) dibuang.
const topology = JSON.parse(readFileSync("../public/data/regions.topojson", "utf8"));
const objectName = Object.keys(topology.objects)[0];
const raw = feature(topology, topology.objects[objectName]) as unknown as FeatureCollection<
  Geometry,
  { adm2_pcode?: string }
>;
const features = raw.features
  .map((f) => {
    const m = /^ID(\d{2})(\d{2})$/.exec(String(f.properties?.adm2_pcode ?? ""));
    const code = m ? `${m[1]}.${m[2]}` : null;
    if (!code || code.endsWith(".88") || code.endsWith(".99")) return null;
    return { ...f, properties: { code } } as Feature<Geometry, { code: string }>;
  })
  .filter((f): f is Feature<Geometry, { code: string }> => f !== null && byCode.has(f.properties.code));

const MAP_W = 1000;
const fc = { type: "FeatureCollection", features } as FeatureCollection<Geometry, { code: string }>;
const projection = geoMercator().fitWidth(MAP_W, fc);
const path = geoPath(projection).digits(1);
const [[, y0], [, y1]] = path.bounds(fc);
// fitWidth memusatkan secara vertikal di sekitar 0; geser agar mulai dari 0.
projection.translate([projection.translate()[0], projection.translate()[1] - y0]);
const MAP_H = Math.ceil(y1 - y0);

const project = (lngLat: [number, number]) => {
  const p = projection(lngLat)!;
  return [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10] as const;
};

const mapRegions = features.map((f) => {
  const r = byCode.get(f.properties.code)!;
  const [cx, cy] = project(r.centroid);
  return { code: r.code, d: path(f) ?? "", cx, cy };
});

/** Kotak pembatas (koordinat peta) untuk sekumpulan kode provinsi. */
function boundsOf(provinceCodes: string[]) {
  const sub = {
    type: "FeatureCollection",
    features: features.filter((f) =>
      provinceCodes.includes(byCode.get(f.properties.code)!.provinceCode),
    ),
  } as FeatureCollection<Geometry, { code: string }>;
  const [[x0, by0], [x1, by1]] = geoPath(projection).bounds(sub);
  return { x: x0, y: by0, w: x1 - x0, h: by1 - by0 };
}

/* ---------- Angka ---------- */

type Counts = Record<AffordabilityBand, number>;

function metricsFor(a: Assumptions, origin?: WageRecord) {
  return new Map(
    regions.map((r) => [
      r.code,
      computeMetrics(r.code, wages.get(r.code)!, costs.get(r.code)!, a, AFFORDABILITY_BANDS, origin),
    ]),
  );
}

function counts(ms: ReturnType<typeof metricsFor>): Counts {
  const c: Counts = { comfortable: 0, manageable: 0, tight: 0, insufficient: 0 };
  for (const m of ms.values()) c[m.band]++;
  return c;
}

const FAMILY_2: Assumptions = { ...DEFAULT_ASSUMPTIONS, householdType: "family", children: 2 };
const FAMILY_2_DUAL: Assumptions = { ...FAMILY_2, dualIncome: true };

const base = metricsFor(DEFAULT_ASSUMPTIONS);
const family = metricsFor(FAMILY_2);
const familyDual = metricsFor(FAMILY_2_DUAL);

// Per daerah cukup simpan upah & total biaya; cakupan untuk gaji berapa pun
// = gaji / biaya, jadi slider di video bisa menghitung ulang 514 daerah
// per frame persis seperti aplikasi.
const perRegion = Object.fromEntries(
  regions.map((r) => [
    r.code,
    {
      umk: wages.get(r.code)!.grossMonthly,
      cost: Math.round(base.get(r.code)!.totalMonthlyCost),
      costFamily2: Math.round(family.get(r.code)!.totalMonthlyCost),
    },
  ]),
);

const salaryCounts = Object.fromEntries(
  [3, 4, 5, 6].map((jt) => [
    jt,
    counts(metricsFor({ ...DEFAULT_ASSUMPTIONS, customIncome: jt * 1_000_000 })),
  ]),
);

function receiptOf(code: string, origin?: WageRecord) {
  const r = byCode.get(code)!;
  const m = computeMetrics(code, wages.get(code)!, costs.get(code)!, DEFAULT_ASSUMPTIONS, AFFORDABILITY_BANDS, origin);
  const total = m.totalMonthlyCost;
  return {
    code,
    label: regionLabel(r),
    province: r.province,
    wage: Math.round(m.wageAmount),
    total: Math.round(total),
    coverage: Math.round(m.coveragePercent * 10) / 10,
    surplus: Math.round(m.surplusOrDeficit),
    band: m.band,
    rows: EXPENSE_CATEGORIES.map((c) => ({
      key: c.key,
      // Sama dengan categoryLabel() untuk profil tanpa anak.
      label: c.key === "education" ? "Pendidikan & kursus" : c.label,
      value: Math.round(m.breakdown[c.key]),
      share: m.breakdown[c.key] / total,
    }))
      .filter((x) => x.value > 0)
      .sort((a, b) => b.value - a.value),
  };
}

const jogja = byLabel("Kota Yogyakarta");
const jaksel = byLabel("Kota Jakarta Selatan");

const numbers = {
  source: "public/data/v2026.1 · src/lib/calculations.ts",
  bands: AFFORDABILITY_BANDS,
  defaultCounts: counts(base),
  familyCounts: counts(family),
  familyDualCounts: counts(familyDual),
  salaryCounts,
  perRegion,
  jogja: receiptOf(jogja.code),
  jogjaWithJakselWage: receiptOf(jogja.code, wages.get(jaksel.code)!),
  jaksel: { code: jaksel.code, label: regionLabel(jaksel), umk: wages.get(jaksel.code)!.grossMonthly },
};

const map = {
  width: MAP_W,
  height: MAP_H,
  java: boundsOf(["31", "32", "33", "34", "35", "36"]),
  pins: {
    jogja: project(jogja.centroid),
    jaksel: project(jaksel.centroid),
  },
  regions: mapRegions,
};

mkdirSync(OUT, { recursive: true });
writeFileSync(`${OUT}/map.json`, JSON.stringify(map));
writeFileSync(`${OUT}/numbers.json`, JSON.stringify(numbers, null, 1));

console.log(`map: ${mapRegions.length} daerah, ${MAP_W}x${MAP_H}`);
console.log("default", numbers.defaultCounts);
console.log("keluarga 2 anak", numbers.familyCounts, "+2 upah", numbers.familyDualCounts);
console.log("gaji", salaryCounts);
console.log("jogja", numbers.jogja.wage, numbers.jogja.total, numbers.jogja.coverage, numbers.jogja.surplus);
console.log("jogja (upah jaksel)", numbers.jogjaWithJakselWage.wage, numbers.jogjaWithJakselWage.coverage, numbers.jogjaWithJakselWage.surplus);
