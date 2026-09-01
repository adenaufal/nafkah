import type { WageRecord } from "@/lib/types";
import { ALL_WAGES } from "./provinces";

export const WAGE_RECORDS: WageRecord[] = ALL_WAGES;
export const WAGE_BY_REGION = new Map(
  WAGE_RECORDS.map((w) => [w.regionCode, w]),
);

