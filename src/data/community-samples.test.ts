import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, unlinkSync, rmdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { summarizeCommunitySamples } from "./community-samples";

const profile = { householdSize: 1, lifestyle: "moderate", housing: "studio", transport: "motorcycle" };
const regions = [{ code: "11.01" }, { code: "11.02" }];
const observation = (index: number, overrides: Record<string, unknown> = {}) => ({
  id: `sample-${index}`, respondentId: `person-${index}`, regionCode: "11.01", category: "food",
  monthlyAmount: index * 100, observedAt: "2026-09-20", profile: { ...profile }, status: "Accepted",
  review: { reviewer: "Private maintainer", reason: "Private receipt verified", reviewedAt: "2026-09-21" },
  ...overrides,
});
const envelope = (observations: unknown[]) => ({ source: "Synthetic survey September", period: { start: "2026-09-01", end: "2026-09-30" }, observations });
const cohort = (start: number, size: number, overrides: Record<string, unknown> = {}) => Array.from({ length: size }, (_, i) => observation(start + i, overrides));

describe("moderated private community samples", () => {
  it("publishes distinct accepted respondents with odd median and safe provenance, without mutation", () => {
    const raw = envelope(cohort(1, 5));
    const before = structuredClone(raw);
    const result = summarizeCommunitySamples(raw, regions);
    expect(result.errors).toEqual([]);
    expect(result.summaries).toEqual([{ regionCode: "11.01", category: "food", profile, sampleSize: 5,
      median: 300, min: 100, max: 500, period: raw.period, source: raw.source, asOf: "2026-09-30", confidence: "sample" }]);
    expect(raw).toEqual(before);
    expect(JSON.stringify(result)).not.toMatch(/person-|sample-|Private|reviewer|respondentId|observations/);
  });

  it("computes an even median midpoint", () => {
    expect(summarizeCommunitySamples(envelope(cohort(1, 6)), regions).summaries[0].median).toBe(350);
  });

  it("suppresses fewer than five accepted respondents and ignores pending/rejected records", () => {
    const pending = observation(8, { status: "Pending", review: undefined });
    const rejected = observation(9, { status: "Rejected" });
    expect(summarizeCommunitySamples(envelope([...cohort(1, 4), pending, rejected]), regions)).toEqual({ errors: [], summaries: [] });
    expect(summarizeCommunitySamples(envelope([]), regions)).toEqual({ errors: [], summaries: [] });
  });

  it("separates region, category and every profile field", () => {
    const groups = [cohort(1, 5), cohort(11, 5, { regionCode: "11.02" }), cohort(21, 5, { category: "housing" }),
      cohort(31, 5, { profile: { ...profile, householdSize: 2 } }), cohort(41, 5, { profile: { ...profile, lifestyle: "budget" } }),
      cohort(51, 5, { profile: { ...profile, housing: "owner" } }), cohort(61, 5, { profile: { ...profile, transport: "none" } })];
    const result = summarizeCommunitySamples(envelope(groups.flat()), regions);
    expect(result.errors).toEqual([]);
    expect(result.summaries).toHaveLength(7);
    expect(result.summaries.every((summary) => summary.sampleSize === 5)).toBe(true);
    expect(summarizeCommunitySamples(envelope([observation(1), observation(2, { regionCode: "11.02" }), observation(3, { category: "housing" })]), regions).summaries).toEqual([]);
  });

  it("rejects globally duplicated observation IDs and duplicated respondents within cohorts across statuses", () => {
    for (const duplicate of [observation(9, { id: "sample-1", regionCode: "11.02" }),
      observation(9, { respondentId: "person-1", status: "Pending", review: undefined })]) {
      const result = summarizeCommunitySamples(envelope([...cohort(1, 5), duplicate]), regions);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.summaries).toEqual([]);
    }
    expect(summarizeCommunitySamples(envelope([observation(1), observation(2, { respondentId: "person-1", category: "housing" })]), regions).errors).toEqual([]);
  });

  it.each([
    { regionCode: "99.99" }, { monthlyAmount: NaN }, { monthlyAmount: Infinity }, { monthlyAmount: -1 },
    { observedAt: "2026-09-31" }, { observedAt: "2026-08-31" }, { observedAt: "2026-10-01" },
    { review: undefined }, { review: { reviewer: "A", reason: "verified", reviewedAt: "2026-09-19" } },
    { review: { reviewer: "A", reason: "verified", reviewedAt: "2026-02-30" } },
    { status: "Pending" }, { profile: { ...profile, householdSize: 0 } },
    { profile: { ...profile, householdSize: 11 } }, { profile: { ...profile, householdSize: 1.5 } },
    { category: "secret category" }, { "secret contact email": "private@example.test" },
  ])("rejects invalid observations without echoing private values: %j", (overrides) => {
    const result = summarizeCommunitySamples(envelope([observation(1, overrides)]), regions);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.summaries).toEqual([]);
    expect(JSON.stringify(result)).not.toMatch(/private@example|secret contact|secret category|Private|person-/);
  });

  it.each([
    { start: "2026-02-30", end: "2026-09-30" }, { start: "2026-09-30", end: "2026-09-01" },
  ])("rejects invalid or reversed reporting periods", (period) => {
    expect(summarizeCommunitySamples({ ...envelope([]), period }, regions).errors.length).toBeGreaterThan(0);
  });

  it("keeps separate reporting periods isolated and rejects unknown envelope/profile/review fields", () => {
    const next = { ...envelope(cohort(1, 5, { observedAt: "2026-10-10", review: { reviewer: "A", reason: "verified", reviewedAt: "2026-10-11" } })), period: { start: "2026-10-01", end: "2026-10-31" } };
    expect(summarizeCommunitySamples(next, regions).summaries[0].period).toEqual(next.period);
    for (const raw of [{ ...envelope([]), privateField: "secret" }, envelope([observation(1, { profile: { ...profile, contact: "secret" } })]),
      envelope([observation(1, { review: { reviewer: "A", reason: "verified", reviewedAt: "2026-09-21", contact: "secret" } })])]) {
      expect(summarizeCommunitySamples(raw, regions).errors.length).toBeGreaterThan(0);
    }
  });

  it("keeps finite midpoint values finite and output deterministic when input order changes", () => {
    const raw = envelope(cohort(1, 6, { monthlyAmount: Number.MAX_VALUE }));
    const result = summarizeCommunitySamples(raw, regions);
    expect(result.summaries[0].median).toBe(Number.MAX_VALUE);
    const mixed = [...cohort(1, 5), ...cohort(11, 5, { regionCode: "11.02" })];
    expect(summarizeCommunitySamples(envelope(mixed), regions)).toEqual(summarizeCommunitySamples(envelope([...mixed].reverse()), regions));
  });

  it("emits only public CLI summaries and uses privacy-safe errors and exit codes", () => {
    const directory = mkdtempSync(join(tmpdir(), "nafkah-community-test-"));
    const path = join(directory, "private-input.json");
    const run = (args: string[]) => spawnSync(process.execPath, ["--import", "tsx", "scripts/summarize-community.ts", ...args], { encoding: "utf8" });
    try {
      writeFileSync(path, JSON.stringify(envelope(cohort(1, 5))));
      const valid = run([path]);
      expect(valid.status).toBe(0);
      expect(valid.stderr).toBe("");
      expect(JSON.parse(valid.stdout)).toHaveLength(1);
      expect(valid.stdout).not.toMatch(/respondentId|person-|Private|reviewer|reason/);
      writeFileSync(path, JSON.stringify(envelope([observation(1, { "private email": "private@example.test" })])));
      const invalid = run([path]);
      expect(invalid.status).toBe(1);
      expect(invalid.stdout).toBe("");
      expect(invalid.stderr).not.toMatch(/private@example|private email|person-|Private/);
      writeFileSync(path, "{private-invalid-json");
      const malformed = run([path]);
      expect(malformed.status).toBe(1);
      expect(malformed.stderr).not.toContain("private-invalid-json");
      expect(run([]).status).toBe(2);
    } finally {
      unlinkSync(path);
      rmdirSync(directory);
    }
  });
});
