import { EXPENSE_CATEGORIES } from "@/data/costs";
import { AFFORDABILITY_BANDS } from "./calculations";
import { regionLabel } from "./names";
import type {
  AffordabilityBand,
  ExpenseCategoryKey,
  Region,
  RegionMetrics,
} from "./types";

/**
 * Derived readings shown around the map: national and provincial summaries,
 * how a region's cost lines compare with the national middle, and the income
 * a region needs. Pure functions over RegionMetrics — the numbers follow the
 * active assumptions exactly like the choropleth does.
 */

export interface RankedRegion {
  code: string;
  name: string;
  /** Name with an explicit tier ("Kab. Bandung") for lists. */
  label: string;
  province: string;
  provinceCode: string;
  tier: Region["tier"];
  metric: RegionMetrics;
}

/** Regions with metrics, most to least covered (ties by name, stable). */
export function rankRegions(
  metrics: Map<string, RegionMetrics>,
  regionByCode: Map<string, Region>,
): RankedRegion[] {
  const out: RankedRegion[] = [];
  for (const metric of metrics.values()) {
    const region = regionByCode.get(metric.code);
    if (!region) continue;
    out.push({
      code: metric.code,
      name: region.name,
      label: regionLabel(region),
      province: region.province,
      provinceCode: region.provinceCode,
      tier: region.tier,
      metric,
    });
  }
  return out.sort(
    (a, b) =>
      b.metric.coveragePercent - a.metric.coveragePercent ||
      a.name.localeCompare(b.name, "id"),
  );
}

