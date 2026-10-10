"use client";

import { useState } from "react";
import { bandTheme } from "@/lib/bands";
import { pct } from "@/lib/format";
import type { RankedRegion } from "@/lib/insights";

const WINDOW = 7;

/**
 * Every region in the same province, most to least covered, with the current
 * one marked — "is the next kabupaten over any lighter?" in one glance.
 */
export function ProvincePeers({
  peers,
  code,
  dark,
  onSelect,
  onHover,
}: {
  peers: RankedRegion[];
  code: string;
  dark: boolean;
  onSelect: (code: string) => void;
  onHover: (code: string | null) => void;
}) {
  const [all, setAll] = useState(false);
  const theme = bandTheme(dark);
  const at = peers.findIndex((p) => p.code === code);
  const start =
    all || peers.length <= WINDOW
      ? 0
      : Math.min(
          Math.max(0, at - Math.floor(WINDOW / 2)),
          peers.length - WINDOW,
        );
  const shown = all ? peers : peers.slice(start, start + WINDOW);
  const max = Math.max(150, ...peers.map((p) => p.metric.coveragePercent));

  return (
    <div>
      <ol className="space-y-0.5" onMouseLeave={() => onHover(null)}>
        {shown.map((p) => {
          const rank = peers.indexOf(p) + 1;
          const current = p.code === code;
          return (
            <li key={p.code}>
              <button
                type="button"
                onClick={() => !current && onSelect(p.code)}
                onMouseEnter={() => onHover(p.code)}
                onFocus={() => onHover(p.code)}
                onBlur={() => onHover(null)}
                aria-current={current ? "true" : undefined}
                className={`grid w-full grid-cols-[22px_minmax(0,1fr)_72px_44px] items-center gap-2 rounded-[8px] px-1.5 py-1.5 text-left pointer-coarse:py-2.5 ${
                  current ? "bg-paper-2" : "hover:bg-paper-2"
                }`}
              >
                <span className="tnum text-right text-[11.5px] text-muted">
                  {rank}
                </span>
                <span
                  className={`truncate text-[13.5px] ${current ? "font-bold" : "font-medium"}`}
                >
                  {p.label}
                </span>
                <span
                  className="h-[5px] rounded-full bg-paper-3"
                  aria-hidden="true"
                >
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (p.metric.coveragePercent / max) * 100)}%`,
                      background: theme[p.metric.band].fill,
                    }}
                  />
                </span>
                <span
                  className="tnum text-right text-[13px] font-semibold"
                  style={{ color: theme[p.metric.band].ink }}
                >
                  {pct(p.metric.coveragePercent)}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {peers.length > WINDOW && (
        <button
          type="button"
          onClick={() => setAll((v) => !v)}
          aria-expanded={all}
          className="mt-2 text-[12.5px] font-semibold text-accent-ink underline decoration-rule-2 underline-offset-2 hover:decoration-accent"
        >
          {all ? "Ringkas daftar" : `Lihat semua ${peers.length} daerah`}
        </button>
      )}
    </div>
  );
}
