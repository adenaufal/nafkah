import { describe, expect, it } from "vitest";
import { classify, AFFORDABILITY_BANDS } from "./calculations";
import {
  categoryDeltas,
  categoryMedians,
  incomeTargets,
  median,
  provinceSummaries,
  rankRegions,
  standoutCategories,
  summarize,
  valueStops,
  nationalMedians,
  versusMedian,
  rankPhrase,
} from "./insights";
import type { ExpenseCategoryKey, Region, RegionMetrics } from "./types";

const ZERO: Record<ExpenseCategoryKey, number> = {
  housing: 0,
  food: 0,
  transport: 0,
  utilities: 0,
  connectivity: 0,
  healthcare: 0,
  personalCare: 0,
  leisure: 0,
  education: 0,
  contingency: 0,
};

function metric(
  code: string,
  wage: number,
  breakdown: Partial<Record<ExpenseCategoryKey, number>>,
): RegionMetrics {
  const full = { ...ZERO, ...breakdown };
  const total = Object.values(full).reduce((s, v) => s + v, 0);
  const coverage = (wage / total) * 100;
  return {
    code,
    wageAmount: wage,
    regionalWageAmount: wage,
    wageSource: "region",
    partnerWageSource: null,
    totalMonthlyCost: total,
    coveragePercent: coverage,
    surplusOrDeficit: wage - total,
    affordabilityRatio: total / wage,
    band: classify(coverage, AFFORDABILITY_BANDS),
    breakdown: full,
    familySupport: 0,
  };
}

function region(
  code: string,
  name: string,
  provinceCode: string,
  tier: Region["tier"] = "kabupaten",
): Region {
  return {
    code,
    name,
    province: `Provinsi ${provinceCode}`,
    provinceCode,
    centroid: [0, 0],
    tier,
  };
}

const regions = [
  region("01.01", "Alpha", "01"),
  region("01.71", "Kota Alpha", "01", "kota"),
  region("02.01", "Beta", "02"),
  region("02.02", "Gamma", "02"),
];
const byCode = new Map(regions.map((r) => [r.code, r]));
const metrics = new Map([
  // 125% → Nyaman
  ["01.01", metric("01.01", 2_500_000, { housing: 800_000, food: 1_200_000 })],
  // 75% → Tak Cukup
  [
    "01.71",
    metric("01.71", 3_000_000, { housing: 2_400_000, food: 1_600_000 }),
  ],
  // 90% → Ketat
  [
    "02.01",
    metric("02.01", 2_700_000, { housing: 1_000_000, food: 2_000_000 }),
  ],
  // 100% → Cukup
  [
    "02.02",
    metric("02.02", 3_000_000, { housing: 1_200_000, food: 1_800_000 }),
  ],
]);

describe("median", () => {
  it("averages the middle pair for even counts", () => {
    expect(median([4, 1, 3, 2])).toBe(2.5);
    expect(median([5, 1, 3])).toBe(3);
    expect(median([])).toBe(0);
  });
});

describe("rankRegions + summarize", () => {
  const ranked = rankRegions(metrics, byCode);

  it("orders by coverage and labels kabupaten explicitly", () => {
    expect(ranked.map((r) => r.code)).toEqual([
      "01.01",
      "02.02",
      "02.01",
      "01.71",
    ]);
    expect(ranked[0].label).toBe("Kab. Alpha");
    expect(ranked[3].label).toBe("Kota Alpha");
  });

  it("counts bands and regions below 100%", () => {
    const s = summarize(ranked);
    expect(s.counts).toEqual({
      comfortable: 1,
      manageable: 1,
      tight: 1,
      insufficient: 1,
    });
    expect(s.total).toBe(4);
    expect(s.below).toBe(2);
    expect(s.covered).toBe(2);
    expect(s.medianCoverage).toBeCloseTo((100 + 90) / 2);
  });
});

