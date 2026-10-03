import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { validateCorrectionProposal } from "./correction-proposals";

const json = <T>(path: string): T => JSON.parse(readFileSync(path, "utf8")) as T;
const dataset = {
  regions: json<unknown[]>("public/data/v2026.1/regions.json"),
  wages: json<Record<string, unknown>[]>("public/data/v2026.1/wages.json"),
  costs: json<unknown[]>("public/data/v2026.1/costs.json"),
  narratives: json<unknown[]>("public/data/v2026.1/narratives.json"),
};
const wage = dataset.wages.find((item) => item.regionCode === "11.01")!;
const cost = dataset.costs.find((item) => (item as { regionCode: string }).regionCode === "11.01") as {
  regionCode: string; baseline: Record<string, { amount: number }>;
};
const acceptedWageChange = (overrides: Record<string, unknown> = {}) => ({
  regionCode: "11.01",
  kind: "wage",
  field: "grossMonthly",
  currentValue: wage.grossMonthly,
  proposedValue: Number(wage.grossMonthly) + 1000,
  provenance: {
    source: "Keputusan Gubernur contoh nomor 1",
    asOf: "2026-09-01",
    confidence: "official",
  },
  review: {
    status: "Accepted",
    reviewer: "Maintainer",
    reason: "Cocok dengan dokumen resmi yang diperiksa.",
    reviewedAt: "2026-09-27",
  },
  ...overrides,
});
const proposal = (changes: unknown[]) => ({ datasetVersion: "2026.1", changes });
const narrative = dataset.narratives.find((item) => (item as { regionCode: string }).regionCode === "11.01") as {
  regionCode: string;
  rentRange: { min: number; max: number; note: string; provenance: { source: string; asOf: string; confidence: string } };
};
const rentValue = { min: narrative.rentRange.min, max: narrative.rentRange.max, note: narrative.rentRange.note };
const acceptedRentChange = (overrides: Record<string, unknown> = {}) => ({
  regionCode: "11.01", kind: "rentRange", review: acceptedWageChange().review,
  currentValue: { ...rentValue },
  proposedValue: { min: rentValue.min + 1000, max: rentValue.max + 1000, note: "Rentang hunian berdasarkan bukti terbaru." },
  provenance: { ...narrative.rentRange.provenance },
  ...overrides,
});

