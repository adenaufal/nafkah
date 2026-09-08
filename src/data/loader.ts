import type { CostProfile, Region, WageRecord } from "@/lib/types";
import type { RegionNarrative } from "@/data/narratives";
import { topologyToFeatureCollection } from "@/lib/geometry";
import type { RegionFeatureProps } from "@/lib/types";
import type { FeatureCollection, Geometry } from "geojson";

/**
 * Data access layer (AP-02). The dataset lives in versioned JSON files under
 * /data/v2026.1/ — see public/data/CHANGELOG.md for the dataset changelog.
 *
 * Geometry and the four data files are fetched separately so the map can
 * render before the numbers arrive; each failure is surfaced through the
 * data/geometry loading state machines with a retry.
 */

export const DATASET_BASE = "/data/v2026.1";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Data fetch failed: HTTP ${res.status} (${path})`);
  return (await res.json()) as T;
}

export async function loadGeometry(): Promise<
  FeatureCollection<Geometry, RegionFeatureProps>
> {
  const res = await fetch("/data/regions.topojson");
  if (!res.ok) throw new Error(`Geometry fetch failed: HTTP ${res.status}`);
  const topology = await res.json();
  return topologyToFeatureCollection(topology);
}

export async function loadDataset(): Promise<{
  regions: Region[];
  wages: Map<string, WageRecord>;
  costs: Map<string, CostProfile>;
  narratives: Map<string, RegionNarrative>;
}> {
  const [regions, wages, costs, narratives] = await Promise.all([
    fetchJson<Region[]>(`${DATASET_BASE}/regions.json`),
    fetchJson<WageRecord[]>(`${DATASET_BASE}/wages.json`),
    fetchJson<CostProfile[]>(`${DATASET_BASE}/costs.json`),
    fetchJson<RegionNarrative[]>(`${DATASET_BASE}/narratives.json`),
  ]);
  return {
    regions,
    wages: new Map(wages.map((w) => [w.regionCode, w])),
    costs: new Map(costs.map((c) => [c.regionCode, c])),
    narratives: new Map(narratives.map((n) => [n.regionCode, n])),
  };
}
