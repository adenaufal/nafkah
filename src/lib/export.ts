import { EXPENSE_CATEGORIES } from "@/data/costs";
import { BAND_LABEL, isRegionalIncome } from "@/lib/calculations";
import { assumptionSummary } from "@/lib/profile";
import type {
  Assumptions,
  Confidence,
  CostProfile,
  IncomeSource,
  Region,
  RegionMetrics,
  WageRecord,
} from "@/lib/types";

/** The complete input needed to export one comparison column. */
export interface ComparisonExportRow {
  region: Region;
  metrics: RegionMetrics;
  wage: WageRecord;
  costs: CostProfile;
  originWage?: WageRecord;
}

export interface ComparisonCsvOptions {
  rows: ComparisonExportRow[];
  assumptions: Assumptions;
  datasetVersion: string;
  origin?: Region;
  /** Injected by tests; defaults to the current timestamp in the browser. */
  generatedAt?: string;
}

const CSV_HEADERS = [
  "dataset_version",
  "profil_asumsi",
  "kota_asal",
  "wilayah",
  "kode_wilayah",
  "provinsi",
  "metrik",
  "nilai",
  "satuan",
  "tingkat_keterjangkauan",
  "source",
  "asOf",
  "confidence",
  "catatan",
] as const;

interface CsvRow {
  metric: string;
  value: number;
  unit: string;
  band?: string;
  source: string;
  asOf: string;
  confidence: Confidence;
  note: string;
}

const CONFIDENCE_RANK: Record<Confidence, number> = {
  official: 0,
  estimate: 1,
  sample: 2,
};

