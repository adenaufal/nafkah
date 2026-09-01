import type { Region } from "@/lib/types";
import { ALL_NARRATIVES } from "./provinces";

export interface RegionNarrative {
  regionCode: string;
  rentRange: { min: number; max: number; note: string };
  transportContext: string;
  interpretation: string;
}

export const NARRATIVES: RegionNarrative[] = ALL_NARRATIVES;
export const NARRATIVE_BY_REGION = new Map(
  NARRATIVES.map((n) => [n.regionCode, n]),
);

