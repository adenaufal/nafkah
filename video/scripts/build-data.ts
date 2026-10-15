/**
 * Data untuk video, dihitung dari dataset dan kode kalkulasi aplikasi yang
 * sama (src/lib/calculations.ts) supaya setiap angka di video cocok dengan
 * yang tampil di nafkah.adenaufal.com.
 *
 *   npm run data   ->  src/data/map.json, src/data/numbers.json, src/data/update.json
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import {
  AFFORDABILITY_BANDS,
  DEFAULT_ASSUMPTIONS,
  classify,
  computeMetrics,
} from "@/lib/calculations";
import { EXPENSE_CATEGORIES } from "@/data/costs";
import { FAMILY_SUPPORT_LABEL, categoryLabel } from "@/lib/labels";
import { regionLabel } from "@/lib/names";
import { profileSummary } from "@/lib/profile";
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

function receiptOf(code: string, origin?: WageRecord, a: Assumptions = DEFAULT_ASSUMPTIONS) {
  const r = byCode.get(code)!;
  const m = computeMetrics(code, wages.get(code)!, costs.get(code)!, a, AFFORDABILITY_BANDS, origin);
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
    // Sama dengan breakdownRows() di src/state/derived.ts.
    rows: [
      ...EXPENSE_CATEGORIES.map((c) => ({
        key: c.key as string,
        label: categoryLabel(c.key, a),
        value: Math.round(m.breakdown[c.key]),
        share: m.breakdown[c.key] / total,
      })),
      {
        key: "familySupport",
        label: FAMILY_SUPPORT_LABEL,
        value: Math.round(m.familySupport),
        share: m.familySupport / total,
      },
    ]
      .filter((x) => x.value > 0)
      .sort((x, y) => y.value - x.value),
  };
}

const jogja = byLabel("Kota Yogyakarta");
const jaksel = byLabel("Kota Jakarta Selatan");

const numbersSource = "public/data/v2026.1 · src/lib/calculations.ts";

const numbers = {
  source: numbersSource,
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

/* ---------- Update v0.4.0 ---------- */

// Profil awal aplikasi, lalu dua pilihan baru: hunian "Rumah sendiri" dan
// tanggungan keluarga sebesar contoh di aplikasi ("cth. 1.000.000").
const SUPPORT = 1_000_000;
const OWNER: Assumptions = { ...DEFAULT_ASSUMPTIONS, housing: "owner" };
const OWNER_SUPPORT: Assumptions = { ...OWNER, familySupportMonthly: SUPPORT };
const owner = metricsFor(OWNER);
const ownerSupport = metricsFor(OWNER_SUPPORT);

const update = {
  source: numbersSource,
  support: SUPPORT,
  profiles: {
    room: profileSummary(DEFAULT_ASSUMPTIONS),
    owner: profileSummary(OWNER),
    ownerSupport: profileSummary(OWNER_SUPPORT),
  },
  counts: {
    room: counts(base),
    owner: counts(owner),
    ownerSupport: counts(ownerSupport),
  },
  // Cakupan per frame = UMK / biaya; tanggungan menambah SUPPORT ke total
  // setiap daerah, persis seperti computeMetrics.
  perRegion: Object.fromEntries(
    regions.map((r) => [
      r.code,
      {
        umk: wages.get(r.code)!.grossMonthly,
        cost: base.get(r.code)!.totalMonthlyCost,
        costOwner: owner.get(r.code)!.totalMonthlyCost,
      },
    ]),
  ),
  jogja: receiptOf(jogja.code, undefined, OWNER_SUPPORT),
};

// Video mewarnai peta dari perRegion; pastikan hasilnya sama dengan aplikasi.
for (const [name, ms, extra] of [
  ["room", base, 0],
  ["owner", owner, 0],
  ["ownerSupport", ownerSupport, SUPPORT],
] as const) {
  const c: Counts = { comfortable: 0, manageable: 0, tight: 0, insufficient: 0 };
  for (const r of regions) {
    const v = update.perRegion[r.code];
    const cost = (name === "room" ? v.cost : v.costOwner) + extra;
    c[classify((v.umk / cost) * 100, AFFORDABILITY_BANDS)]++;
  }
  const want = counts(ms);
  if (JSON.stringify(c) !== JSON.stringify(want)) {
    throw new Error(`perRegion ${name} ${JSON.stringify(c)} != ${JSON.stringify(want)}`);
  }
}

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
writeFileSync(`${OUT}/update.json`, JSON.stringify(update, null, 1));

console.log(`map: ${mapRegions.length} daerah, ${MAP_W}x${MAP_H}`);
console.log("default", numbers.defaultCounts);
console.log("keluarga 2 anak", numbers.familyCounts, "+2 upah", numbers.familyDualCounts);
console.log("gaji", salaryCounts);
console.log("jogja", numbers.jogja.wage, numbers.jogja.total, numbers.jogja.coverage, numbers.jogja.surplus);
console.log("jogja (upah jaksel)", numbers.jogjaWithJakselWage.wage, numbers.jogjaWithJakselWage.coverage, numbers.jogjaWithJakselWage.surplus);
console.log("v0.4.0 rusun/kost", update.counts.room, "rumah sendiri", update.counts.owner, "+tanggungan", update.counts.ownerSupport);
console.log("v0.4.0 jogja", update.jogja.wage, update.jogja.total, update.jogja.coverage, update.jogja.surplus);
