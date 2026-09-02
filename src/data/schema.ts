import { z } from "zod";
import type { ExpenseCategoryKey } from "@/lib/types";

/**
 * Dataset reliability gate (AP-02).
 *
 * Zod schemas are the single source of truth for what a valid record looks
 * like. `validateDataset` is run in CI via `dataset.test.ts`, so a bad record
 * — missing provenance, malformed kode wilayah, a wage/cost with no region,
 * an incomplete category set — fails the build instead of shipping.
 *
 * This file is imported only by the test, never by runtime/client code, so
 * zod stays out of the browser bundle.
 */

/** Bump when the dataset's shape or vintage changes; surfaced in changelog. */
export const DATASET_VERSION = "2026.1";

/** Exactly the 514 kabupaten/kota per Kepmendagri 100.1.1-6117. */
export const EXPECTED_REGION_COUNT = 514;

const KODE_WILAYAH = /^\d{2}\.\d{2}$/; // e.g. "31.73"
const PROV_CODE = /^\d{2}$/; // e.g. "31"
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/; // asOf

const EXPENSE_KEYS: ExpenseCategoryKey[] = [
  "housing",
  "food",
  "transport",
  "utilities",
  "connectivity",
  "healthcare",
  "personalCare",
  "leisure",
  "education",
  "contingency",
];

export const confidenceSchema = z.enum(["official", "estimate", "sample"]);

/** Every displayed number must carry these three. No exceptions. */
export const provenanceSchema = z.object({
  source: z.string().trim().min(8, "source too short to be checkable"),
  asOf: z.string().regex(ISO_DATE, "asOf must be ISO YYYY-MM-DD"),
  confidence: confidenceSchema,
});

// Indonesia bounding box (rough): lng 94–142, lat -11–7.
const centroidSchema = z
  .tuple([z.number().min(94).max(142), z.number().min(-11).max(7)])
  .describe("[lng, lat] within Indonesia");

export const regionSchema = z.object({
  code: z.string().regex(KODE_WILAYAH, "kode wilayah must be NN.NN"),
  name: z.string().trim().min(1),
  province: z.string().trim().min(1),
  provinceCode: z.string().regex(PROV_CODE),
  centroid: centroidSchema,
  tier: z.enum(["metro", "kota", "kabupaten"]),
});

export const wageSchema = provenanceSchema.extend({
  regionCode: z.string().regex(KODE_WILAYAH),
  year: z.number().int().gte(2000).lte(2100),
  grossMonthly: z.number().int().positive(),
  estimatedTakeHomeMonthly: z.number().int().positive(),
}).refine((w) => w.estimatedTakeHomeMonthly <= w.grossMonthly, {
  message: "take-home cannot exceed gross",
  path: ["estimatedTakeHomeMonthly"],
});

export const categoryValueSchema = provenanceSchema.extend({
  amount: z.number().nonnegative(),
});

export const costProfileSchema = z.object({
  regionCode: z.string().regex(KODE_WILAYAH),
  baseline: z.object(
    Object.fromEntries(EXPENSE_KEYS.map((k) => [k, categoryValueSchema])) as Record<
      ExpenseCategoryKey,
      typeof categoryValueSchema
    >,
  ),
});

export interface DatasetInput {
  regions: { code: string; provinceCode?: string }[];
  wages: { regionCode: string }[];
  costs: { regionCode: string }[];
}

/**
 * Validate the whole dataset: every record against its schema, plus the
 * cross-record integrity the per-record schemas can't see (region count,
 * unique codes, and wage/cost ⇄ region join completeness). Returns a flat
 * list of human-readable problems — empty means the dataset is releasable.
 */
export function validateDataset(input: {
  regions: unknown[];
  wages: unknown[];
  costs: unknown[];
}): string[] {
  const problems: string[] = [];

  const regions: { code: string }[] = [];
  input.regions.forEach((r, i) => {
    const res = regionSchema.safeParse(r);
    if (res.success) regions.push(res.data);
    else problems.push(`region[${i}]: ${issues(res.error)}`);
  });

  input.wages.forEach((w, i) => {
    const res = wageSchema.safeParse(w);
    if (!res.success) problems.push(`wage[${i}]: ${issues(res.error)}`);
  });

  input.costs.forEach((c, i) => {
    const res = costProfileSchema.safeParse(c);
    if (!res.success) problems.push(`cost[${i}]: ${issues(res.error)}`);
  });

  // Cross-record integrity.
  const codes = new Set<string>();
  for (const r of regions) {
    if (codes.has(r.code)) problems.push(`duplicate region code ${r.code}`);
    codes.add(r.code);
  }
  if (regions.length !== EXPECTED_REGION_COUNT) {
    problems.push(
      `expected ${EXPECTED_REGION_COUNT} regions, got ${regions.length}`,
    );
  }

  const wageCodes = new Set(
    (input.wages as { regionCode?: string }[])
      .map((w) => w.regionCode)
      .filter((c): c is string => typeof c === "string"),
  );
  const costCodes = new Set(
    (input.costs as { regionCode?: string }[])
      .map((c) => c.regionCode)
      .filter((c): c is string => typeof c === "string"),
  );
  for (const code of codes) {
    if (!wageCodes.has(code)) problems.push(`region ${code} has no wage record`);
    if (!costCodes.has(code)) problems.push(`region ${code} has no cost profile`);
  }
  for (const code of wageCodes) {
    if (!codes.has(code)) problems.push(`wage references unknown region ${code}`);
  }
  for (const code of costCodes) {
    if (!codes.has(code)) problems.push(`cost references unknown region ${code}`);
  }

  return problems;
}

function issues(err: z.ZodError): string {
  return err.issues
    .map((i) => `${i.path.join(".") || "(root)"} ${i.message}`)
    .join("; ");
}
