import { describe, expect, it } from "vitest";
import { receiptText } from "./receipt";

const base = {
  place: "Kota Salatiga, Jawa Tengah",
  profile: "lajang · standar · rusun/kost · motor · +tabungan",
  incomeLabel: "UMK 2026",
  income: 2_698_000,
  lines: [
    { label: "Makanan & sembako", value: 1_379_400 },
    { label: "Sewa hunian", value: 385_000 },
  ],
  total: 1_764_400,
  surplusOrDeficit: 933_600,
  coveragePercent: 152.9,
  bandLabel: "Nyaman",
};

describe("receiptText", () => {
  it("lists income, every cost line, the total, and the result", () => {
    expect(receiptText(base)).toBe(
      [
        "Struk bulanan Nafkah — Kota Salatiga, Jawa Tengah",
        "Profil: lajang · standar · rusun/kost · motor · +tabungan",
        "",
        "Pemasukan",
        "- UMK 2026: Rp2.698.000",
        "",
        "Pengeluaran per bulan (estimasi)",
        "- Makanan & sembako: Rp1.379.000",
        "- Sewa hunian: Rp385.000",
        "Total pengeluaran: Rp1.764.000",
        "",
        "Sisa: +Rp934.000 · tertutup 153% (Nyaman)",
        "",
        "Biaya hidup = estimasi model, bukan nasihat keuangan. nafkah.adenaufal.com",
      ].join("\n"),
    );
  });

  it("names a shortfall with a minus sign", () => {
    const text = receiptText({
      ...base,
      surplusOrDeficit: -1_063_000,
      coveragePercent: 71.7,
      bandLabel: "Tak Cukup",
    });
    expect(text).toContain("Kurang: −Rp1.063.000 · tertutup 72% (Tak Cukup)");
  });
});
