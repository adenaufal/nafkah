import { describe, expect, it } from "vitest";
import { receiptCard, receiptText } from "./receipt";

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

describe("receiptCard", () => {
  const input = {
    ...base,
    region: "Kota Salatiga",
    province: "Jawa Tengah",
    band: "comfortable" as const,
    incomeSource: "UMK 2026: Keputusan Gubernur Jawa Tengah.",
    costAsOf: "2026-08-01",
    datasetVersion: "2026.1",
  };

  it("shows rupiah figures with each line's share by default", () => {
    const card = receiptCard(input, true);
    expect(card.unit).toBe("rupiah / bulan");
    expect(card.income).toEqual({ label: "UMK 2026", value: "2.698.000" });
    expect(card.lines[0]).toEqual({
      label: "Makanan & sembako",
      value: "1.379.000",
      share: "78%",
    });
    expect(card.total).toBe("1.764.000");
    expect(card.result).toEqual({ label: "Sisa", value: "+934.000", surplus: true });
    expect(card.coverage).toBe("153%");
  });

  it("hides every rupiah figure behind shares when asked", () => {
    const card = receiptCard(input, false);
    const printed = [
      card.income.value,
      card.total,
      card.result.value,
      ...card.lines.flatMap((l) => [l.value, l.share]),
    ].join(" ");
    expect(printed).not.toMatch(/\d\.\d{3}/);
    expect(card.income.value).toBe("•••");
    expect(card.lines.map((l) => l.value)).toEqual(["78%", "22%"]);
    expect(card.result.value).toBe("tertutup 153%");
    expect(card.unit).toBe("persen dari total");
  });

  it("prints where the numbers come from and what they are not", () => {
    const [income, cost, data] = receiptCard(input, true).footer;
    expect(income).toBe("UMK 2026: Keputusan Gubernur Jawa Tengah.");
    expect(cost).toContain("estimasi model");
    expect(cost).toContain("Agustus 2026");
    expect(data).toBe(
      "Data 2026.1 · bukan nasihat keuangan · nafkah.adenaufal.com",
    );
  });
});
