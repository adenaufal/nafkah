import { z } from "zod";

const statuses = ["New", "In review", "Need more info", "Accepted", "Rejected"] as const;
const calendarDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return !value.startsWith("0000") && Number.isFinite(timestamp)
    && new Date(timestamp).toISOString().slice(0, 10) === value;
});
const reviewSchema = z.object({
  reviewer: z.string().trim().min(1).max(200),
  reason: z.string().trim().min(1).max(2000),
  reviewedAt: calendarDate,
}).strict();
const ledgerSchema = z.object({
  datasetVersion: z.literal("2026.1"),
  reports: z.array(z.object({
    id: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/),
    regionCode: z.string().regex(/^\d{2}\.\d{2}$/),
    category: z.enum([
      "wage", "housing", "food", "transport", "utilities", "connectivity",
      "healthcare", "personalCare", "leisure", "education", "contingency", "other",
    ]),
    status: z.enum(statuses),
    receivedAt: calendarDate,
    review: reviewSchema.optional(),
    release: z.string().regex(/^\d{4}\.[1-9]\d*$/).optional(),
  }).strict()),
}).strict();

export interface CorrectionLedgerSummary {
  countsByStatus: Record<typeof statuses[number], number>;
  released: number;
}

const safeFields = new Set([
  "datasetVersion", "reports", "id", "regionCode", "category", "status",
  "receivedAt", "review", "reviewer", "reason", "reviewedAt", "release",
]);

/** Inspect private local metadata; only aggregates leave a valid ledger. No writes. */
export function inspectCorrectionLedger(
  raw: unknown,
  regions: readonly { code: string }[],
): { errors: string[]; summary?: CorrectionLedgerSummary } {
  const parsed = ledgerSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.issues.map((issue) => {
      const path = issue.path.map((part) => typeof part === "number" ? `[${part}]`
        : safeFields.has(String(part)) ? String(part) : "field").join(".");
      return `${path || "ledger"}: invalid ledger schema`;
    }) };
  }

  const errors: string[] = [];
  const regionCodes = new Set(regions.map((region) => region.code));
  const seen = new Set<string>();
  const summary: CorrectionLedgerSummary = {
    countsByStatus: { New: 0, "In review": 0, "Need more info": 0, Accepted: 0, Rejected: 0 },
    released: 0,
  };
  for (const [index, report] of parsed.data.reports.entries()) {
    const path = `reports[${index}]`;
    if (seen.has(report.id)) errors.push(`${path}.id: duplicate report ID`);
    seen.add(report.id);
    if (!regionCodes.has(report.regionCode)) errors.push(`${path}.regionCode: unknown region`);
    if ((report.status === "Accepted" || report.status === "Rejected") && !report.review) {
      errors.push(`${path}.review: required decision review`);
    }
    if (report.status === "New" && report.review) {
      errors.push(`${path}.review: unexpected new-report review`);
    }
    if (report.review && report.review.reviewedAt < report.receivedAt) {
      errors.push(`${path}.review.reviewedAt: review predates receipt`);
    }
    if (report.release) {
      if (report.status !== "Accepted" || !report.review) {
        errors.push(`${path}.release: requires accepted reviewed report`);
      }
      const [releaseYear, releaseRevision] = report.release.split(".");
      const [baselineYear, baselineRevision] = parsed.data.datasetVersion.split(".");
      if (Number(releaseYear) < Number(baselineYear)
        || (releaseYear === baselineYear && BigInt(releaseRevision) <= BigInt(baselineRevision))) {
        errors.push(`${path}.release: release must follow reported dataset version`);
      }
      summary.released++;
    }
    summary.countsByStatus[report.status]++;
  }
  return errors.length ? { errors } : { errors, summary };
}
