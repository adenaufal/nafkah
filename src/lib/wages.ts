import type { WageRecord } from "./types";

export type WageKind = "UMK" | "UMP";

/**
 * Whether a wage record is a regency/city minimum (UMK) or the provincial
 * minimum (UMP) that regions without their own UMK fall back to. The dataset
 * has no field for this, so it is read from the legal basis cited in
 * `source`; src/lib/wages.test.ts pins every current record to one of the
 * two patterns, so new wording fails CI instead of mislabelling.
 */
export function wageKind(
  record: Pick<WageRecord, "source"> | undefined,
): WageKind {
  return record && /upah minimum provinsi/i.test(record.source) ? "UMP" : "UMK";
}
