import { mapSprite } from "@/components/booklet/sprite";
import { bookletFacts } from "@/data/bookletFacts";

/*
 * The booklet's map shapes as one static SVG, built with the site. The
 * sheets draw them with <use href="/booklet/peta.svg#…">, so ~120 KB of
 * paths load once and stay cached instead of riding inside the HTML and
 * again in its React payload.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(mapSprite(bookletFacts()), {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8" },
  });
}
