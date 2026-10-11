import type { BookletFacts, BookletRegion } from "@/data/bookletFacts";
import { BAND_ORDER, bandTheme } from "@/lib/bands";
import { AFFORDABILITY_BANDS } from "@/lib/calculations";
import { dotDomain, dotScale, stackDots } from "@/lib/dotStrip";
import { pct } from "@/lib/format";
import type { AffordabilityBand } from "@/lib/types";
import type { Point } from "@/lib/svgMap";
import { BORDERS_REF, fillRef, PROVINCES_REF } from "./sprite";

/** Sheets are paper in both themes, so figures use the light band palette. */
export const BAND = bandTheme(false);

/*
 * Map shapes come from one cached SVG (see ./sprite): the cover and both
 * regional maps share one set of paths, and the small multiples share the
 * province borders.
 */

export interface MapLabel {
  text: string;
  at: Point;
}

/**
 * Indonesia coloured by band. `view` crops to a window in map units;
 * `set` picks the detailed default map ("all") or a household's.
 */
export function IndonesiaMap({
  facts,
  label,
  set = "all",
  view,
  counts,
  borders = "regions",
  labels = [],
  className = "",
}: {
  facts: BookletFacts;
  /** Text alternative: what the map shows, with the counts. */
  label: string;
  set?: string;
  view?: [number, number, number, number];
  /** Which bands to draw (the bands that have regions). */
  counts: Record<AffordabilityBand, number>;
  borders?: "regions" | "provinces";
  labels?: MapLabel[];
  className?: string;
}) {
  const { map } = facts;
  const [x, y, w, h] = view ?? [0, 0, map.width, map.height];
  // One CSS pixel at the sheet's text width (178 mm ≈ 673 px), in map
  // units: labels print at the same size on every window.
  const px = w / 673;
  return (
    <svg
      viewBox={`${x} ${y} ${w} ${h}`}
      role="img"
      aria-label={label}
      className={`block h-auto w-full ${className}`}
    >
      {BAND_ORDER.filter((band) => counts[band] > 0).map((band) => (
        <use
          key={band}
          href={fillRef(set, band)}
          fill={BAND[band].fill}
          fillRule="evenodd"
        />
      ))}
      {borders === "regions" && (
        <use
          href={BORDERS_REF}
          fill="none"
          stroke="#fff"
          strokeWidth={0.45}
          strokeLinejoin="round"
          opacity={0.9}
        />
      )}
      <use
        href={PROVINCES_REF}
        fill="none"
        stroke="#fff"
        strokeWidth={borders === "regions" ? 1.3 : 0.7}
        strokeLinejoin="round"
      />
      {labels.map((l) => {
        const [lx, ly] = map.project(l.at);
        return (
          <text
            key={l.text}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={9.5 * px}
            fontWeight={600}
            letterSpacing={1.7 * px}
            fill="var(--ink-2)"
            stroke="#fff"
            strokeWidth={3 * px}
            strokeLinejoin="round"
            paintOrder="stroke"
            // Sized for paper; on a phone-width map they would be specks.
            className="hidden paper:inline"
          >
            {l.text}
          </text>
        );
      })}
    </svg>
  );
}

/**
 * Distribution as one bar: each band's share of the regions. With `spoken`,
 * screen readers get the counts the bar shows.
 */
export function BandBar({
  counts,
  className = "h-2.5",
  spoken = false,
}: {
  counts: Record<AffordabilityBand, number>;
  className?: string;
  spoken?: boolean;
}) {
  return (
    <>
      <span
        aria-hidden="true"
        className={`flex gap-[2px] overflow-hidden rounded-full ${className}`}
      >
        {BAND_ORDER.map((band) =>
          counts[band] > 0 ? (
            <span
              key={band}
              style={{ flexGrow: counts[band], background: BAND[band].fill }}
            />
          ) : null,
        )}
      </span>
      {spoken && (
        <span className="sr-only">
          {BAND_ORDER.map((band) => `${BAND[band].label} ${counts[band]}`).join(
            ", ",
          )}
        </span>
      )}
    </>
  );
}

