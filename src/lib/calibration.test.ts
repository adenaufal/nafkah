import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { DEFAULT_ASSUMPTIONS } from "./calculations";
import { bandDistribution, sensitivityTable } from "./calibration";
import type { CostProfile, Region, WageRecord } from "./types";

/**
 * Gerbang kalibrasi (AP-01). Panel metode, dokumen keputusan
 * `docs/kalibrasi-default-2026-09.md`, dan komunikasi publik semuanya mengutip
 * sebaran band yang sama. Test ini mengunci angka tersebut terhadap dataset
 * yang di-ship, sehingga perubahan pengali, band, atau data yang menggeser
 * gambaran nasional harus diputuskan secara sadar — bukan lolos diam-diam.
 */

const DIR = resolve("public/data/v2026.1");

const read = <T>(name: string): T =>
  JSON.parse(readFileSync(resolve(DIR, name), "utf8")) as T;

const regions = read<Region[]>("regions.json");
const wages = new Map(
  read<WageRecord[]>("wages.json").map((w) => [w.regionCode, w]),
);
const costs = new Map(
  read<CostProfile[]>("costs.json").map((c) => [c.regionCode, c]),
);
const codes = regions.map((region) => region.code);

describe("sebaran band di bawah pilihan awal", () => {
  it("mencakup seluruh wilayah dataset", () => {
    const { counts, total } = bandDistribution(
      codes,
      wages,
      costs,
      DEFAULT_ASSUMPTIONS,
    );
    const summed = Object.values(counts).reduce((sum, n) => sum + n, 0);
    expect(total).toBe(codes.length);
    expect(summed).toBe(codes.length);
  });

  it("cocok dengan angka yang dikutip di dokumen keputusan kalibrasi", () => {
    const { counts, medianCoverage } = bandDistribution(
      codes,
      wages,
      costs,
      DEFAULT_ASSUMPTIONS,
    );
    expect(counts).toEqual({
      comfortable: 27,
      manageable: 191,
      tight: 250,
      insufficient: 46,
    });
    expect(medianCoverage).toBeCloseTo(97.17, 1);
  });
});

describe("tabel sensitivitas", () => {
  const rows = sensitivityTable(codes, wages, costs);
  const byId = new Map(rows.map((row) => [row.id, row]));

  it("menghitung setiap profil pembanding atas dataset yang sama", () => {
    expect(rows).toHaveLength(4);
    for (const row of rows) expect(row.distribution.total).toBe(codes.length);
  });

  it("mempertahankan sebaran pilihan awal sampai v0.1 sebagai pembanding", () => {
    expect(byId.get("kpr")?.distribution.counts).toEqual({
      comfortable: 2,
      manageable: 95,
      tight: 303,
      insufficient: 114,
    });
  });

  it("menunjukkan gaya hidup sebagai sumbu paling sensitif", () => {
    const base = byId.get("default")?.distribution.counts.comfortable ?? 0;
    const hemat = byId.get("hemat")?.distribution.counts.comfortable ?? 0;
    // Satu langkah ke "hemat + tanpa tabungan" melipatgandakan band Nyaman;
    // inilah alasan tabel ini wajib tampil bersama petanya.
    expect(hemat).toBeGreaterThan(base * 10);
    expect(byId.get("hemat")?.distribution.counts).toEqual({
      comfortable: 361,
      manageable: 135,
      tight: 17,
      insufficient: 1,
    });
  });

  it("menurunkan cakupan saat memakai basis take-home", () => {
    const gross = byId.get("default")?.distribution.medianCoverage ?? 0;
    const takeHome = byId.get("takeHome")?.distribution.medianCoverage ?? 0;
    expect(takeHome).toBeLessThan(gross);
  });
});
