import type { BookletFacts } from "@/data/bookletFacts";
import { BAND_ORDER } from "@/lib/bands";
import type { AffordabilityBand } from "@/lib/types";

/** Where the map shapes live: built by app/(atlas)/booklet/peta.svg. */
export const SPRITE = "/booklet/peta.svg";

/** A band's merged shape: `set` is "all" (detailed) or a household id. */
export const fillRef = (set: string, band: AffordabilityBand) =>
  `${SPRITE}#bk-${set}-${band}`;
export const BORDERS_REF = `${SPRITE}#bk-borders`;
export const PROVINCES_REF = `${SPRITE}#bk-provinces`;

/** Every map shape the booklet draws, as one SVG of <path> definitions. */
export function mapSprite(f: BookletFacts): string {
  const paths: string[] = [];
  const add = (id: string, d: string | undefined, extra = "") => {
    // Path data is digits, signs and M/l/z only: safe as an attribute.
    if (d) paths.push(`<path id="${id}" d="${d}"${extra}/>`);
  };
  for (const band of BAND_ORDER) add(`bk-all-${band}`, f.map.fills[band]);
  for (const h of f.households) {
    for (const band of BAND_ORDER) add(`bk-${h.id}-${band}`, h.fills[band]);
  }
  // Borders keep their width however far a window zooms in.
  const hairline = ' vector-effect="non-scaling-stroke"';
  add("bk-borders", f.map.regionBorders, hairline);
  add("bk-provinces", f.map.provinceBorders, hairline);
  return `<svg xmlns="http://www.w3.org/2000/svg"><defs>${paths.join("")}</defs></svg>\n`;
}
