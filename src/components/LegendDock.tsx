"use client";

import { useMemo } from "react";
import { useApp } from "@/state/AppContext";
import {
  AFFORDABILITY_BANDS,
  BAND_LABEL,
  VALUE_RAMP,
  bandColors,
} from "@/lib/calculations";
import type { AffordabilityBand } from "@/lib/types";

const BAND_ORDER: AffordabilityBand[] = [
  "comfortable",
  "manageable",
  "tight",
  "insufficient",
];

/**
 * Docked legend: numeric band boundaries (meaning by numbers, not color),
 * region count per band, click-to-filter dims non-matching regions.
 */
export function LegendDock() {
  const { state, metrics, metricsReady, setLegendFilter } = useApp();
  const bandPalette = bandColors(state.darkMode);

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

  const continuous = state.colorMode !== "coverage";
  const dualIncome =
    state.assumptions.dualIncome &&
    state.assumptions.householdType !== "single";
  const customIncome = (state.assumptions.customIncome ?? 0) > 0;
  const costStops = ["Rp 3 jt", "Rp 5,5 jt", "Rp 8 jt"];
  const wageStops = ["Rp 2 jt", "Rp 3,5 jt", "Rp 5,5 jt"];

  return (
    <section
      aria-label="Legend: affordability bands"
      className="rounded-xl border border-border bg-card/95 p-3 text-xs shadow-md backdrop-blur"
    >
      <h3 className="mb-2 font-semibold text-ink">
        {state.colorMode === "coverage"
          ? "Cakupan gaji"
          : state.colorMode === "cost"
            ? "Est. biaya bulanan"
            : "Upah minimum"}
      </h3>

      {continuous ? (
        <div>
          <div
            aria-hidden="true"
            className="h-3 w-full rounded"
            style={{
              background:
                "linear-gradient(to right, " +
                (state.darkMode
                  ? VALUE_RAMP.dark.join(", ")
                  : VALUE_RAMP.light.join(", ")) +
                ")",
            }}
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted">
            {(state.colorMode === "cost" ? costStops : wageStops).map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
      ) : (
        <ul className="space-y-1" role="group" aria-label="Filter by band">
          {BAND_ORDER.map((band) => {
            const active = state.legendFilter === band;
            return (
              <li key={band}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setLegendFilter(active ? null : band)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left transition-colors ${
                    active
                      ? "bg-accent-soft ring-1 ring-accent"
                      : "hover:bg-accent-soft/60"
                  }`}
                  title={
                    active
                      ? "Hapus filter"
                      : `Tampilkan hanya wilayah ${BAND_LABEL[band]}`
                  }
                >
                  <span
                    aria-hidden="true"
                    className="h-3 w-5 shrink-0 rounded-sm"
                    style={{ backgroundColor: bandPalette[band] }}
                  />
                  <span className="flex-1 font-medium">{BAND_LABEL[band]}</span>
                  <span className="tabular-nums text-muted">
                    {ranges[band]}
                  </span>
                  <span className="min-w-5 text-right tabular-nums text-muted">
                    ({counts[band]})
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {state.legendFilter && (
        <button
          type="button"
          onClick={() => setLegendFilter(null)}
          className="mt-2 w-full rounded-lg border border-border px-2 py-1 text-center text-muted hover:border-accent"
        >
          Hapus filter
        </button>
      )}

      <div className="mt-2 flex items-center gap-2 border-t border-border pt-2 text-muted">
        <span
          aria-hidden="true"
          className="h-3 w-5 shrink-0 rounded-sm"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, " +
              (state.darkMode
                ? "#6f6a63 0 2px, #26211c 2px 6px"
                : "#9aa0a6 0 2px, #e8e8e8 2px 6px") +
              ")",
          }}
        />
        <span>
          {state.geometry
            ? metricsReady
              ? `${Math.max(state.geometry.features.length - metrics.size, 0)} wilayah — belum ada data`
              : "Menghitung wilayah…"
            : "Belum ada data"}
        </span>
      </div>

      <p className="mt-1 text-[10px] text-muted">
        Cakupan ={" "}
        {customIncome ? "pendapatanmu" : dualIncome ? "2× UMK" : "UMK"} ÷
        estimasi biaya hidup bulanan × 100
        {state.assumptions.wageBasis === "takeHome" && " (take-home basis)"}
        {dualIncome && " · pasangan ikut bekerja"}
        {customIncome && " · bukan UMK"}
      </p>
    </section>
  );
}
