import { classify, computeAllMetrics, DEFAULT_ASSUMPTIONS } from "./calculations";
import type {
  AffordabilityBand,
  AffordabilityBands,
  Assumptions,
  CostProfile,
  WageRecord,
} from "./types";

/**
 * Sensitivitas kalibrasi (AP-01).
 *
 * Peta Nafkah memberi satu warna per wilayah, dan warna itu sepenuhnya
 * bergantung pada asumsi yang sedang aktif — bukan hanya pada data. Satu
 * dropdown bisa memindahkan ratusan wilayah antar band. Modul ini menghitung
 * sebaran band untuk beberapa profil pembanding sehingga ketergantungan itu
 * bisa ditampilkan apa adanya di panel metode, diuji di CI, dan dikutip di
 * dokumen keputusan kalibrasi.
 *
 * Angkanya selalu dihitung ulang dari dataset yang sedang di-ship; tidak ada
 * hasil yang di-hardcode sehingga tabelnya tidak bisa basi diam-diam.
 */

export interface SensitivityScenario {
  id: string;
  /** Label pendek memakai kosakata panel asumsi. */
  label: string;
  /** Keterangan kenapa profil ini dipakai sebagai pembanding. */
  note: string;
  /** Selisih terhadap DEFAULT_ASSUMPTIONS. */
  overrides: Partial<Assumptions>;
}

/**
 * Profil pembanding: pilihan awal, lalu tiga profil yang masing-masing hanya
 * menggeser satu sumbu (hunian, gaya hidup + tabungan, basis upah).
 */
export const SENSITIVITY_SCENARIOS: SensitivityScenario[] = [
  {
    id: "default",
    label: "Rusun/kost · standar · +tabungan",
    note: "Pilihan awal aplikasi.",
    overrides: {},
  },
  {
    id: "kpr",
    label: "Rumah KPR · standar · +tabungan",
    note: "Pilihan awal sampai v0.1 — hunian satu tingkat lebih mahal.",
    overrides: { housing: "studio" },
  },
  {
    id: "hemat",
    label: "Rusun/kost · hemat · tanpa tabungan",
    note: "Batas bawah yang masuk akal: konsumsi paling irit, tanpa dana cadangan.",
    overrides: { lifestyle: "budget", includeSavings: false },
  },
  {
    id: "takeHome",
    label: "Rusun/kost · standar · take-home",
    note: "Upah setelah potongan BPJS & PPh, bukan nominal SK.",
    overrides: { wageBasis: "takeHome" },
  },
];

export interface BandDistribution {
  counts: Record<AffordabilityBand, number>;
  /** Wilayah yang punya data upah sekaligus biaya. */
  total: number;
  /** Median coverage% — lebih tahan pencilan daripada rata-rata. */
  medianCoverage: number;
}

const EMPTY_COUNTS = (): Record<AffordabilityBand, number> => ({
  comfortable: 0,
  manageable: 0,
  tight: 0,
  insufficient: 0,
});

function median(sorted: number[]): number {
  if (sorted.length === 0) return 0;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

/** Sebaran band seluruh wilayah di bawah satu set asumsi. */
export function bandDistribution(
  codes: string[],
  wages: Map<string, WageRecord>,
  costs: Map<string, CostProfile>,
  assumptions: Assumptions,
  bands?: AffordabilityBands,
): BandDistribution {
  const metrics = computeAllMetrics(codes, wages, costs, assumptions, bands);
  const counts = EMPTY_COUNTS();
  const coverages: number[] = [];

  for (const metric of metrics.values()) {
    counts[bands ? classify(metric.coveragePercent, bands) : metric.band] += 1;
    coverages.push(metric.coveragePercent);
  }

  coverages.sort((a, b) => a - b);
  return {
    counts,
    total: coverages.length,
    medianCoverage: median(coverages),
  };
}

export interface SensitivityRow extends SensitivityScenario {
  distribution: BandDistribution;
}

/** Sebaran band untuk setiap profil pembanding. */
export function sensitivityTable(
  codes: string[],
  wages: Map<string, WageRecord>,
  costs: Map<string, CostProfile>,
  bands?: AffordabilityBands,
): SensitivityRow[] {
  return SENSITIVITY_SCENARIOS.map((scenario) => ({
    ...scenario,
    distribution: bandDistribution(
      codes,
      wages,
      costs,
      { ...DEFAULT_ASSUMPTIONS, ...scenario.overrides },
      bands,
    ),
  }));
}
