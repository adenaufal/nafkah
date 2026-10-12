"use client";

import { useMemo, useState } from "react";
import { EXPENSE_CATEGORIES } from "@/data/costs";
import { AFFORDABILITY_BANDS, computeAllMetrics } from "@/lib/calculations";
import {
  buildComparisonCsv,
  downloadCsv,
  type ComparisonExportRow,
} from "@/lib/export";
import {
  median,
  nationalMedians,
  rankRegions,
  summarize,
  type RankedRegion,
} from "@/lib/insights";
import { categoryLabel, FAMILY_SUPPORT_LABEL } from "@/lib/labels";
import { regionLabel, regionTitle } from "@/lib/names";
import { profileSummary } from "@/lib/profile";
import { recordUsage } from "@/lib/usage";
import type {
  Assumptions,
  ExpenseCategoryKey,
  HouseholdType,
  Provenance,
  Region,
} from "@/lib/types";
import manifest from "../../public/data/v2026.1/manifest.json";
import { useApp } from "./AppContext";

/**
 * Read-only derivations shared by the Atlas shell and the Metode page.
 * Everything recomputes from AppContext, so it follows the active
 * assumptions exactly like the map does.
 */

/** Ranked regions + band counts under the active assumptions. */
export function useRanking() {
  const { metrics, metricsReady, regionByCode } = useApp();
  return useMemo(() => {
    const ranked: RankedRegion[] = metricsReady
      ? rankRegions(metrics, regionByCode)
      : [];
    return {
      ready: metricsReady && ranked.length > 0,
      ranked,
      ...summarize(ranked),
    };
  }, [metrics, metricsReady, regionByCode]);
}

/** National medians (cost lines, total cost, wage); null until data is ready. */
export function useNationalMedians() {
  const { metrics, metricsReady } = useApp();
  return useMemo(
    () =>
      metricsReady && metrics.size ? nationalMedians(metrics.values()) : null,
    [metrics, metricsReady],
  );
}

/** Median regional wage for the active basis — a neutral salary seed. */
export function useMedianWage(): number | null {
  const { state, metricsReady } = useApp();
  const basis = state.assumptions.wageBasis;
  return useMemo(() => {
    if (!metricsReady || !state.wages.size) return null;
    return median(
      [...state.wages.values()].map((w) =>
        basis === "gross" ? w.grossMonthly : w.estimatedTakeHomeMonthly,
      ),
    );
  }, [state.wages, metricsReady, basis]);
}

export function useRegionDetail(code: string | null) {
  const { state, metrics, metricsReady, regionByCode } = useApp();
  if (!code) return null;
  const region = regionByCode.get(code);
  const feature = region
    ? undefined
    : state.geometry?.features.find((f) => f.properties.kode === code);
  const metric = metricsReady ? metrics.get(code) : undefined;
  const wage = state.wages.get(code);
  const costs = state.costs.get(code);
  const narrative = state.narratives.get(code);
  const originRegion = state.originCode
    ? regionByCode.get(state.originCode)
    : undefined;
  const wageProvenance =
    metric?.wageSource === "origin" && state.originCode
      ? (state.wages.get(state.originCode) ?? wage)
      : wage;
  const named: Pick<Region, "name" | "tier"> = region ?? {
    name: feature?.properties.name ?? code,
    tier: "kabupaten",
  };
  return {
    code,
    name: named.name,
    label: region ? regionLabel(region) : named.name,
    title: region ? regionTitle(region) : named.name,
    province: region?.province ?? feature?.properties.province ?? "",
    provinceCode: region?.provinceCode ?? code.slice(0, 2),
    tier: region?.tier ?? "",
    region,
    metric,
    wage,
    costs,
    narrative,
    originRegion,
    wageProvenance,
    isPinned: state.pinned.includes(code),
    isOrigin: state.originCode === code,
    hasData: Boolean(metric && wage && costs),
  };
}

export type RegionDetail = NonNullable<ReturnType<typeof useRegionDetail>>;

/** A cost line: one of the 10 dataset categories, or the user's family support. */
export type CostLineKey = ExpenseCategoryKey | "familySupport";

export interface BreakdownRow {
  key: CostLineKey;
  label: string;
  value: number;
  /** Share of the monthly total, 0–1. */
  share: number;
  /** null = the user's own number, not the dataset. */
  provenance: Provenance | null;
}