describe("category comparison", () => {
  const medians = categoryMedians(metrics.values());

  it("takes the national median per cost line", () => {
    expect(medians.housing).toBe((1_000_000 + 1_200_000) / 2);
    expect(medians.food).toBe((1_600_000 + 1_800_000) / 2);
    expect(medians.education).toBe(0);
  });

  it("ranks lines by rupiah above the median", () => {
    const deltas = categoryDeltas(metrics.get("01.71")!, medians);
    expect(deltas[0].key).toBe("housing");
    expect(deltas[0].diff).toBe(2_400_000 - 1_100_000);
    expect(deltas[0].ratio).toBeCloseTo(2_400_000 / 1_100_000 - 1);
    expect(deltas.find((d) => d.key === "education")!.ratio).toBeNull();
  });

  it("names the heaviest and lightest notable lines", () => {
    const { heavier, lighter } = standoutCategories(
      metrics.get("01.01")!,
      medians,
    );
    expect(heavier).toBeNull();
    expect(lighter?.key).toBe("food");

    const expensive = standoutCategories(metrics.get("01.71")!, medians);
    expect(expensive.heavier?.key).toBe("housing");
    expect(expensive.lighter).toBeNull();
  });

  it("ignores differences below the rupiah threshold", () => {
    const close = metric("09.01", 3_000_000, {
      housing: 1_150_000,
      food: 1_700_000,
    });
    expect(standoutCategories(close, medians)).toEqual({
      heavier: null,
      lighter: null,
    });
  });
});

describe("incomeTargets", () => {
  it("returns the income for Cukup and Nyaman thresholds", () => {
    expect(incomeTargets(3_660_000)).toEqual({
      enough: 3_660_000,
      comfortable: 3_660_000 * 1.2,
    });
  });
});

describe("provinceSummaries", () => {
  it("orders provinces by the share of regions below 100%", () => {
    const list = provinceSummaries(rankRegions(metrics, byCode));
    // Tie on share (1 of 2 each): the lower median coverage reads as heavier.
    expect(list.map((p) => [p.provinceCode, p.shareBelow])).toEqual([
      ["02", 0.5],
      ["01", 0.5],
    ]);
    expect(list[0].medianCoverage).toBeCloseTo(95);
    expect(list[1].medianCoverage).toBeCloseTo(100);
    expect(list[1].codes).toEqual(["01.01", "01.71"]);
  });
});

describe("valueStops", () => {
  it("uses the 10th, 50th and 90th percentile", () => {
    const values = Array.from({ length: 11 }, (_, i) => i * 100);
    expect(valueStops(values)).toEqual([100, 500, 900]);
  });

  it("stays strictly increasing for flat data", () => {
    const [a, b, c] = valueStops([5, 5, 5]);
    expect(a).toBeLessThan(b);
    expect(b).toBeLessThan(c);
  });
});

describe("nationalMedians + versusMedian", () => {
  it("summarises totals and wages next to the category medians", () => {
    const med = nationalMedians(metrics.values());
    expect(med.totalCost).toBe((3_000_000 + 3_000_000) / 2);
    expect(med.regionalWage).toBe((2_700_000 + 3_000_000) / 2);
    expect(med.categories.housing).toBe(1_100_000);
  });

  it("reports rupiah and relative differences", () => {
    expect(versusMedian(2_828_000, 3_510_000).diff).toBe(-682_000);
    expect(versusMedian(2_828_000, 3_510_000).ratio).toBeCloseTo(-0.1943, 3);
    expect(versusMedian(5, 0).ratio).toBeNull();
  });
});

describe("rankPhrase", () => {
  it("counts from the nearer end", () => {
    expect(rankPhrase(21, 514, 2, 38)).toBe(
      "Ke-21 paling lega dari 514 · ke-2 di provinsinya",
    );
    expect(rankPhrase(492, 514, 4, 5)).toBe(
      "Ke-23 paling berat dari 514 · ke-2 di provinsinya",
    );
  });

  it("names the extremes without an ordinal", () => {
    expect(rankPhrase(1, 514, 1, 38)).toBe(
      "Paling lega dari 514 · paling lega di provinsinya",
    );
    expect(rankPhrase(514, 514)).toBe("Paling berat dari 514");
  });
});