describe("reviewed correction proposal validation", () => {
  it("accepts rent endpoint and note corrections without mutating either input", () => {
    const raw = proposal([acceptedRentChange()]);
    const before = JSON.stringify({ raw, dataset });
    expect(validateCorrectionProposal(raw, dataset)).toEqual([]);
    expect(JSON.stringify({ raw, dataset })).toBe(before);
  });

  it.each([false, true])("accepts coherent housing and rent corrections in either order (%s)", (rentFirst) => {
    const rent = acceptedRentChange({ provenance: acceptedWageChange().provenance });
    const housing = {
      ...acceptedWageChange(), kind: "cost", category: "housing",
      currentValue: cost.baseline.housing.amount, proposedValue: cost.baseline.housing.amount + 1000,
    } as Record<string, unknown>;
    delete housing.field;
    const changes = rentFirst ? [rent, housing] : [housing, rent];
    expect(validateCorrectionProposal(proposal(changes), dataset)).toEqual([]);
  });

  it.each(["min", "max", "note"])("rejects stale rent %s", (field) => {
    const currentValue = { ...rentValue, [field]: field === "note" ? "Old stale note" : rentValue[field as "min" | "max"] + 1 };
    expect(validateCorrectionProposal(proposal([acceptedRentChange({ currentValue })]), dataset))
      .toContain("changes[0]: stale currentValue");
  });

  it("rejects duplicate rent targets and unknown regions", () => {
    const change = acceptedRentChange();
    expect(validateCorrectionProposal(proposal([change, change]), dataset)).toContain("changes[1]: duplicate target");
    expect(validateCorrectionProposal(proposal([acceptedRentChange({ regionCode: "99.99" })]), dataset))
      .toContain("changes[0]: unknown region");
  });

  it("rejects unavailable rent targets", () => {
    const withoutTarget = { ...dataset, narratives: dataset.narratives.filter((item) => item !== narrative) };
    expect(validateCorrectionProposal(proposal([acceptedRentChange()]), withoutTarget))
      .toContain("changes[0]: rentRange target unavailable");
  });

  it.each([
    { min: -1, max: 2, note: "Rent example" },
    { min: 10, max: 2, note: "Rent example" },
    { min: 1, max: Infinity, note: "Rent example" },
    { min: 1, max: 2, note: " " },
  ])("rejects invalid proposed rent ranges (%j)", (proposedValue) => {
    expect(validateCorrectionProposal(proposal([acceptedRentChange({ proposedValue })]), dataset).length).toBeGreaterThan(0);
  });

  it("requires Accepted review and provenance for rent corrections", () => {
    const change = acceptedRentChange() as Record<string, unknown>;
    change.review = { ...acceptedWageChange().review, status: "New" };
    delete change.provenance;
    const errors = validateCorrectionProposal(proposal([change]), dataset).join(" ");
    expect(errors).toContain("review");
    expect(errors).toContain("provenance");
  });

  it("rejects rent provenance that differs from the housing benchmark", () => {
    const change = acceptedRentChange({ provenance: acceptedWageChange().provenance });
    expect(validateCorrectionProposal(proposal([change]), dataset).some((problem) => problem.includes("rent provenance"))).toBe(true);
  });

  it("does not expose private rent fields or values in schema errors", () => {
    const secret = "privateContactAddress@example.com";
    const proposedValue = { ...rentValue, min: secret, [secret]: "private" };
    const errors = validateCorrectionProposal(proposal([acceptedRentChange({ proposedValue })]), dataset);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.join(" ")).not.toContain(secret);
  });

  it("accepts reviewed change and validates the in-memory dataset", () => {
    expect(validateCorrectionProposal(proposal([acceptedWageChange()]), dataset)).toEqual([]);
  });

  it("accepts two wage fields sharing one record provenance", () => {
    const gross = acceptedWageChange();
    const takeHome = acceptedWageChange({
      field: "estimatedTakeHomeMonthly",
      currentValue: wage.estimatedTakeHomeMonthly,
      proposedValue: Number(wage.estimatedTakeHomeMonthly) + 1000,
    });
    expect(validateCorrectionProposal(proposal([gross, takeHome]), dataset)).toEqual([]);
  });

  it("rejects take-home above gross after applying the proposal", () => {
    const change = acceptedWageChange({
      field: "estimatedTakeHomeMonthly",
      currentValue: wage.estimatedTakeHomeMonthly,
      proposedValue: Number(wage.grossMonthly) + 1,
    });
    expect(validateCorrectionProposal(proposal([change]), dataset).some((problem) => problem.includes("take-home cannot exceed gross"))).toBe(true);
  });

  it("accepts a cost change and leaves the supplied dataset unchanged", () => {
    const before = JSON.stringify(dataset);
    const change = {
      regionCode: "11.01", kind: "cost", category: "food",
      currentValue: cost.baseline.food.amount,
      proposedValue: cost.baseline.food.amount + 1000,
      provenance: { source: "Model konsumsi pangan yang diperbarui", asOf: "2026-09-01", confidence: "estimate" },
      review: { status: "Accepted", reviewer: "Maintainer", reason: "Cocok dengan sumber yang diperiksa.", reviewedAt: "2026-09-27" },
    };
    expect(validateCorrectionProposal(proposal([change]), dataset)).toEqual([]);
    expect(JSON.stringify(dataset)).toBe(before);
  });

  it("rejects a stale current value", () => {
    const problems = validateCorrectionProposal(proposal([acceptedWageChange({ currentValue: 1 })]), dataset);
    expect(problems).toContain("changes[0]: stale currentValue");
  });

  it("rejects unknown regions and categories", () => {
    const unknownRegion = acceptedWageChange({ regionCode: "99.99" });
    const regionProblems = validateCorrectionProposal(proposal([unknownRegion]), dataset);
    expect(regionProblems).toContain("changes[0]: unknown region");
    const unknownCategory = {
      regionCode: "11.01", kind: "cost", category: "rent",
      currentValue: 1, proposedValue: 2,
      provenance: { source: "Sumber contoh untuk uji", asOf: "2026-09-01", confidence: "official" },
      review: { status: "Accepted", reviewer: "Maintainer", reason: "Sesuai bukti yang diperiksa.", reviewedAt: "2026-09-27" },
    };
    const categoryProblems = validateCorrectionProposal(proposal([unknownCategory]), dataset);
    expect(categoryProblems.some((problem) => problem.includes("category"))).toBe(true);
  });

  it("requires review decisions and provenance", () => {
    const change = acceptedWageChange() as Record<string, unknown>;
    delete change.review;
    delete change.provenance;
    const problems = validateCorrectionProposal(proposal([change]), dataset);
    expect(problems.some((problem) => problem.includes("review"))).toBe(true);
    expect(problems.some((problem) => problem.includes("provenance"))).toBe(true);
  });

  it("rejects duplicate targets", () => {
    const change = acceptedWageChange();
    const problems = validateCorrectionProposal(proposal([change, change]), dataset);
    expect(problems).toContain("changes[1]: duplicate target");
  });

  it("rejects conflicting provenance for two wage fields in one region", () => {
    const secondField = acceptedWageChange({
      field: "estimatedTakeHomeMonthly",
      currentValue: wage.estimatedTakeHomeMonthly,
      proposedValue: Number(wage.estimatedTakeHomeMonthly) + 1000,
      provenance: { source: "Another distinct wage source", asOf: "2026-09-01", confidence: "official" },
    });
    const problems = validateCorrectionProposal(proposal([acceptedWageChange(), secondField]), dataset);
    expect(problems).toContain("changes[1]: conflicting wage provenance for region");
  });

  it("rejects housing provenance that no longer matches displayed rent provenance", () => {
    const housing = cost.baseline.housing.amount;
    const change = {
      regionCode: "11.01", kind: "cost", category: "housing",
      currentValue: housing, proposedValue: housing + 1000,
      provenance: { source: "Sumber hunian baru yang belum disinkronkan", asOf: "2026-09-01", confidence: "estimate" },
      review: { status: "Accepted", reviewer: "Maintainer", reason: "Cocok dengan sumber yang diperiksa.", reviewedAt: "2026-09-27" },
    };
    expect(validateCorrectionProposal(proposal([change]), dataset).some((problem) => problem.includes("rent provenance"))).toBe(true);
  });

  it("rejects schema violations", () => {
    const problems = validateCorrectionProposal(proposal([
      acceptedWageChange({ proposedValue: -1, provenance: { source: "short", asOf: "yesterday", confidence: "guess" } }),
    ]), dataset);
    expect(problems.length).toBeGreaterThan(0);
  });

  it("rejects a negative proposed cost amount", () => {
    const change = {
      regionCode: "11.01", kind: "cost", category: "food",
      currentValue: cost.baseline.food.amount, proposedValue: -1,
      provenance: { source: "Model konsumsi pangan yang diperbarui", asOf: "2026-09-01", confidence: "estimate" },
      review: { status: "Accepted", reviewer: "Maintainer", reason: "Cocok dengan sumber yang diperiksa.", reviewedAt: "2026-09-27" },
    };
    const problems = validateCorrectionProposal(proposal([change]), dataset);
    expect(problems.some((problem) => problem.includes("baseline.food.amount"))).toBe(true);
  });

  it("does not echo arbitrary property names from invalid proposal JSON", () => {
    const privateKey = "privateContactAddress@example.com";
    const invalid = { datasetVersion: "2026.1", [privateKey]: "sensitive", changes: [acceptedWageChange()] };
    const errors = validateCorrectionProposal(invalid, dataset);
    expect(errors.join(" ")).not.toContain(privateKey);
  });
});