/** Cost lines with provenance, largest first; zero lines are dropped. */
export function breakdownRows(
  detail: RegionDetail,
  a: Assumptions,
): BreakdownRow[] {
  const m = detail.metric;
  const costs = detail.costs;
  if (!m || !costs) return [];
  const total = m.totalMonthlyCost || 1;
  const rows: BreakdownRow[] = EXPENSE_CATEGORIES.map((c) => ({
    key: c.key,
    label: categoryLabel(c.key, a),
    value: m.breakdown[c.key],
    share: m.breakdown[c.key] / total,
    provenance: costs.baseline[c.key],
  }));
  rows.push({
    key: "familySupport",
    label: FAMILY_SUPPORT_LABEL,
    value: m.familySupport,
    share: m.familySupport / total,
    provenance: null,
  });
  return rows.filter((r) => r.value > 0).sort((a, b) => b.value - a.value);
}

/**
 * How many regions fall below 100% under the active assumptions with some
 * of them overridden — e.g. without the savings allowance. null until data
 * is ready.
 */
export function useBelowWith(overrides: Partial<Assumptions>): number | null {
  const { state, metricsReady } = useApp();
  const key = JSON.stringify(overrides);
  return useMemo(() => {
    if (!metricsReady) return null;
    const metrics = computeAllMetrics(
      state.regions.map((r) => r.code),
      state.wages,
      state.costs,
      { ...state.assumptions, ...overrides },
      AFFORDABILITY_BANDS,
      state.originCode ? state.wages.get(state.originCode) : undefined,
    );
    let below = 0;
    for (const m of metrics.values()) {
      if (m.coveragePercent < AFFORDABILITY_BANDS.manageableAt) below += 1;
    }
    return below;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    metricsReady,
    state.regions,
    state.wages,
    state.costs,
    state.assumptions,
    state.originCode,
    key,
  ]);
}

/** Assumption setters shared by every control. */
export function useAssumptionActions() {
  const { state, setAssumptions, resetAssumptions } = useApp();
  const a = state.assumptions;
  const set = <K extends keyof Assumptions>(k: K, v: Assumptions[K]) =>
    setAssumptions({ ...a, [k]: v });
  // Picking "Keluarga" fills two children if none are set yet.
  const setHousehold = (v: HouseholdType) =>
    v === "family" && a.children === 0
      ? setAssumptions({ ...a, householdType: "family", children: 2 })
      : set("householdType", v);
  return { a, set, setHousehold, reset: resetAssumptions };
}

/** Pinned regions with metrics, plus the CSV export of exactly what is shown. */
export function useComparison() {
  const { state, metrics, regionByCode } = useApp();
  const [exportStatus, setExportStatus] = useState<"idle" | "done" | "error">(
    "idle",
  );
  const items = state.pinned.flatMap((code) => {
    const metric = metrics.get(code);
    const region = regionByCode.get(code);
    return metric && region ? [{ code, metric, region }] : [];
  });

  const exportCsv = () => {
    const origin = state.originCode
      ? regionByCode.get(state.originCode)
      : undefined;
    const rows: ComparisonExportRow[] = items.flatMap(
      ({ code, metric, region }) => {
        const wage = state.wages.get(code);
        const costs = state.costs.get(code);
        if (!wage || !costs) return [];
        return [
          {
            region,
            metrics: metric,
            wage,
            costs,
            originWage: state.originCode
              ? state.wages.get(state.originCode)
              : undefined,
          },
        ];
      },
    );
    if (!rows.length) return;
    try {
      const csv = buildComparisonCsv({
        rows,
        assumptions: state.assumptions,
        datasetVersion: manifest.datasetVersion,
        origin,
      });
      downloadCsv(
        csv,
        `nafkah-perbandingan-${new Date().toISOString().slice(0, 10)}.csv`,
      );
      recordUsage("csv_exported");
      setExportStatus("done");
      window.setTimeout(() => setExportStatus("idle"), 2400);
    } catch {
      setExportStatus("error");
    }
  };

  return {
    items,
    exportCsv,
    exportStatus,
    summary: profileSummary(state.assumptions),
  };
}
