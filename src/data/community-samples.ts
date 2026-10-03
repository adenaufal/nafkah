import type { ExpenseCategoryKey } from "@/lib/types";
import { z } from "zod";

/** Publication policy, not a guarantee of anonymity or statistical representativeness. */
export const MIN_COMMUNITY_RESPONDENTS = 5;

const calendarDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const time = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
});
const opaqueId = z.string().regex(/^[A-Za-z0-9_-]{1,128}$/);
const profileSchema = z.object({
  householdSize: z.number().int().min(1).max(10),
  lifestyle: z.enum(["budget", "moderate", "comfortable"]),
  housing: z.enum(["room", "studio", "oneBedroom", "owner"]),
  transport: z.enum(["motorcycle", "publicTransport", "rideHailing", "none"]),
}).strict();
const observationSchema = z.object({
  id: opaqueId,
  respondentId: opaqueId,
  regionCode: z.string().regex(/^\d{2}\.\d{2}$/),
  category: z.enum(["housing", "food", "transport", "utilities", "connectivity", "healthcare", "personalCare", "leisure", "education", "contingency"]),
  monthlyAmount: z.number().finite().nonnegative(),
  observedAt: calendarDate,
  profile: profileSchema,
  status: z.enum(["Pending", "Accepted", "Rejected"]),
  review: z.object({ reviewer: z.string().trim().min(1), reason: z.string().trim().min(1), reviewedAt: calendarDate }).strict().optional(),
}).strict().superRefine((value, ctx) => {
  if ((value.status === "Pending" && value.review !== undefined) || (value.status !== "Pending" && value.review === undefined)) {
    ctx.addIssue({ code: "custom", message: "Invalid moderation state" });
  }
  if (value.review && value.review.reviewedAt < value.observedAt) {
    ctx.addIssue({ code: "custom", message: "Review precedes observation" });
  }
});
const envelopeSchema = z.object({
  source: z.string().trim().min(8),
  period: z.object({ start: calendarDate, end: calendarDate }).strict(),
  observations: z.array(observationSchema),
}).strict().superRefine((value, ctx) => {
  if (value.period.start > value.period.end) ctx.addIssue({ code: "custom", message: "Invalid reporting period" });
  value.observations.forEach((observation, index) => {
    if (observation.observedAt < value.period.start || observation.observedAt > value.period.end) {
      ctx.addIssue({ code: "custom", path: ["observations", index], message: "Outside reporting period" });
    }
  });
});

export interface CommunitySummary {
  regionCode: string;
  category: ExpenseCategoryKey;
  profile: z.infer<typeof profileSchema>;
  sampleSize: number;
  median: number;
  min: number;
  max: number;
  period: { start: string; end: string };
  source: string;
  asOf: string;
  confidence: "sample";
}

/** Private inputs never appear in diagnostics; validation fails closed for the entire batch. */
export function summarizeCommunitySamples(raw: unknown, regions: readonly { code: string }[]): { errors: string[]; summaries: CommunitySummary[] } {
  const parsed = envelopeSchema.safeParse(raw);
  if (!parsed.success) return { errors: ["Invalid community input schema, dates, or moderation state."], summaries: [] };
  const { observations, period, source } = parsed.data;
  const regionCodes = new Set(regions.map((region) => region.code));
  const seenIds = new Set<string>();
  const seenRespondents = new Map<string, Set<string>>();
  const groups = new Map<string, { observation: z.infer<typeof observationSchema>; amounts: number[] }>();
  const errors = new Set<string>();
  for (const observation of observations) {
    if (!regionCodes.has(observation.regionCode)) errors.add("Unknown community region.");
    if (seenIds.has(observation.id)) errors.add("Duplicate community observation ID.");
    seenIds.add(observation.id);
    const { householdSize, lifestyle, housing, transport } = observation.profile;
    const key = JSON.stringify([observation.regionCode, observation.category, householdSize, lifestyle, housing, transport]);
    const respondents = seenRespondents.get(key) ?? new Set<string>();
    if (respondents.has(observation.respondentId)) errors.add("Duplicate community respondent within a cohort.");
    respondents.add(observation.respondentId);
    seenRespondents.set(key, respondents);
    if (observation.status !== "Accepted") continue;
    const group = groups.get(key) ?? { observation, amounts: [] };
    group.amounts.push(observation.monthlyAmount);
    groups.set(key, group);
  }
  if (errors.size) return { errors: [...errors], summaries: [] };
  const summaries: CommunitySummary[] = [];
  // Sorting canonical cohort keys keeps output deterministic when input ordering changes.
  for (const [, { observation, amounts }] of [...groups.entries()].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)) {
    if (amounts.length < MIN_COMMUNITY_RESPONDENTS) continue;
    const sorted = [...amounts].sort((a, b) => a - b);
    const midpoint = Math.floor(sorted.length / 2);
    // Halves avoid overflow for valid finite input values near Number.MAX_VALUE.
    const median = sorted.length % 2 ? sorted[midpoint] : sorted[midpoint - 1] / 2 + sorted[midpoint] / 2;
    summaries.push({
      regionCode: observation.regionCode, category: observation.category, profile: { ...observation.profile },
      sampleSize: sorted.length, median, min: sorted[0], max: sorted[sorted.length - 1],
      period: { ...period }, source, asOf: period.end, confidence: "sample",
    });
  }
  return { errors: [], summaries };
}
