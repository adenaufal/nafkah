import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Topology } from "topojson-specification";
import pkg from "../../package.json";
import { shippedDataset } from "./buildTime";
import { EXPENSE_CATEGORIES } from "./costs";
import { computeAllMetrics, DEFAULT_ASSUMPTIONS } from "@/lib/calculations";
import { sensitivityTable, type SensitivityRow } from "@/lib/calibration";
import {
  incomeTargets,
  median,
  nationalMedians,
  provinceSummaries,
  rankRegions,
  summarize,
  type CoverageSummary,
  type ProvinceSummary,
  type RankedRegion,
} from "@/lib/insights";
import { categoryLabel, wageLabel } from "@/lib/labels";
import { householdNoun, profileSummary } from "@/lib/profile";
import {
  borderPaths,
  classPaths,
  prepareMap,
  type Point,
} from "@/lib/svgMap";
import { wageKind, type WageKind } from "@/lib/wages";
import type {
  AffordabilityBand,
  Assumptions,
  ExpenseCategoryKey,
  RegionTier,
} from "@/lib/types";

/**
 * Everything the booklet prints, computed at build time from the dataset
 * that ships and the calculation code the map runs (server only). The
 * booklet has no hand-typed figures: if the data changes, the booklet
 * changes with the next build.
 */

export interface BookletRegion {
  code: string;
  /** "Kab. Bekasi" / "Kota Bandung". */
  label: string;
  province: string;
  provinceCode: string;
  tier: RegionTier;
  /** Gross UMK/UMP per month. */
  wage: number;
  wageKind: WageKind;
  /** Monthly cost of living for the default profile. */
  cost: number;
  coverage: number;
  band: AffordabilityBand;
  /** wage − cost; negative is a shortfall. */
  surplus: number;
}

export interface HouseholdScenario {
  id: string;
  /** "Keluarga dengan 2 anak, satu upah minimum". */
  title: string;
  /** "keluarga dengan 2 anak". */
  noun: string;
  /** Minimum wages earned: "satu" / "dua". */
  earners: string;
  note: string;
  summary: CoverageSummary;
  /** National medians for this household: monthly cost and income. */
  medianCost: number;
  medianIncome: number;
  /** Map fill per band, on the coarse map for small multiples. */
  fills: Partial<Record<AffordabilityBand, string>>;
}

export type ProvinceRow = Pick<
  ProvinceSummary,
  | "provinceCode"
  | "province"
  | "counts"
  | "total"
  | "below"
  | "shareBelow"
  | "medianCoverage"
>;

export interface ReceiptLine {
  key: ExpenseCategoryKey;
  label: string;
  amount: number;
  /** Share of the monthly total, 0–1. */
  share: number;
}

export interface BookletMap {
  width: number;
  height: number;
  project: (lngLat: Point) => Point;
  /** Detailed map, default profile. */
  fills: Partial<Record<AffordabilityBand, string>>;
  regionBorders: string;
  provinceBorders: string;
}

export interface BookletFacts {
  datasetVersion: string;
  generatedAt: string;
  appVersion: string;
  /** Year of the minimum wages (UMK/UMP 2026). */
  wageYear: number;
  regionCount: number;
  provinceCount: number;
  kotaCount: number;
  kabupatenCount: number;
  /** "lajang · standar · rusun/kost · motor · +tabungan". */
  profile: string;
  /** "lajang" — for headline sentences. */
  noun: string;
  national: CoverageSummary;
  medianWage: number;
  medianCost: number;
  /** Regions below 100% with the same profile minus the savings line. */
  belowWithoutSavings: number;
  /** Median monthly shortfall among the regions below 100%. */
  medianShortfall: number;
  tiers: { kota: CoverageSummary; kabupaten: CoverageSummary };
  /** All regions, most to least covered. */
  ranked: BookletRegion[];
  /** Heaviest province (largest share below 100%) first. */
  provinces: ProvinceRow[];
  cheapest: BookletRegion;
  priciest: BookletRegion;
  example: {
    region: BookletRegion;
    /** "UMK" / "UMP" — what the income line is. */
    wageText: string;
    lines: ReceiptLine[];
    /** Income that reaches Cukup (100%) and Nyaman (120%). */
    targets: { enough: number; comfortable: number };
  };
  households: HouseholdScenario[];
  sensitivity: SensitivityRow[];
  cities: BookletRegion[];
  map: BookletMap;
}

