import { pct, rp } from "./format";

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
