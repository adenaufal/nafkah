/**
 * Narrative metadata for a region: local rent range, transport context and an
 * interpretation of its current affordability. The records themselves are
 * fetched at runtime from /data/v2026.1/narratives.json (see loader.ts);
 * this module only carries the shape and the lookup used by the UI.
 */
export interface RegionNarrative {
  regionCode: string;
  rentRange: { min: number; max: number; note: string };
  transportContext: string;
  interpretation: string;
}
