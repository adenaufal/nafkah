import { readFileSync, mkdtempSync, writeFileSync, unlinkSync, rmdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { inspectCorrectionLedger } from "./correction-ledger";

const regions = JSON.parse(readFileSync("public/data/v2026.1/regions.json", "utf8")) as { code: string }[];
const report = (overrides: Record<string, unknown> = {}) => ({
  id: "report_001", regionCode: "11.01", category: "wage", status: "New",
  receivedAt: "2026-09-01", ...overrides,
});
const review = { reviewer: "Private Reviewer", reason: "Private evidence checked", reviewedAt: "2026-09-02" };
const ledger = (reports: unknown[]) => ({ datasetVersion: "2026.1", reports });
const runCli = (...args: string[]) => spawnSync(process.execPath, [resolve("node_modules/tsx/dist/cli.mjs"), "scripts/summarize-corrections.ts", ...args], { encoding: "utf8" });

describe("private correction ledger", () => {
  it("accepts an empty queue and emits only stable aggregate counts", () => {
    expect(inspectCorrectionLedger(ledger([]), regions)).toEqual({ errors: [], summary: {
      countsByStatus: { New: 0, "In review": 0, "Need more info": 0, Accepted: 0, Rejected: 0 }, released: 0,
    } });
  });

  it("distinguishes accepted from released without publishing private values", () => {
    const raw = ledger([
      report(),
      report({ id: "report_002", status: "In review", category: "food" }),
      report({ id: "report_003", status: "Need more info", category: "other", review }),
      report({ id: "report_004", status: "Accepted", review }),
      report({ id: "report_005", status: "Accepted", review, release: "2026.2" }),
      report({ id: "report_006", status: "Rejected", review }),
    ]);
    const before = JSON.stringify(raw);
    const result = inspectCorrectionLedger(raw, regions);
    expect(result).toEqual({ errors: [], summary: {
      countsByStatus: { New: 1, "In review": 1, "Need more info": 1, Accepted: 2, Rejected: 1 }, released: 1,
    } });
    expect(JSON.stringify(raw)).toBe(before);
    const output = JSON.stringify(result);
    for (const secret of ["report_001", "11.01", review.reviewer, review.reason, "2026-09-01", "food"])
      expect(output).not.toContain(secret);
  });

  it.each(["housing", "food", "transport", "utilities", "connectivity", "healthcare", "personalCare", "leisure", "education", "contingency", "other", "wage"])("accepts category %s", (category) => {
    expect(inspectCorrectionLedger(ledger([report({ category })]), regions).errors).toEqual([]);
  });

  it.each(["Accepted", "Rejected"])("requires review for %s", (status) => {
    expect(inspectCorrectionLedger(ledger([report({ status })]), regions).errors).toContain("reports[0].review: required decision review");
  });

  it("rejects a review on a New report", () => {
    expect(inspectCorrectionLedger(ledger([report({ review })]), regions).errors).toContain("reports[0].review: unexpected new-report review");
  });

  it.each(["New", "In review", "Need more info", "Rejected"])("cannot release status %s", (status) => {
    const result = inspectCorrectionLedger(ledger([report({ status, release: "2026.2", ...(status === "Rejected" ? { review } : {}) })]), regions);
    expect(result.errors).toContain("reports[0].release: requires accepted reviewed report");
    expect(result.summary).toBeUndefined();
  });

  it.each(["2026.1", "next", "2026.0"])("rejects invalid or baseline release %s", (release) => {
    expect(inspectCorrectionLedger(ledger([report({ status: "Accepted", review, release })]), regions).errors.length).toBeGreaterThan(0);
  });

  it("requires a numerically later release version", () => {
    for (const release of ["2025.1", "2025.100"]) {
      expect(inspectCorrectionLedger(ledger([report({ status: "Accepted", review, release })]), regions).errors).toContain("reports[0].release: release must follow reported dataset version");
    }
    for (const release of ["2026.10", "2027.1"]) {
      expect(inspectCorrectionLedger(ledger([report({ status: "Accepted", review, release })]), regions).errors).toEqual([]);
    }
  });

  it("rejects duplicate opaque IDs and unknown region codes", () => {
    const result = inspectCorrectionLedger(ledger([report(), report({ regionCode: "99.99" })]), regions);
    expect(result.errors).toEqual(["reports[1].id: duplicate report ID", "reports[1].regionCode: unknown region"]);
    expect(result.summary).toBeUndefined();
  });

  it.each(["2026-02-29", "2026-04-31", "2026-13-01", "yesterday", "0000-01-01"])("rejects nonexistent received date %s", (receivedAt) => {
    expect(inspectCorrectionLedger(ledger([report({ receivedAt })]), regions).errors.length).toBeGreaterThan(0);
  });

  it("accepts leap day but rejects invalid or backdated review dates", () => {
    expect(inspectCorrectionLedger(ledger([report({ receivedAt: "2024-02-29" })]), regions).errors).toEqual([]);
    for (const reviewedAt of ["2026-02-30", "2026-08-31"]) {
      expect(inspectCorrectionLedger(ledger([report({ status: "Accepted", review: { ...review, reviewedAt } })]), regions).errors.length).toBeGreaterThan(0);
    }
  });

  it("requires reviewer and reason with content", () => {
    for (const field of ["reviewer", "reason"]) {
      expect(inspectCorrectionLedger(ledger([report({ status: "Accepted", review: { ...review, [field]: " " } })]), regions).errors.length).toBeGreaterThan(0);
    }
  });

  it("rejects wrong shapes and sensitive extra fields without echoing input", () => {
    const secret = "private.contact@example.com";
    for (const raw of [
      null, [], { ...ledger([]), datasetVersion: "2025.1" },
      { ...ledger([]), [secret]: secret },
      ledger([report({ id: secret })]), ledger([report({ category: secret })]),
      ledger([report({ contact: secret })]),
      ledger([report({ status: "Accepted", review: { ...review, [secret]: secret } })]),
    ]) {
      const result = inspectCorrectionLedger(raw, regions);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.summary).toBeUndefined();
      expect(JSON.stringify(result)).not.toContain(secret);
    }
  });

  it("CLI uses exit code 2 for usage errors", () => {
    for (const args of [[], ["first.json", "second.json"]]) {
      const result = runCli(...args);
      expect(result.status).toBe(2);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("Usage:");
    }
  }, 30000);

  it("CLI publishes deterministic aggregates and gives safe errors", () => {
    const directory = mkdtempSync(join(tmpdir(), "nafkah-ledger-"));
    const path = join(directory, "private.contact@example.com.json");
    try {
      writeFileSync(path, JSON.stringify(ledger([report({ status: "Accepted", review, release: "2026.2" })])));
      const valid = runCli(path);
      expect(valid.status).toBe(0);
      expect(valid.stderr).toBe("");
      expect(JSON.parse(valid.stdout)).toEqual({ countsByStatus: { New: 0, "In review": 0, "Need more info": 0, Accepted: 1, Rejected: 0 }, released: 1 });
      expect(runCli(path).stdout).toBe(valid.stdout);
      expect(readFileSync(path, "utf8")).toContain(review.reason);
      for (const invalid of ["broken private.contact@example.com", JSON.stringify(ledger([report({ contact: "private.contact@example.com" })]))]) {
        writeFileSync(path, invalid);
        const result = runCli(path);
        expect(result.status).toBe(1);
        expect(result.stdout).toBe("");
        expect(result.stderr).not.toContain("private.contact@example.com");
      }
      const missing = runCli(join(directory, "missing-private.contact@example.com.json"));
      expect(missing.status).toBe(1);
      expect(missing.stderr).not.toContain("private.contact@example.com");
    } finally {
      unlinkSync(path);
      rmdirSync(directory);
    }
  }, 30000);
});
