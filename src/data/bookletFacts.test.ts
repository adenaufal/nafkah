import { describe, expect, it } from "vitest";
import { BAND_ORDER } from "@/lib/bands";
import { bookletFacts } from "./bookletFacts";

const sum = (values: number[]) => values.reduce((s, v) => s + v, 0);

describe("booklet facts", () => {
  const f = bookletFacts();

  it("covers every region once, most to least covered", () => {
    expect(f.ranked).toHaveLength(f.regionCount);
    expect(new Set(f.ranked.map((r) => r.code)).size).toBe(f.regionCount);
    for (let i = 1; i < f.ranked.length; i++) {
      expect(f.ranked[i - 1].coverage).toBeGreaterThanOrEqual(
        f.ranked[i].coverage,
      );
    }
    expect(f.kotaCount + f.kabupatenCount).toBe(f.regionCount);
  });

  it("adds up: bands, below/covered, tiers and provinces", () => {
    const n = f.national;
    expect(sum(BAND_ORDER.map((b) => n.counts[b]))).toBe(f.regionCount);
    expect(n.below).toBe(n.counts.tight + n.counts.insufficient);
    expect(n.below + n.covered).toBe(f.regionCount);
    expect(f.tiers.kota.below + f.tiers.kabupaten.below).toBe(n.below);
    expect(f.provinces).toHaveLength(f.provinceCount);
    expect(sum(f.provinces.map((p) => p.total))).toBe(f.regionCount);
    expect(sum(f.provinces.map((p) => p.below))).toBe(n.below);
    for (const p of f.provinces) {
      expect(sum(BAND_ORDER.map((b) => p.counts[b]))).toBe(p.total);
    }
  });

  it("dropping savings never pushes more regions below 100%", () => {
    expect(f.belowWithoutSavings).toBeLessThanOrEqual(f.national.below);
  });

  it("measures the shortfall only where income falls short", () => {
    const short = f.ranked.filter((r) => r.surplus < 0);
    expect(short).toHaveLength(f.national.below);
    expect(f.medianShortfall).toBeGreaterThan(0);
    expect(f.medianShortfall).toBeLessThanOrEqual(
      Math.max(...short.map((r) => -r.surplus)),
    );
  });

  it("gives every household its own medians", () => {
    const [single, couple] = f.households;
    expect(single.medianCost).toBeCloseTo(f.medianCost, 6);
    expect(single.medianIncome).toBeCloseTo(f.medianWage, 6);
    // Two earners, two minimum wages.
    expect(couple.medianIncome).toBeCloseTo(2 * f.medianWage, 6);
    expect(couple.medianCost).toBeGreaterThan(single.medianCost);
  });

  it("matches the default row of the sensitivity table", () => {
    expect(f.sensitivity[0].distribution.counts).toEqual(f.national.counts);
    expect(f.households[0].summary.counts).toEqual(f.national.counts);
  });

  it("prints the worked example as a receipt that adds up", () => {
    const { region, lines, targets } = f.example;
    expect(sum(lines.map((l) => l.amount))).toBeCloseTo(region.cost, 3);
    expect(sum(lines.map((l) => l.share))).toBeCloseTo(1, 6);
    expect(region.coverage).toBeCloseTo((region.wage / region.cost) * 100, 6);
    expect(targets.enough).toBeCloseTo(region.cost, 6);
    expect(["UMK", "UMP"]).toContain(f.example.wageText);
  });

  it("picks the intended cities", () => {
    expect(f.cities.map((c) => c.label)).toEqual([
      "Kota Jakarta Pusat",
      "Kota Surabaya",
      "Kota Bandung",
      "Kota Medan",
      "Kota Semarang",
      "Kota Makassar",
      "Kota Batam",
      "Kota Palembang",
      "Kota Denpasar",
      "Kota Yogyakarta",
      "Kota Balikpapan",
      "Kota Jayapura",
      "Kota Pekanbaru",
      "Kota Pontianak",
      "Kota Manado",
      "Kota Kupang",
    ]);
  });

  it("orders the cost extremes", () => {
    expect(f.cheapest.cost).toBeLessThanOrEqual(f.priciest.cost);
    for (const r of f.ranked) {
      expect(r.cost).toBeGreaterThanOrEqual(f.cheapest.cost);
      expect(r.cost).toBeLessThanOrEqual(f.priciest.cost);
    }
  });

  it("draws a map shape for every band that has regions", () => {
    for (const band of BAND_ORDER) {
      const path = f.map.fills[band] ?? "";
      if (f.national.counts[band] > 0) expect(path).toMatch(/^M\d/);
      else expect(path).toBe("");
    }
    expect(f.map.regionBorders).toMatch(/^M\d/);
    expect(f.map.provinceBorders).toMatch(/^M\d/);
    for (const h of f.households) {
      for (const band of BAND_ORDER) {
        if (h.summary.counts[band] > 0) expect(h.fills[band]).toMatch(/^M\d/);
      }
    }
  });

  it("keeps Indonesia wider than tall on the map", () => {
    expect(f.map.width).toBe(2000);
    expect(f.map.height).toBeGreaterThan(600);
    expect(f.map.height).toBeLessThan(900);
    const [x, y] = f.map.project([106.8, -6.2]); // Jakarta
    expect(x).toBeGreaterThan(0);
    expect(x).toBeLessThan(f.map.width / 2);
    expect(y).toBeGreaterThan(f.map.height / 2);
  });
});
