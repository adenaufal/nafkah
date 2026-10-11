import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { EXPENSE_CATEGORIES } from "@/data/costs";
import { sensitivityTable, type SensitivityRow } from "@/lib/calibration";
import { median } from "@/lib/insights";
import { wageKind } from "@/lib/wages";
import type {
  Confidence,
  CostProfile,
  ExpenseCategoryKey,
  Region,
  WageRecord,
} from "@/lib/types";

/**
 * Build-time facts for the Metode page and the booklet, read straight from
 * the versioned dataset that ships (server only — node:fs). Nothing here is
 * typed in by hand: if the data changes, the pages change with the next
 * build.
 */

const DIR = resolve("public/data/v2026.1");
const read = <T>(name: string): T =>
  JSON.parse(readFileSync(resolve(DIR, name), "utf8")) as T;

export interface ShippedDataset {
  manifest: { datasetVersion: string; generatedAt: string };
  regions: Region[];
  wages: WageRecord[];
  costs: CostProfile[];
}

let shipped: ShippedDataset | null = null;

/** The dataset files that ship with the site, read once per build. */
export function shippedDataset(): ShippedDataset {
  shipped ??= {
    manifest: read("manifest.json"),
    regions: read("regions.json"),
    wages: read("wages.json"),
    costs: read("costs.json"),
  };
  return shipped;
}

export interface CategorySource {
  key: ExpenseCategoryKey;
  label: string;
  /** Distinct provenance entries across regions, most common first. */
  sources: {
    source: string;
    confidence: Confidence;
    asOf: string;
    regions: number;
  }[];
}

export interface ProvinceWageSource {
  province: string;
  sources: { source: string; regions: number }[];
}

export interface MethodFacts {
  datasetVersion: string;
  generatedAt: string;
  regionCount: number;
  provinceCount: number;
  kotaCount: number;
  kabupatenCount: number;
  wage: {
    min: number;
    median: number;
    max: number;
    asOf: string[];
    allOfficial: boolean;
    /** Take-home ÷ gross, if the same everywhere (else null). */
    takeHomeShare: number | null;
    /** Regions on their own UMK vs the provincial UMP. */
    umk: number;
    ump: number;
  };
  categories: CategorySource[];
  wageSources: ProvinceWageSource[];
  sensitivity: SensitivityRow[];
}

export function methodFacts(): MethodFacts {
  const { manifest, regions, wages, costs } = shippedDataset();
  const byCode = new Map(regions.map((r) => [r.code, r]));

  const categories = EXPENSE_CATEGORIES.map((c) => {
    const seen = new Map<string, CategorySource["sources"][number]>();
    for (const profile of costs) {
      const cell = profile.baseline[c.key];
      const id = `${cell.source}|${cell.confidence}|${cell.asOf}`;
      const entry = seen.get(id);
      if (entry) entry.regions += 1;
      else
        seen.set(id, {
          source: cell.source,
          confidence: cell.confidence,
          asOf: cell.asOf,
          regions: 1,
        });
    }
    return {
      key: c.key,
      label: c.label,
      sources: [...seen.values()].sort((a, b) => b.regions - a.regions),
    };
  });

  const provinces = new Map<string, Map<string, number>>();
  for (const w of wages) {
    const province = byCode.get(w.regionCode)?.province ?? "—";
    const list = provinces.get(province) ?? new Map<string, number>();
    list.set(w.source, (list.get(w.source) ?? 0) + 1);
    provinces.set(province, list);
  }
  const wageSources = [...provinces.entries()]
    .map(([province, list]) => ({
      province,
      sources: [...list.entries()]
        .map(([source, n]) => ({ source, regions: n }))
        .sort((a, b) => b.regions - a.regions),
    }))
    .sort((a, b) => a.province.localeCompare(b.province, "id"));

  const gross = wages.map((w) => w.grossMonthly);
  const shares = new Set(
    wages.map((w) =>
      Math.round((w.estimatedTakeHomeMonthly / w.grossMonthly) * 1000),
    ),
  );

  return {
    datasetVersion: manifest.datasetVersion,
    generatedAt: manifest.generatedAt,
    regionCount: regions.length,
    provinceCount: new Set(regions.map((r) => r.provinceCode)).size,
    kotaCount: regions.filter((r) => r.tier === "kota").length,
    kabupatenCount: regions.filter((r) => r.tier === "kabupaten").length,
    wage: {
      min: Math.min(...gross),
      median: median(gross),
      max: Math.max(...gross),
      asOf: [...new Set(wages.map((w) => w.asOf))].sort(),
      allOfficial: wages.every((w) => w.confidence === "official"),
      takeHomeShare: shares.size === 1 ? [...shares][0] / 1000 : null,
      umk: wages.filter((w) => wageKind(w) === "UMK").length,
      ump: wages.filter((w) => wageKind(w) === "UMP").length,
    },
    categories,
    wageSources,
    sensitivity: sensitivityTable(
      regions.map((r) => r.code),
      new Map(wages.map((w) => [w.regionCode, w])),
      new Map(costs.map((c) => [c.regionCode, c])),
    ),
  };
}
