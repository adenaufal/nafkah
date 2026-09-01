import type { Region } from "@/lib/types";
import { ALL_REGIONS } from "./provinces";

export const REGIONS: Region[] = ALL_REGIONS;
export const REGION_BY_CODE = new Map(REGIONS.map((r) => [r.code, r]));

