"use client";

import { useMemo } from "react";
import { useApp } from "@/state/AppContext";
import { regionLabel } from "@/lib/names";

export interface SearchHit {
  code: string;
  name: string;
  /** Name with explicit tier: "Kab. Bandung" / "Kota Bandung". */
  label: string;
  province: string;
  tier: string;
}

/** Lowercase and drop the "kab."/"kabupaten" prefix people often type. */
function normalise(q: string): string {
  return q
    .trim()
    .toLowerCase()
    .replace(/^(kabupaten|kab\.?)\s+/, "");
}

/**
 * Ranked type-ahead over region names and provinces: name prefix, then word
 * prefix ("bandung" → "Kota Bandung"), then substring, then province.
 * "kab bandung" narrows to the kabupaten, "kota bandung" to the city.
 */
export function useRegionSearch(query: string, limit = 8): SearchHit[] {
  const { state } = useApp();
  const index = useMemo(
    () =>
      state.regions.map((r) => ({
        hit: {
          code: r.code,
          name: r.name,
          label: regionLabel(r),
          province: r.province,
          tier: r.tier,
        },
        n: r.name.toLowerCase(),
        p: r.province.toLowerCase(),
        kab: r.tier === "kabupaten",
      })),
    [state.regions],
  );
  return useMemo(() => {
    const raw = query.trim().toLowerCase();
    if (!raw) return [];
    const wantsKab = /^(kabupaten|kab\.?)\s+/.test(raw);
    const q = normalise(raw);
    if (!q) return [];
    const scored: { hit: SearchHit; score: number }[] = [];
    for (const r of index) {
      if (wantsKab && !r.kab) continue;
      let score = -1;
      if (r.n.startsWith(q)) score = 0;
      else if (r.n.split(/\s+/).some((w) => w.startsWith(q))) score = 1;
      else if (r.n.includes(q)) score = 2;
      else if (r.p.includes(q)) score = 3;
      if (score >= 0)
        scored.push({ hit: r.hit, score: score * 1000 + r.n.length });
    }
    return scored
      .sort((a, b) => a.score - b.score)
      .slice(0, limit)
      .map((s) => s.hit);
  }, [index, query, limit]);
}