/** Escape one CSV cell according to RFC 4180. */
export function escapeCsvCell(value: string | number | null | undefined): string {
  const text = value == null ? "" : String(value);
  return /[",\r\n]/.test(text)
    ? "\"" + text.replaceAll("\"", "\"\"") + "\""
    : text;
}

function combineConfidence(...values: Confidence[]): Confidence {
  return values.reduce<Confidence>(
    (current, value) =>
      CONFIDENCE_RANK[value] > CONFIDENCE_RANK[current] ? value : current,
    "official",
  );
}

function latestAsOf(values: string[]): string {
  return values.reduce((latest, value) => (value > latest ? value : latest));
}

/** Where one earner's income comes from: a typed salary or a wage record. */
function incomeProvenance(
  source: IncomeSource,
  row: ComparisonExportRow,
  generatedDate: string,
): Pick<CsvRow, "source" | "asOf" | "confidence"> {
  if (source === "custom")
    return {
      source: "Input pengguna (bukan dataset)",
      asOf: generatedDate,
      confidence: "estimate",
    };
  if (source === "origin" && row.originWage)
    return {
      source: "UMK kota asal",
      asOf: row.originWage.asOf,
      confidence: row.originWage.confidence,
    };
  return {
    source: row.wage.source,
    asOf: row.wage.asOf,
    confidence: row.wage.confidence,
  };
}

function rowsForRegion(
  row: ComparisonExportRow,
  assumptions: Assumptions,
  generatedDate: string,
): CsvRow[] {
  const { metrics, wage, costs } = row;
  const categoryProvenance = EXPENSE_CATEGORIES.map(
    (category) => costs.baseline[category.key],
  );
  const costConfidence = combineConfidence(
    ...categoryProvenance.map((value) => value.confidence),
  );
  const costAsOf = latestAsOf(categoryProvenance.map((value) => value.asOf));
  const derivedSource = "Perhitungan Nafkah dari data kategori di bawah";
  const derivedNote =
    "Dihitung dengan profil " + assumptionSummary(assumptions) + ".";
  // A partner on the same minimum wage shares the user's provenance; only a
  // different source (a typed salary on either side) gets its own part.
  const own = incomeProvenance(metrics.wageSource, row, generatedDate);
  const partner =
    metrics.partnerWageSource && metrics.partnerWageSource !== metrics.wageSource
      ? incomeProvenance(metrics.partnerWageSource, row, generatedDate)
      : null;
  const parts = partner ? [own, partner] : [own];
  const wageSource = partner
    ? own.source + "; pasangan: " + partner.source
    : own.source;
  const wageAsOf = latestAsOf(parts.map((part) => part.asOf));
  const wageConfidence = combineConfidence(
    ...parts.map((part) => part.confidence),
  );
  const hasUserInput =
    metrics.wageSource === "custom" || metrics.partnerWageSource === "custom";

  const rows: CsvRow[] = [
    {
      metric: hasUserInput
        ? "pendapatan_yang_dipakai"
        : metrics.wageSource === "origin"
          ? "gaji_asal_yang_dipakai"
          : "upah_regional_yang_dipakai",
      value: metrics.wageAmount,
      unit: "IDR/bulan",
      source: wageSource,
      asOf: wageAsOf,
      confidence: wageConfidence,
      note: !hasUserInput
        ? "Basis upah mengikuti pilihan kotor atau estimasi take-home."
        : partner
          ? "Gabungan isian pengguna dan upah minimum; basis upah minimum " +
            "mengikuti pilihan kotor atau estimasi take-home."
          : "Nilai pendapatan berasal dari isian pengguna.",
    },
    {
      metric: "biaya_bulanan",
      value: metrics.totalMonthlyCost,
      unit: "IDR/bulan",
      band: BAND_LABEL[metrics.band],
      source: derivedSource,
      asOf: costAsOf,
      confidence: costConfidence,
      note: derivedNote,
    },
    {
      metric: "surplus_atau_defisit",
      value: metrics.surplusOrDeficit,
      unit: "IDR/bulan",
      band: BAND_LABEL[metrics.band],
      source: derivedSource + "; upah: " + wageSource,
      asOf: latestAsOf([costAsOf, wageAsOf]),
      confidence: combineConfidence(costConfidence, wageConfidence),
      note: "Pendapatan yang dipakai dikurangi biaya bulanan.",
    },
    {
      metric: "cakupan_gaji",
      value: metrics.coveragePercent,
      unit: "%",
      band: BAND_LABEL[metrics.band],
      source: derivedSource + "; upah: " + wageSource,
      asOf: latestAsOf([costAsOf, wageAsOf]),
      confidence: combineConfidence(costConfidence, wageConfidence),
      note: "Pendapatan yang dipakai dibagi biaya bulanan.",
    },
    {
      metric: "rasio_biaya_per_upah",
      value: metrics.affordabilityRatio,
      unit: "rasio",
      band: BAND_LABEL[metrics.band],
      source: derivedSource + "; upah: " + wageSource,
      asOf: latestAsOf([costAsOf, wageAsOf]),
      confidence: combineConfidence(costConfidence, wageConfidence),
      note: "Biaya bulanan dibagi pendapatan yang dipakai.",
    },
  ];

  if (!isRegionalIncome(metrics)) {
    rows.push({
      metric: "umk_kota_tujuan_pembanding",
      value: metrics.regionalWageAmount,
      unit: "IDR/bulan",
      source: wage.source,
      asOf: wage.asOf,
      confidence: wage.confidence,
      note: "UMK/UMP wilayah tujuan, ditampilkan sebagai pembanding.",
    });
  }

  for (const category of EXPENSE_CATEGORIES) {
    const provenance = costs.baseline[category.key];
    rows.push({
      metric: "biaya_" + category.key,
      value: metrics.breakdown[category.key],
      unit: "IDR/bulan",
      band: BAND_LABEL[metrics.band],
      source: provenance.source,
      asOf: provenance.asOf,
      confidence: provenance.confidence,
      note:
        "Nilai baseline disesuaikan dengan profil " +
        assumptionSummary(assumptions) +
        ".",
    });
  }

  return rows;
}

/** Build a spreadsheet-friendly export with provenance on every numeric row. */
export function buildComparisonCsv({
  rows,
  assumptions,
  datasetVersion,
  origin,
  generatedAt = new Date().toISOString(),
}: ComparisonCsvOptions): string {
  const generatedDate = generatedAt.slice(0, 10);
  const profile = assumptionSummary(assumptions);
  const header = CSV_HEADERS.map(escapeCsvCell).join(",");
  const lines = rows.flatMap((row) => {
    const regionRows = rowsForRegion(row, assumptions, generatedDate);
    return regionRows.map((item) =>
      [
        datasetVersion,
        profile,
        origin?.name ?? "",
        row.region.name,
        row.region.code,
        row.region.province,
        item.metric,
        item.value,
        item.unit,
        item.band ?? "",
        item.source,
        item.asOf,
        item.confidence,
        item.note,
      ]
        .map(escapeCsvCell)
        .join(","),
    );
  });

  return header + "\n" + lines.join("\n") + "\n";
}

/** Trigger a local download without sending the export data anywhere. */
export function downloadCsv(csv: string, filename: string): void {
  if (typeof document === "undefined") return;
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
