import { EXPENSE_CATEGORIES } from "@/data/costs";
import { BAND_LABEL } from "@/lib/calculations";
import { assumptionSummary } from "@/lib/profile";
import type {
  Assumptions,
  Confidence,
  CostProfile,
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
  const wageSource =
    metrics.wageSource === "custom"
      ? row.originWage
        ? "Input pengguna + UMK pasangan dari kota asal"
        : "Input pengguna (bukan dataset)"
      : metrics.wageSource === "origin"
        ? "UMK kota asal"
        : wage.source;
  const wageAsOf =
    metrics.wageSource === "custom"
      ? row.originWage
        ? latestAsOf([generatedDate, row.originWage.asOf])
        : generatedDate
      : metrics.wageSource === "origin" && row.originWage
        ? row.originWage.asOf
        : wage.asOf;
  const wageConfidence =
    metrics.wageSource === "custom"
      ? combineConfidence("estimate", row.originWage?.confidence ?? "official")
      : metrics.wageSource === "origin" && row.originWage
        ? row.originWage.confidence
        : wage.confidence;

  const rows: CsvRow[] = [
    {
      metric:
        metrics.wageSource === "custom"
          ? "pendapatan_yang_dipakai"
          : metrics.wageSource === "origin"
            ? "gaji_asal_yang_dipakai"
            : "upah_regional_yang_dipakai",
      value: metrics.wageAmount,
      unit: "IDR/bulan",
      source: wageSource,
      asOf: wageAsOf,
      confidence: wageConfidence,
      note:
        metrics.wageSource === "custom"
          ? "Nilai pendapatan berasal dari isian pengguna."
          : "Basis upah mengikuti pilihan kotor atau estimasi take-home.",
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

  if (metrics.wageSource !== "region") {
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
