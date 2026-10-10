"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { bandTheme } from "@/lib/bands";
import { AFFORDABILITY_BANDS } from "@/lib/calculations";
import { pct } from "@/lib/format";
import type { RankedRegion } from "@/lib/insights";

/**
 * Every region as one dot along the coverage axis, stacked into a symmetric
 * dot-density strip. Hover links to the map; click opens the region.
 */
export function DotStrip({
  ranked,
  dark,
  median,
  focusCode = null,
  hoverCode = null,
  onHover,
  onSelect,
  height = 96,
}: {
  ranked: RankedRegion[];
  dark: boolean;
  median: number;
  focusCode?: string | null;
  hoverCode?: string | null;
  onHover?: (code: string | null) => void;
  onSelect?: (code: string) => void;
  height?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(360);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setWidth(Math.max(200, e.contentRect.width)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const theme = bandTheme(dark);
  // 50–150% frames the default profile; a high salary or a frugal profile
  // pushes regions past it, so the axis widens to keep ~98% of dots apart.
  const { lo, hi, ticks } = useMemo(() => domainFor(ranked), [ranked]);
  const padX = 6;
  const axisY = height - 18;
  const plotH = axisY - 10;
  const x = (v: number) =>
    padX +
    ((Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo)) * (width - padX * 2);

  const dots = useMemo(() => {
    const d = 4.6;
    const bins = new Map<number, RankedRegion[]>();
    for (const r of ranked) {
      const b = Math.round(x(r.metric.coveragePercent) / d);
      const list = bins.get(b);
      if (list) list.push(r);
      else bins.set(b, [r]);
    }
    const out: { r: RankedRegion; cx: number; cy: number }[] = [];
    const mid = 10 + plotH / 2;
    for (const [b, list] of bins) {
      const spacing = Math.min(
        d * 0.98,
        (plotH - d) / Math.max(1, list.length - 1),
      );
      list.forEach((r, i) => {
        const k = Math.ceil(i / 2) * (i % 2 === 0 ? 1 : -1);
        out.push({ r, cx: b * d, cy: mid + k * spacing });
      });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ranked, width, height, lo, hi]);

  const [local, setLocal] = useState<string | null>(null);
  const active = hoverCode ?? local;
  const activeDot = active ? dots.find((d) => d.r.code === active) : undefined;
  const focusDot = focusCode
    ? dots.find((d) => d.r.code === focusCode)
    : undefined;

  const pick = (clientX: number, clientY: number) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    let best: (typeof dots)[number] | null = null;
    let bestD = 140;
    for (const d of dots) {
      const dd = (d.cx - px) ** 2 + (d.cy - py) ** 2;
      if (dd < bestD) {
        bestD = dd;
        best = d;
      }
    }
    return best;
  };

  const b = AFFORDABILITY_BANDS;
  const thresholds = [b.tightAt, b.manageableAt, b.comfortableAt];

  return (
    <div ref={wrapRef} className="relative select-none" style={{ height }}>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={`Sebaran cakupan ${ranked.length} daerah, median ${pct(median, 1)}`}
        onMouseMove={(e) => {
          const d = pick(e.clientX, e.clientY);
          const code = d?.r.code ?? null;
          setLocal(code);
          onHover?.(code);
        }}
        onMouseLeave={() => {
          setLocal(null);
          onHover?.(null);
        }}
        onClick={(e) => {
          const d = pick(e.clientX, e.clientY);
          if (d) onSelect?.(d.r.code);
        }}
        className={onSelect ? "cursor-pointer" : undefined}
      >
        {thresholds.map((t) => (
          <line
            key={t}
            x1={x(t)}
            x2={x(t)}
            y1={4}
            y2={axisY}
            stroke={t === b.manageableAt ? "var(--muted)" : "var(--rule-2)"}
            strokeWidth={t === b.manageableAt ? 1.2 : 1}
            strokeDasharray={t === b.manageableAt ? undefined : "2 3"}
          />
        ))}
        {dots.map(({ r, cx, cy }) => {
          const muted = Boolean(focusCode) && r.code !== focusCode;
          return (
            <circle
              key={r.code}
              cx={cx}
              cy={cy}
              r={2.15}
              fill={theme[r.metric.band].fill}
              opacity={muted ? 0.28 : 0.95}
            />
          );
        })}
        {focusDot && (
          <>
            <line
              x1={focusDot.cx}
              x2={focusDot.cx}
              y1={10}
              y2={axisY}
              stroke="var(--ink)"
              strokeWidth={1.2}
            />
            <circle
              cx={focusDot.cx}
              cy={focusDot.cy}
              r={5.5}
              fill={theme[focusDot.r.metric.band].fill}
              stroke="var(--ink)"
              strokeWidth={2}
            />
          </>
        )}
        {activeDot && (
          <circle
            cx={activeDot.cx}
            cy={activeDot.cy}
            r={4.5}
            fill="none"
            stroke="var(--ink)"
            strokeWidth={1.6}
          />
        )}
        <line
          x1={padX}
          x2={width - padX}
          y1={axisY}
          y2={axisY}
          stroke="var(--rule-2)"
        />
        {ticks.map((t) => (
          <text
            key={t}
            x={x(t)}
            y={axisY + 13}
            textAnchor="middle"
            className="tnum"
            fontSize={10.5}
            fill="var(--muted)"
          >
            {t}%
          </text>
        ))}
        <path
          d={`M${x(median) - 4},${2} L${x(median) + 4},${2} L${x(median)},${7} Z`}
          fill="var(--ink)"
          aria-hidden="true"
        />
      </svg>
      {activeDot && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-[6px] bg-ink px-2 py-1 text-[11.5px] font-medium text-paper shadow-[var(--shadow)]"
          style={{
            left: Math.min(Math.max(activeDot.cx, 70), width - 70),
            top: activeDot.cy - 8,
          }}
        >
          {activeDot.r.label} ·{" "}
          <span className="tnum">
            {pct(activeDot.r.metric.coveragePercent)}
          </span>
        </div>
      )}
    </div>
  );
}

function domainFor(ranked: RankedRegion[]): {
  lo: number;
  hi: number;
  ticks: number[];
} {
  const values = ranked
    .map((r) => r.metric.coveragePercent)
    .sort((a, b) => a - b);
  const at = (q: number) =>
    values[Math.min(values.length - 1, Math.floor(q * values.length))] ?? 100;
  const lo = Math.min(50, Math.floor(at(0.01) / 10) * 10);
  const hi = Math.max(150, Math.ceil(at(0.99) / 10) * 10);
  const range = hi - lo;
  const step = range <= 120 ? 20 : range <= 260 ? 50 : 100;
  const ticks: number[] = [];
  for (
    let t = Math.ceil((lo + step / 2) / step) * step;
    t < hi - step / 3;
    t += step
  )
    ticks.push(t);
  return { lo, hi, ticks };
}