/**
 * Cities for the same-salary comparison: large cities spread across the
 * archipelago. An editorial pick; the test pins each code to its name.
 */
export const BOOKLET_CITY_CODES = [
  "31.73", // Kota Jakarta Pusat
  "35.78", // Kota Surabaya
  "32.73", // Kota Bandung
  "12.75", // Kota Medan
  "33.74", // Kota Semarang
  "73.71", // Kota Makassar
  "21.71", // Kota Batam
  "16.71", // Kota Palembang
  "51.71", // Kota Denpasar
  "34.71", // Kota Yogyakarta
  "64.71", // Kota Balikpapan
  "94.71", // Kota Jayapura
  "14.71", // Kota Pekanbaru
  "61.71", // Kota Pontianak
  "71.71", // Kota Manado
  "53.71", // Kota Kupang
] as const;

/** Household comparisons: one axis at a time away from the default. */
const HOUSEHOLDS: {
  id: string;
  overrides: Partial<Assumptions>;
  note: string;
}[] = [
  { id: "lajang", overrides: {}, note: "Pilihan awal peta." },
  {
    id: "pasangan-dua-upah",
    overrides: { householdType: "couple", dualIncome: true },
    note: "Keduanya bekerja dengan upah minimum daerah yang sama.",
  },
  {
    id: "keluarga-satu-upah",
    overrides: { householdType: "family", children: 2 },
    note: "Satu orang bekerja dengan upah minimum.",
  },
  {
    id: "keluarga-dua-upah",
    overrides: { householdType: "family", children: 2, dualIncome: true },
    note: "Kedua orang tua bekerja dengan upah minimum.",
  },
];

/* Map detail. Units are 1/2000 of the map width. */
const MAP_WIDTH = 2000;
const DETAIL = { tolerance: 0.8, minArea: 2 };
const SMALL = { tolerance: 3, minArea: 12 };

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

let cached: BookletFacts | null = null;

