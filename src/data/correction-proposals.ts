import { z } from "zod";
import {
  narrativeSchema,
  provenanceSchema,
  validateDataset,
} from "@/data/schema";

const category = z.enum([
  "housing", "food", "transport", "utilities", "connectivity",
  "healthcare", "personalCare", "leisure", "education", "contingency",
]);
const reviewSchema = z.object({
  status: z.literal("Accepted"),
  reviewer: z.string().trim().min(2),
  reason: z.string().trim().min(8),
  reviewedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
}).strict();
const common = {
  regionCode: z.string().regex(/^\d{2}\.\d{2}$/),
  currentValue: z.number().finite(),
  proposedValue: z.number().finite(),
  provenance: provenanceSchema,
  review: reviewSchema,
};
const rentRangeValueSchema = z.object({
  min: narrativeSchema.shape.rentRange.shape.min,
  max: narrativeSchema.shape.rentRange.shape.max,
  note: narrativeSchema.shape.rentRange.shape.note,
}).strict().refine((rent) => rent.max >= rent.min, { path: ["max"] });
const changeSchema = z.discriminatedUnion("kind", [
  z.object({
    ...common,
    kind: z.literal("wage"),
    field: z.enum(["grossMonthly", "estimatedTakeHomeMonthly"]),
  }).strict(),
  z.object({ ...common, kind: z.literal("cost"), category }).strict(),
  z.object({
    ...common,
    kind: z.literal("rentRange"),
    currentValue: rentRangeValueSchema,
    proposedValue: rentRangeValueSchema,
  }).strict(),
]);

export const correctionProposalSchema = z.object({
  datasetVersion: z.literal("2026.1"),
  changes: z.array(changeSchema).min(1),
}).strict();

export type CorrectionProposal = z.infer<typeof correctionProposalSchema>;

const safeProposalFields = new Set([
  "datasetVersion", "changes", "regionCode", "currentValue", "proposedValue",
  "provenance", "review", "status", "reviewer", "reason", "reviewedAt",
  "source", "asOf", "confidence", "kind", "field", "category", "min", "max", "note",
]);

function safeSchemaErrors(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.map((part) => typeof part === "number"
      ? `[${part}]`
      : safeProposalFields.has(String(part)) ? String(part) : "field").join(".");
    return `${path || "proposal"}: invalid proposal schema`;
  });
}

/** Validates and applies a reviewed proposal to copies of shipped data only. */
export function validateCorrectionProposal(
  raw: unknown,
  dataset: { regions: unknown[]; wages: unknown[]; costs: unknown[]; narratives: unknown[] },
): string[] {
  const parsed = correctionProposalSchema.safeParse(raw);
  if (!parsed.success) return safeSchemaErrors(parsed.error);

  const problems: string[] = [];
  const proposal = parsed.data;
  const regionCodes = new Set(dataset.regions.flatMap((r) =>
    r && typeof r === "object" && "code" in r && typeof r.code === "string" ? [r.code] : [],
  ));
  const wageByRegion = new Map<string, Record<string, unknown>>();
  for (const wage of dataset.wages) {
    if (wage && typeof wage === "object" && "regionCode" in wage && typeof wage.regionCode === "string") {
      wageByRegion.set(wage.regionCode, wage as Record<string, unknown>);
    }
  }
  const costByRegion = new Map<string, Record<string, unknown>>();
  for (const cost of dataset.costs) {
    if (cost && typeof cost === "object" && "regionCode" in cost && typeof cost.regionCode === "string") {
      costByRegion.set(cost.regionCode, cost as Record<string, unknown>);
    }
  }
  const seen = new Set<string>();
  const narrativeByRegion = new Map<string, Record<string, unknown>>();
  for (const narrative of dataset.narratives) {
    if (narrative && typeof narrative === "object" && "regionCode" in narrative && typeof narrative.regionCode === "string") {
      narrativeByRegion.set(narrative.regionCode, narrative as Record<string, unknown>);
    }
  }
  const wageProvenanceByRegion = new Map<string, string>();
  const wages = structuredClone(dataset.wages) as Record<string, unknown>[];
  const costs = structuredClone(dataset.costs) as Record<string, unknown>[];
  const narratives = structuredClone(dataset.narratives) as Record<string, unknown>[];

  for (const [index, change] of proposal.changes.entries()) {
    const targetId = change.kind === "wage"
      ? `${change.regionCode}:wage:${change.field}`
      : change.kind === "cost" ? `${change.regionCode}:cost:${change.category}`
      : `${change.regionCode}:rentRange`;
    if (seen.has(targetId)) problems.push(`changes[${index}]: duplicate target`);
    seen.add(targetId);

    if (!regionCodes.has(change.regionCode)) {
      problems.push(`changes[${index}]: unknown region`);
      continue;
    }
    if (change.kind === "wage") {
      const provenanceKey = JSON.stringify(change.provenance);
      const previousProvenance = wageProvenanceByRegion.get(change.regionCode);
      if (previousProvenance && previousProvenance !== provenanceKey) {
        problems.push(`changes[${index}]: conflicting wage provenance for region`);
      } else {
        wageProvenanceByRegion.set(change.regionCode, provenanceKey);
      }
      const row = wageByRegion.get(change.regionCode);
      if (!row || typeof row !== "object" || !(change.field in row)) {
        problems.push(`changes[${index}]: wage target unavailable`);
        continue;
      }
      if (row[change.field] !== change.currentValue) {
        problems.push(`changes[${index}]: stale currentValue`);
        continue;
      }
      const copy = wages.find((w) => w.regionCode === change.regionCode);
      if (copy) Object.assign(copy, { [change.field]: change.proposedValue, ...change.provenance });
    } else if (change.kind === "cost") {
      const row = costByRegion.get(change.regionCode);
      const baseline = row && typeof row === "object" && "baseline" in row
        ? row.baseline as Record<string, unknown> : undefined;
      const value = baseline && typeof baseline === "object" && change.category in baseline
        ? baseline[change.category] : undefined;
      if (!value || typeof value !== "object" || !("amount" in value)) {
        problems.push(`changes[${index}]: cost category unavailable`);
        continue;
      }
      if (value.amount !== change.currentValue) {
        problems.push(`changes[${index}]: stale currentValue`);
        continue;
      }
      const copy = costs.find((c) => c.regionCode === change.regionCode);
      const costBase = copy?.baseline as Record<string, Record<string, unknown>> | undefined;
      if (costBase?.[change.category]) Object.assign(costBase[change.category], { amount: change.proposedValue, ...change.provenance });
    } else {
      const row = narrativeByRegion.get(change.regionCode);
      const range = row?.rentRange;
      if (!range || typeof range !== "object" || !("min" in range) || !("max" in range) || !("note" in range)) {
        problems.push(`changes[${index}]: rentRange target unavailable`);
        continue;
      }
      if (range.min !== change.currentValue.min || range.max !== change.currentValue.max || range.note !== change.currentValue.note) {
        problems.push(`changes[${index}]: stale currentValue`);
        continue;
      }
      const copy = narratives.find((n) => n.regionCode === change.regionCode);
      if (copy) copy.rentRange = { ...change.proposedValue, provenance: change.provenance };
    }
  }

  if (problems.length === 0) {
    problems.push(...validateDataset({ ...dataset, wages, costs, narratives }));
  }
  return problems;
}
