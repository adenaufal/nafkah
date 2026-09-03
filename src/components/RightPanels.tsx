"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/state/AppContext";
import {
  AFFORDABILITY_BANDS,
  BAND_LABEL,
  VALUE_RAMP,
  bandColors,
} from "@/lib/calculations";
import { REGION_BY_CODE } from "@/data/regions";
import { formatPct } from "@/lib/format";
import type { AffordabilityBand, BasemapId, ColorMode } from "@/lib/types";

const BAND_ORDER: AffordabilityBand[] = [
  "comfortable",
  "manageable",
  "tight",
  "insufficient",
];

const COLOR_MODES: { id: ColorMode; label: string; hint: string }[] = [
  { id: "coverage", label: "Cakupan", hint: "Upah ÷ estimasi biaya" },
  { id: "cost", label: "Biaya", hint: "Estimasi rupiah bulanan" },
  { id: "wage", label: "Upah", hint: "Rupiah UMK" },
];

const BASEMAPS: { id: BasemapId; label: string }[] = [
  { id: "light", label: "Terang" },
  { id: "dark", label: "Gelap" },
  { id: "satellite", label: "Satelit" },
  { id: "offline", label: "Offline" },
];

/** Eyebrow used across the sequential card. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10.5px] font-bold uppercase tracking-[0.09em] text-muted">
      {children}
    </h3>
  );
}

/** Block 1: choose what the choropleth encodes. */
export function ColorModeControls() {
  const { state, setColorMode } = useApp();
  return (
    <div>
      <Eyebrow>Warnai berdasarkan</Eyebrow>
      <div
        role="radiogroup"
        aria-label="Tipe warna choropleth"
        className="mt-2 grid grid-cols-3 gap-1.5"
      >
        {COLOR_MODES.map((m) => {
          const active = state.colorMode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={active}
              title={m.hint}
              onClick={() => setColorMode(m.id)}
              className={`h-[34px] min-w-0 rounded-[9px] border text-center text-xs transition-colors ${
                active
                  ? "border-accent bg-accent font-bold text-on-accent"
                  : "border-border text-muted hover:border-accent hover:bg-accent-soft"
              }`}
            >
              <span className="block truncate">{m.label}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 min-h-4 text-[11px] text-muted">
        {COLOR_MODES.find((m) => m.id === state.colorMode)?.hint}
      </p>
    </div>
  );
}

/** Block 2: band meaning + click-to-filter, or the continuous value ramp. */
export function BandLegend() {
  const { state, metrics, metricsReady, setLegendFilter } = useApp();
  const bandPalette = bandColors(state.darkMode);
  const continuous = state.colorMode !== "coverage";

  const counts = useMemo(() => {
    const c: Record<AffordabilityBand, number> = {
      comfortable: 0,
      manageable: 0,
      tight: 0,
      insufficient: 0,
    };
    if (metricsReady) for (const m of metrics.values()) c[m.band]++;
    return c;
  }, [metrics, metricsReady]);

  const bands = AFFORDABILITY_BANDS;
  const ranges: Record<AffordabilityBand, string> = {
    comfortable: `≥ ${bands.comfortableAt}%`,
    manageable: `${bands.manageableAt}–${bands.comfortableAt - 1}%`,
    tight: `${bands.tightAt}–${bands.manageableAt - 1}%`,
    insufficient: `< ${bands.tightAt}%`,
  };
  const noData = state.geometry
    ? metricsReady
      ? Math.max(state.geometry.features.length - metrics.size, 0)
      : null
    : 0;
  const costStops = ["Rp 3 jt", "Rp 5,5 jt", "Rp 8 jt"];
  const wageStops = ["Rp 2 jt", "Rp 3,5 jt", "Rp 5,5 jt"];

  return (
    <div>
      <Eyebrow>{continuous ? "Rentang nilai" : "Makna warna"}</Eyebrow>

      {continuous ? (
        <div className="mt-2">
          <div
            aria-hidden="true"
            className="h-3 w-full rounded"
            style={{
              background: `linear-gradient(to right, ${(state.darkMode
                ? VALUE_RAMP.dark
                : VALUE_RAMP.light
              ).join(", ")})`,
            }}
          />
          <div className="mt-1 flex justify-between text-[10px] tabular-nums text-muted">
            {(state.colorMode === "cost" ? costStops : wageStops).map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
      ) : (
        <ul
          className="mt-2 space-y-0.5"
          role="group"
          aria-label="Saring peta menurut tingkat"
        >
          {BAND_ORDER.map((band) => {
            const active = state.legendFilter === band;
            return (
              <li key={band}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setLegendFilter(active ? null : band)}
                  title={
                    active
                      ? "Hapus filter"
                      : `Tampilkan hanya wilayah ${BAND_LABEL[band]}`
                  }
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors ${
                    active
                      ? "bg-accent-soft shadow-[inset_0_0_0_1px_var(--accent)]"
                      : "hover:bg-accent-soft/60"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="h-3 w-5 shrink-0 rounded-sm"
                    style={{ backgroundColor: bandPalette[band] }}
                  />
                  <span className="flex-1 text-[13px] font-semibold">
                    {BAND_LABEL[band]}
                  </span>
                  <span className="text-[11.5px] tabular-nums text-muted">
                    {ranges[band]}
                  </span>
                  <span className="min-w-[38px] text-right text-xs font-bold tabular-nums text-muted">
                    {counts[band]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-2 flex items-center gap-2 text-[11px] text-muted">
        <span
          aria-hidden="true"
          className="h-3 w-5 shrink-0 rounded-sm"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${
              state.darkMode
                ? "#6f6a63 0 2px, #26211c 2px 6px"
                : "#9aa0a6 0 2px, #e8e8e8 2px 6px"
            })`,
          }}
        />
        <span>
          {noData == null
            ? "Menghitung wilayah…"
            : `${noData} wilayah — belum ada data`}
        </span>
      </div>
      <p className="mt-1 text-[11px] text-muted">
        Cakupan = UMK ÷ estimasi biaya hidup bulanan × 100
      </p>
    </div>
  );
}

/** Block 3: basemap style (foot of the card on desktop, own tab on mobile). */
export function BasemapControls() {
  const { state, setBasemap } = useApp();
  return (
    <div>
      <Eyebrow>Peta dasar</Eyebrow>
      <div
        role="radiogroup"
        aria-label="Gaya peta dasar"
        className="mt-2 grid grid-cols-2 gap-1.5"
      >
        {BASEMAPS.map((b) => {
          const active = state.basemap === b.id;
          return (
            <button
              key={b.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setBasemap(b.id)}
              className={`h-8 rounded-lg border text-xs transition-colors ${
                active
                  ? "border-accent bg-accent font-medium text-on-accent"
                  : "border-border text-muted hover:border-accent hover:bg-accent-soft"
              }`}
            >
              {b.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Desktop right rail: one sequential card — colour mode, band meaning, then
 * basemap at the foot on its own surface. Carries the tour's `legend` anchor.
 */
export function InsightCard() {
  return (
    <section
      data-tour="legend"
      aria-label="Lapisan & legenda peta"
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_6px_22px_rgba(0,0,0,0.10)]"
    >
      <div className="space-y-4 p-3.5">
        <ColorModeControls />
        <BandLegend />
      </div>
      <div className="border-t border-border bg-surface p-3.5">
        <BasemapControls />
      </div>
    </section>
  );
}

/** Wide-only insight column: highest / lowest coverage. */
export function RankCard() {
  const { state, metrics, metricsReady } = useApp();
  const palette = bandColors(state.darkMode);
  const [side, setSide] = useState<"top" | "bottom">("top");
  const rows = useMemo(() => {
    if (!metricsReady) return [];
    const sorted = [...metrics.values()].sort(
      (a, b) => b.coveragePercent - a.coveragePercent,
    );
    const pick =
      side === "top" ? sorted.slice(0, 5) : sorted.slice(-5).reverse();
    return pick.map((m) => ({
      code: m.code,
      name: (REGION_BY_CODE.get(m.code)?.name ?? m.code).replace(/^Kota /, ""),
      value: m.coveragePercent,
      band: m.band,
    }));
  }, [metrics, metricsReady, side]);

  return (
    <section
      aria-label="Peringkat cakupan"
      className="rounded-2xl border border-border bg-card p-3.5 shadow-[0_6px_22px_rgba(0,0,0,0.10)]"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <Eyebrow>Peringkat cakupan</Eyebrow>
        <div className="flex gap-1">
          {(["top", "bottom"] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={side === s}
              onClick={() => setSide(s)}
              className={`h-7 rounded-lg px-2.5 text-[11px] font-semibold transition-colors ${
                side === s
                  ? "bg-accent text-on-accent"
                  : "border border-border text-muted hover:border-accent"
              }`}
            >
              {s === "top" ? "Tertinggi" : "Terendah"}
            </button>
          ))}
        </div>
      </div>
      <ol className="space-y-1">
        {rows.map((r) => (
          <li key={r.code} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: palette[r.band] }}
            />
            <span className="min-w-0 flex-1 truncate text-[12.5px]">
              {r.name}
            </span>
            <span className="text-[12.5px] font-bold tabular-nums">
              {formatPct(r.value)}
            </span>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="text-[12px] text-muted">Menghitung wilayah…</li>
        )}
      </ol>
    </section>
  );
}
