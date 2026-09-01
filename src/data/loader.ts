import type { CostProfile, WageRecord } from "@/lib/types";
import { COST_BY_REGION } from "./costs";
import { WAGE_BY_REGION } from "./wages";
import { topologyToFeatureCollection } from "@/lib/geometry";
import type { RegionFeatureProps } from "@/lib/types";
import type { FeatureCollection, Geometry } from "geojson";

/**
 * Data access layer. Geometry and data records are fetched as separate
 * promises so the map can render before data arrives.
 *
 * Geometry is a real network fetch of the static TopoJSON asset. Wage/cost
 * records are local modules for now; the artificial delay keeps the loading
 * states real and swappable — to go live, replace `loadRecords` with an API
 * call and keep the same return shape.
 */

export async function loadGeometry(): Promise<
 FeatureCollection<Geometry, RegionFeatureProps>
> {
 const res = await fetch("/data/regions.topojson");
 if (!res.ok) throw new Error(`Geometry fetch failed: HTTP ${res.status}`);
 const topology = await res.json();
 return topologyToFeatureCollection(topology);
}

export async function loadRecords(): Promise<{
 wages: Map<string, WageRecord>;
 costs: Map<string, CostProfile>;
}> {
 // Simulated latency so loading states are exercised; remove when wired to an API.
 await new Promise((r) => setTimeout(r, 350));
 return { wages: WAGE_BY_REGION, costs: COST_BY_REGION };
}
