import { digits, formatMonth, pct, rp } from "./format";
import type { AffordabilityBand } from "./types";

/** What the monthly receipt shows, flattened for the clipboard. */
export interface ReceiptTextInput {
  /** "Kota Salatiga, Jawa Tengah" */
  place: string;
  profile: string;
  incomeLabel: string;
  income: number;
  /** Cost lines as shown, largest first. */
  lines: { label: string; value: number }[];
  total: number;
  surplusOrDeficit: number;
  coveragePercent: number;
  bandLabel: string;
}

/**
 * The receipt as plain text: one "label: amount" per line, so it pastes
 * cleanly into notes, a chat, or a spreadsheet as a budgeting reference.
 * Amounts round to the nearest thousand, like the receipt on screen.
 */
export function receiptText(r: ReceiptTextInput): string {
  const surplus = r.surplusOrDeficit >= 0;
  return [
    `Struk bulanan Nafkah — ${r.place}`,
    `Profil: ${r.profile}`,
    "",
    "Pemasukan",
    `- ${r.incomeLabel}: ${rp(r.income)}`,
    "",
    "Pengeluaran per bulan (estimasi)",
    ...r.lines.map((l) => `- ${l.label}: ${rp(l.value)}`),
    `Total pengeluaran: ${rp(r.total)}`,
    "",
    `${surplus ? "Sisa" : "Kurang"}: ${surplus ? "+" : "−"}${rp(r.surplusOrDeficit)}` +
      ` · tertutup ${pct(r.coveragePercent)} (${r.bandLabel})`,
    "",
    "Biaya hidup = estimasi model, bukan nasihat keuangan. nafkah.adenaufal.com",
  ].join("\n");
}

/** The receipt plus where its numbers come from — everything the image needs. */
export interface ReceiptCardInput extends ReceiptTextInput {
  /** "Kota Salatiga" */
  region: string;
  /** "Jawa Tengah" */
  province: string;
  band: AffordabilityBand;
  /** e.g. "UMK 2026: Keputusan Gubernur Jawa Tengah No. …". */
  incomeSource: string;
  /** Latest asOf among the cost lines, ISO date. */
  costAsOf: string;
  datasetVersion: string;
}

/** The share image's text, formatted and ready to draw. */
export interface ReceiptCard {
  region: string;
  province: string;
  profile: string;
  coverage: string;
  band: AffordabilityBand;
  bandLabel: string;
  /** Column note over the figures. */
  unit: string;
  income: { label: string; value: string };
  lines: { label: string; value: string; share: string }[];
  total: string;
  result: { label: string; value: string; surplus: boolean };
  /** Provenance and caveats, printed under the receipt. */
  footer: string[];
}

const HIDDEN = "•••";

/**
 * The receipt card behind the share image. With amounts hidden, every rupiah
 * figure gives way to its share of the month, so a typed salary, instalment,
 * or family support never shows — only how the month splits and how much of
 * it the income covers.
 */
export function receiptCard(
  r: ReceiptCardInput,
  showAmounts: boolean,
): ReceiptCard {
  const surplus = r.surplusOrDeficit >= 0;
  const share = (value: number) => pct((value / (r.total || 1)) * 100);
  return {
    region: r.region,
    province: r.province,
    profile: r.profile,
    coverage: pct(r.coveragePercent),
    band: r.band,
    bandLabel: r.bandLabel,
    unit: showAmounts ? "rupiah / bulan" : "persen dari total",
    income: {
      label: r.incomeLabel,
      value: showAmounts ? digits(r.income) : HIDDEN,
    },
    lines: r.lines.map((l) => ({
      label: l.label,
      value: showAmounts ? digits(l.value) : share(l.value),
      share: showAmounts ? share(l.value) : "",
    })),
    total: showAmounts ? digits(r.total) : "100%",
    result: {
      label: surplus ? "Sisa" : "Kurang",
      value: showAmounts
        ? `${surplus ? "+" : "−"}${digits(r.surplusOrDeficit)}`
        : `tertutup ${pct(r.coveragePercent)}`,
      surplus,
    },
    footer: [
      r.incomeSource,
      `Biaya hidup: estimasi model dari Susenas, IHK BPS, dan harga lokal, per ${formatMonth(r.costAsOf)}; bukan survei.`,
      `Data ${r.datasetVersion} · bukan nasihat keuangan · nafkah.adenaufal.com`,
    ],
  };
}
