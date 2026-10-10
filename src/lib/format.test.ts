import { describe, expect, it } from "vitest";
import { digits, pct, pctFixed, rp, rpShort, rpSigned } from "./format";
import {
  parseRupiah,
  roundSalary,
  rupiahInput,
  SALARY_STEPS,
  salaryStepIndex,
} from "./income";
import { regionLabel, regionTitle } from "./names";
import { bandRange } from "./bands";

describe("rupiah formatting (EYD: no space after Rp)", () => {
  it("rounds full figures to the nearest thousand", () => {
    expect(rp(1_234_567)).toBe("Rp1.235.000");
    expect(rp(-832_400)).toBe("Rp832.000");
    expect(digits(426_000)).toBe("426.000");
  });

  it("switches from rb to jt without printing 1.000 rb", () => {
    expect(rpShort(832_000)).toBe("Rp832 rb");
    expect(rpShort(999_600)).toBe("Rp1 jt");
    expect(rpShort(4_740_000)).toBe("Rp4,74 jt");
    expect(rpShort(-1_247_000)).toBe("Rp1,25 jt");
  });

  it("signs with a true minus", () => {
    expect(rpSigned(426_000)).toBe("+Rp426 rb");
    expect(rpSigned(-1_247_000)).toBe("−Rp1,25 jt");
    expect(rpSigned(-1_247_000, false)).toBe("−Rp1.247.000");
  });

  it("formats percentages with a decimal comma", () => {
    expect(pct(97.14, 1)).toBe("97,1%");
    expect(pct(77.4)).toBe("77%");
  });

  it("keeps the decimals of a fixed percentage, for table columns", () => {
    expect(pctFixed(87)).toBe("87,0%");
    expect(pctFixed(100.66)).toBe("100,7%");
    expect(pctFixed(97.4, 0)).toBe("97%");
  });
});

describe("salary input", () => {
  it("has 121 stops from 1 jt to 25 jt", () => {
    expect(SALARY_STEPS).toHaveLength(121);
    expect(SALARY_STEPS[0]).toBe(1_000_000);
    expect(SALARY_STEPS[90]).toBe(10_000_000);
    expect(SALARY_STEPS[120]).toBe(25_000_000);
  });

  it("snaps to the nearest stop and clamps", () => {
    expect(salaryStepIndex(6_540_000)).toBe(SALARY_STEPS.indexOf(6_500_000));
    expect(salaryStepIndex(10_200_000)).toBe(90);
    expect(salaryStepIndex(10_300_000)).toBe(91);
    expect(salaryStepIndex(500_000)).toBe(0);
    expect(salaryStepIndex(90_000_000)).toBe(120);
  });

  it("parses typed amounts", () => {
    expect(parseRupiah("Rp 4.500.000")).toBe(4_500_000);
    expect(parseRupiah("")).toBeNull();
    expect(parseRupiah("0")).toBeNull();
    expect(rupiahInput(4_500_000)).toBe("4.500.000");
    expect(rupiahInput(null)).toBe("");
    expect(roundSalary(3_349_000)).toBe(3_300_000);
  });
});

describe("region names", () => {
  it("makes the tier explicit for kabupaten only", () => {
    expect(regionLabel({ name: "Bandung", tier: "kabupaten" })).toBe(
      "Kab. Bandung",
    );
    expect(regionLabel({ name: "Kota Bandung", tier: "kota" })).toBe(
      "Kota Bandung",
    );
    // Kabupaten Kotabaru (Kalsel) is named "Kota Baru" in the dataset.
    expect(regionTitle({ name: "Kota Baru", tier: "kabupaten" })).toBe(
      "Kabupaten Kota Baru",
    );
  });
});

describe("bandRange", () => {
  it("derives the legend ranges from the thresholds", () => {
    expect(bandRange("comfortable")).toBe("≥ 120%");
    expect(bandRange("manageable")).toBe("100–119%");
    expect(bandRange("tight")).toBe("80–99%");
    expect(bandRange("insufficient")).toBe("< 80%");
  });
});