/** Median that averages the middle pair — same rule as the calibration table. */
export function median(values: readonly number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export interface CoverageSummary {
  counts: Record<AffordabilityBand, number>;
  total: number;
  /** Regions where income covers less than 100% of costs (Ketat + Tak Cukup). */
  below: number;
  /** Regions at or above 100% (Nyaman + Cukup). */
  covered: number;
  medianCoverage: number;
}

export function summarize(
  ranked: readonly Pick<RankedRegion, "metric">[],
): CoverageSummary {
  const counts: Record<AffordabilityBand, number> = {
    comfortable: 0,
    manageable: 0,
    tight: 0,
    insufficient: 0,
  };
  for (const r of ranked) counts[r.metric.band] += 1;
  return {
    counts,
    total: ranked.length,
    below: counts.tight + counts.insufficient,
    covered: counts.comfortable + counts.manageable,
    medianCoverage: median(ranked.map((r) => r.metric.coveragePercent)),
  };
}

/** National median of every cost line under the active assumptions. */
export function categoryMedians(
  metrics: Iterable<RegionMetrics>,
): Record<ExpenseCategoryKey, number> {
  const columns = new Map<ExpenseCategoryKey, number[]>(
    EXPENSE_CATEGORIES.map((c) => [c.key, []]),
  );
  for (const m of metrics) {
    for (const c of EXPENSE_CATEGORIES)
      columns.get(c.key)!.push(m.breakdown[c.key]);
  }
  return Object.fromEntries(
    EXPENSE_CATEGORIES.map((c) => [c.key, median(columns.get(c.key)!)]),
  ) as Record<ExpenseCategoryKey, number>;
}

export interface CategoryDelta {
  key: ExpenseCategoryKey;
  label: string;
  value: number;
  median: number;
  /** value − national median, rupiah. */
  diff: number;
  /** value ÷ median − 1; null when the national median is zero. */
  ratio: number | null;
}

/** Every cost line against the national median, largest rupiah excess first. */
export function categoryDeltas(
  metric: RegionMetrics,
  medians: Record<ExpenseCategoryKey, number>,
): CategoryDelta[] {
  return EXPENSE_CATEGORIES.map((c) => {
    const value = metric.breakdown[c.key];
    const mid = medians[c.key];
    return {
      key: c.key,
      label: c.label,
      value,
      median: mid,
      diff: value - mid,
      ratio: mid > 0 ? value / mid - 1 : null,
    };
  }).sort((a, b) => b.diff - a.diff);
}

/**
 * The cost line that pushes a region furthest above the national middle and
 * the one that helps most. Ranked by rupiah, not percent, so a small line
 * with a large ratio cannot outrank rent; tiny differences are not notable.
 */
export function standoutCategories(
  metric: RegionMetrics,
  medians: Record<ExpenseCategoryKey, number>,
  { minDiff = 100_000, minRatio = 0.1 } = {},
): { heavier: CategoryDelta | null; lighter: CategoryDelta | null } {
  const deltas = categoryDeltas(metric, medians);
  const notable = (d: CategoryDelta) =>
    Math.abs(d.diff) >= minDiff &&
    d.ratio !== null &&
    Math.abs(d.ratio) >= minRatio;
  const heavier = deltas.find((d) => d.diff > 0 && notable(d)) ?? null;
  const lighter =
    [...deltas].reverse().find((d) => d.diff < 0 && notable(d)) ?? null;
  return { heavier, lighter };
}

/** Household income that reaches `coveragePct` of a monthly cost. */
export function incomeFor(
  totalMonthlyCost: number,
  coveragePct: number,
): number {
  return (totalMonthlyCost * coveragePct) / 100;
}

/** Income needed to reach Cukup (100%) and Nyaman (120%). */
export function incomeTargets(totalMonthlyCost: number): {
  enough: number;
  comfortable: number;
} {
  return {
    enough: incomeFor(totalMonthlyCost, AFFORDABILITY_BANDS.manageableAt),
    comfortable: incomeFor(totalMonthlyCost, AFFORDABILITY_BANDS.comfortableAt),
  };
}

export interface ProvinceSummary extends CoverageSummary {
  provinceCode: string;
  province: string;
  /** Share of the province's regions below 100%, 0–1. */
  shareBelow: number;
  codes: string[];
}

/** Provinces ordered from heaviest (largest share below 100%) to lightest. */
export function provinceSummaries(
  ranked: readonly RankedRegion[],
): ProvinceSummary[] {
  const groups = new Map<string, RankedRegion[]>();
  for (const r of ranked) {
    const list = groups.get(r.provinceCode);
    if (list) list.push(r);
    else groups.set(r.provinceCode, [r]);
  }
  return [...groups.values()]
    .map((list) => {
      const summary = summarize(list);
      return {
        ...summary,
        provinceCode: list[0].provinceCode,
        province: list[0].province,
        shareBelow: summary.total ? summary.below / summary.total : 0,
        codes: list.map((r) => r.code),
      };
    })
    .sort(
      (a, b) =>
        b.shareBelow - a.shareBelow ||
        a.medianCoverage - b.medianCoverage ||
        a.province.localeCompare(b.province, "id"),
    );
}

/** Linear-interpolated quantile (q in 0–1) of an unsorted list. */
export function quantile(values: readonly number[], q: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * Math.min(1, Math.max(0, q));
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

/**
 * Stops for the cost/wage colour ramp: the 10th, 50th and 90th percentile of
 * what is on the map right now, so the ramp stays readable for any profile
 * (a family's costs would saturate fixed stops). Strictly increasing, as
 * MapLibre's interpolate expression requires.
 */
export function valueStops(
  values: readonly number[],
): [number, number, number] {
  if (values.length === 0) return [0, 1, 2];
  const lo = quantile(values, 0.1);
  const mid = Math.max(quantile(values, 0.5), lo + 1);
  const hi = Math.max(quantile(values, 0.9), mid + 1);
  return [lo, mid, hi];
}

export interface NationalMedians {
  categories: Record<ExpenseCategoryKey, number>;
  totalCost: number;
  /** Median regional wage under the active basis (UMK, take-home, ×2). */
  regionalWage: number;
}

export function nationalMedians(
  metrics: Iterable<RegionMetrics>,
): NationalMedians {
  const list = [...metrics];
  return {
    categories: categoryMedians(list),
    totalCost: median(list.map((m) => m.totalMonthlyCost)),
    regionalWage: median(list.map((m) => m.regionalWageAmount)),
  };
}

/** Difference from a median, in rupiah and as a ratio (null if median is 0). */
export function versusMedian(
  value: number,
  mid: number,
): { diff: number; ratio: number | null } {
  return { diff: value - mid, ratio: mid > 0 ? value / mid - 1 : null };
}

/**
 * "Ke-21 paling lega dari 514 · ke-2 di provinsinya" — counted from the
 * nearer end, so the 492nd region reads "Ke-23 paling berat" instead of a
 * bare number whose direction the reader has to guess.
 */
export function rankPhrase(
  rank: number,
  total: number,
  provinceRank = 0,
  provinceTotal = 0,
): string {
  const fromTop = rank <= total - rank + 1;
  const n = fromTop ? rank : total - rank + 1;
  const end = fromTop ? "lega" : "berat";
  let text =
    n === 1
      ? `Paling ${end} dari ${total}`
      : `Ke-${n} paling ${end} dari ${total}`;
  if (provinceRank > 0 && provinceTotal > 1) {
    const p = fromTop ? provinceRank : provinceTotal - provinceRank + 1;
    text +=
      p === 1 ? ` · paling ${end} di provinsinya` : ` · ke-${p} di provinsinya`;
  }
  return text;
}
