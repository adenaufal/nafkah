import type { Region, RegionTier } from "./types";

/*
 * The dataset names kota with their prefix ("Kota Bandung") and kabupaten
 * without one ("Bandung"), so bare names collide: Bandung, Bogor, Bekasi,
 * Cirebon… all exist twice. These helpers make the tier explicit wherever a
 * name stands alone.
 */

type Named = Pick<Region, "name" | "tier">;

/** "Kota Bandung" / "Kab. Bandung" — lists, chips, tooltips, search. */
export function regionLabel(region: Named): string {
  return region.tier === "kabupaten" ? `Kab. ${region.name}` : region.name;
}

/** "Kota Bandung" / "Kabupaten Bandung" — headings. */
export function regionTitle(region: Named): string {
  return region.tier === "kabupaten" ? `Kabupaten ${region.name}` : region.name;
}

export function tierLabel(tier: RegionTier | string): string {
  return tier === "kabupaten" ? "Kabupaten" : "Kota";
}