/** Swatch, name, range and count for every band, in a row. */
export function BandKey({
  counts,
  className = "",
}: {
  counts?: Record<AffordabilityBand, number>;
  className?: string;
}) {
  return (
    <ul
      className={`tnum flex flex-wrap gap-x-5 gap-y-1.5 text-[12.5px] text-ink-2 paper:text-[10.5px] ${className}`}
    >
      {BAND_ORDER.map((band) => (
        <li key={band} className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
            style={{ background: BAND[band].fill }}
          />
          <b className="font-semibold text-ink">{BAND[band].label}</b>
          <span className="text-muted">{BAND[band].range}</span>
          {counts && (
            <span className="font-semibold text-ink">· {counts[band]}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * Many dots as one path of zero-length segments; drawn with a round cap
 * as wide as the dot, each segment is a circle. 514 dots become four
 * short attributes instead of 514 elements in the HTML and its payload.
 */
export function Dots({
  points,
  r,
  color,
}: {
  points: readonly { cx: number; cy: number }[];
  r: number;
  color: string;
}) {
  const n = (v: number) => Math.round(v * 10) / 10;
  return (
    <path
      d={points.map(({ cx, cy }) => `M${n(cx)} ${n(cy)}h0`).join("")}
      fill="none"
      stroke={color}
      strokeWidth={2 * r}
      strokeLinecap="round"
    />
  );
}

/**
 * Every region as one dot along the coverage axis — the strip from the
 * map's side panel, drawn at print size, with both ends named.
 */
export function DotPlot({
  regions,
  median,
}: {
  regions: readonly BookletRegion[];
  median: number;
}) {
  const width = 672;
  const height = 196;
  const padX = 8;
  const axisY = height - 22;
  const top = 26;
  const plotH = axisY - top - 6;
  const domain = dotDomain(regions.map((r) => r.coverage));
  const x = dotScale(domain, width, padX);
  const dots = stackDots(regions, (r) => x(r.coverage), {
    d: 6.2,
    mid: top + plotH / 2,
    plotH,
  });
  const b = AFFORDABILITY_BANDS;
  const first = regions[0];
  const last = regions[regions.length - 1];
  const mx = x(median);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Sebaran cakupan ${regions.length} daerah. Median ${pct(median, 1)}; tertinggi ${first.label} ${pct(first.coverage)}, terendah ${last.label} ${pct(last.coverage)}.`}
      className="block h-auto w-full"
    >
      {[b.tightAt, b.manageableAt, b.comfortableAt].map((t) => (
        <line
          key={t}
          x1={x(t)}
          x2={x(t)}
          y1={top - 6}
          y2={axisY}
          stroke={t === b.manageableAt ? "var(--muted)" : "var(--rule-2)"}
          strokeWidth={t === b.manageableAt ? 1.2 : 1}
          strokeDasharray={t === b.manageableAt ? undefined : "2 3"}
        />
      ))}
      {BAND_ORDER.map((band) => (
        <Dots
          key={band}
          points={dots.filter((p) => p.item.band === band)}
          r={2.8}
          color={BAND[band].fill}
        />
      ))}
      <line
        x1={padX}
        x2={width - padX}
        y1={axisY}
        y2={axisY}
        stroke="var(--rule-2)"
      />
      {domain.ticks.map((t) => (
        <text
          key={t}
          x={x(t)}
          y={axisY + 15}
          textAnchor="middle"
          fontSize={10.5}
          fill="var(--muted)"
          className="tnum"
        >
          {t}%
        </text>
      ))}
      <path d={`M${mx - 4.5} 3h9l-4.5 6z`} fill="var(--ink)" />
      <text x={mx + 8} y={10} fontSize={10.5} fill="var(--ink)" className="tnum">
        median {pct(median, 1)}
      </text>
      <text x={padX} y={10} fontSize={10.5} fill="var(--ink-2)">
        ← {last.label} {pct(last.coverage)}
      </text>
      <text
        x={width - padX}
        y={10}
        textAnchor="end"
        fontSize={10.5}
        fill="var(--ink-2)"
      >
        {first.label} {pct(first.coverage)} →
      </text>
    </svg>
  );
}