export function bookletFacts(): BookletFacts {
  if (cached) return cached;
  const { manifest, regions, wages, costs } = shippedDataset();
  const codes = regions.map((r) => r.code);
  const byCode = new Map(regions.map((r) => [r.code, r]));
  const wageBy = new Map(wages.map((w) => [w.regionCode, w]));
  const costBy = new Map(costs.map((c) => [c.regionCode, c]));
  const a = DEFAULT_ASSUMPTIONS;

  const rankedFor = (assumptions: Assumptions) =>
    rankRegions(
      computeAllMetrics(codes, wageBy, costBy, assumptions),
      byCode,
    );
  const ranked = rankedFor(a);

  const toRow = (r: RankedRegion): BookletRegion => ({
    code: r.code,
    label: r.label,
    province: r.province,
    provinceCode: r.provinceCode,
    tier: r.tier,
    wage: r.metric.wageAmount,
    wageKind: wageKind(wageBy.get(r.code)),
    cost: r.metric.totalMonthlyCost,
    coverage: r.metric.coveragePercent,
    band: r.metric.band,
    surplus: r.metric.surplusOrDeficit,
  });
  const rows = ranked.map(toRow);
  const rowBy = new Map(rows.map((r) => [r.code, r]));
  const medians = nationalMedians(ranked.map((r) => r.metric));
  const byCost = [...rows].sort((x, y) => x.cost - y.cost);

  const middle = ranked[Math.floor(ranked.length / 2)];
  const exampleTotal = middle.metric.totalMonthlyCost;

  // One boundary file, two levels of detail: the large maps, and the
  // small multiples where finer detail would only add bytes.
  const topology = JSON.parse(
    readFileSync(resolve("public/data/regions.topojson"), "utf8"),
  ) as Topology;
  const detailed = prepareMap(topology, {
    width: MAP_WIDTH,
    tolerance: DETAIL.tolerance,
  });
  const coarse = prepareMap(topology, {
    width: MAP_WIDTH,
    tolerance: SMALL.tolerance,
  });
  const borders = borderPaths(detailed);
  const bandOf = (list: RankedRegion[]) => {
    const band = new Map(list.map((r) => [r.code, r.metric.band]));
    return (code: string) => band.get(code) ?? null;
  };

  cached = {
    datasetVersion: manifest.datasetVersion,
    generatedAt: manifest.generatedAt,
    appVersion: pkg.version,
    wageYear: Math.max(...wages.map((w) => w.year)),
    regionCount: regions.length,
    provinceCount: new Set(regions.map((r) => r.provinceCode)).size,
    kotaCount: regions.filter((r) => r.tier !== "kabupaten").length,
    kabupatenCount: regions.filter((r) => r.tier === "kabupaten").length,
    profile: profileSummary(a),
    noun: householdNoun(a),
    national: summarize(ranked),
    medianWage: medians.regionalWage,
    medianCost: medians.totalCost,
    belowWithoutSavings: summarize(rankedFor({ ...a, includeSavings: false }))
      .below,
    medianShortfall: median(
      rows.filter((r) => r.surplus < 0).map((r) => -r.surplus),
    ),
    tiers: {
      kota: summarize(ranked.filter((r) => r.tier !== "kabupaten")),
      kabupaten: summarize(ranked.filter((r) => r.tier === "kabupaten")),
    },
    ranked: rows,
    provinces: provinceSummaries(ranked).map(
      ({
        provinceCode,
        province,
        counts,
        total,
        below,
        shareBelow,
        medianCoverage,
      }) => ({
        provinceCode,
        province,
        counts,
        total,
        below,
        shareBelow,
        medianCoverage,
      }),
    ),
    cheapest: byCost[0],
    priciest: byCost[byCost.length - 1],
    example: {
      region: toRow(middle),
      wageText: wageLabel(middle.metric, a, wageKind(wageBy.get(middle.code))),
      lines: EXPENSE_CATEGORIES.map((c) => ({
        key: c.key,
        label: categoryLabel(c.key, a),
        amount: middle.metric.breakdown[c.key],
        share: middle.metric.breakdown[c.key] / exampleTotal,
      }))
        .filter((l) => l.amount > 0)
        .sort((x, y) => y.amount - x.amount),
      targets: incomeTargets(exampleTotal),
    },
    households: HOUSEHOLDS.map(({ id, overrides, note }) => {
      const assumptions = { ...a, ...overrides };
      const list = rankedFor(assumptions);
      const earners =
        assumptions.dualIncome && assumptions.householdType !== "single"
          ? "dua"
          : "satu";
      const noun = householdNoun(assumptions);
      const mid = nationalMedians(list.map((r) => r.metric));
      return {
        id,
        title: `${capitalize(noun)}, ${earners} upah minimum`,
        noun,
        earners,
        note,
        summary: summarize(list),
        medianCost: mid.totalCost,
        medianIncome: mid.regionalWage,
        fills: classPaths(coarse, bandOf(list), SMALL.minArea),
      };
    }),
    sensitivity: sensitivityTable(codes, wageBy, costBy),
    cities: BOOKLET_CITY_CODES.flatMap((code) => {
      const row = rowBy.get(code);
      return row ? [row] : [];
    }),
    map: {
      width: detailed.width,
      height: detailed.height,
      project: detailed.project,
      fills: classPaths(detailed, bandOf(ranked), DETAIL.minArea),
      regionBorders: borders.regions,
      provinceBorders: borders.provinces,
    },
  };
  return cached;
}
