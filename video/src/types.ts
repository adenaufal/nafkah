export type AffordabilityBand =
  | "comfortable"
  | "manageable"
  | "tight"
  | "insufficient";

export type BandCounts = Record<AffordabilityBand, number>;
