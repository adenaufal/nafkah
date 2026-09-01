"use client";

import { useApp } from "@/state/AppContext";
import type { BasemapId, ColorMode } from "@/lib/types";

/** Panel lapisan: makna warna choropleth dan peta dasar di bawahnya. */
export function LayerPanel() {
  const { state, setColorMode, setBasemap } = useApp();

  const modes: { id: ColorMode; label: string; hint: string }[] = [
    { id: "coverage", label: "Cakupan", hint: "Upah ÷ estimasi biaya" },
    { id: "cost", label: "Biaya", hint: "Estimasi rupiah bulanan" },
    { id: "wage", label: "Upah", hint: "Rupiah UMK" },
  ];
  const maps: { id: BasemapId; label: string }[] = [
    { id: "light", label: "Terang" },
    { id: "dark", label: "Gelap" },
    { id: "satellite", label: "Satelit" },
    { id: "offline", label: "Offline (tanpa tile)" },
  ];

  return (
    <section
      aria-label="Lapisan peta"
      className="rounded-xl border border-border bg-card/95 p-3.5 text-sm shadow-md backdrop-blur"
    >
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        Warnai berdasarkan
      </h3>
      <div
        role="radiogroup"
        aria-label="Tipe warna choropleth"
        className="grid grid-cols-3 gap-1.5"
      >
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={state.colorMode === m.id}
            title={m.hint}
            onClick={() => setColorMode(m.id)}
            className={`min-w-0 rounded-lg border px-2 py-2 text-center text-xs transition-colors ${
              state.colorMode === m.id
                ? "border-accent bg-accent font-medium text-on-accent shadow-sm"
                : "border-border bg-card hover:border-accent hover:bg-accent-soft"
            }`}
          >
            <span className="block truncate">{m.label}</span>
          </button>
        ))}
      </div>
      <p className="mt-1.5 min-h-4 text-[11px] text-muted">
        {modes.find((m) => m.id === state.colorMode)?.hint}
      </p>

      <h3 className="mb-2 mt-3 text-xs font-semibold uppercase tracking-wide text-muted">
        Peta dasar
      </h3>
      <div
        role="radiogroup"
        aria-label="Gaya peta dasar"
        className="grid grid-cols-2 gap-1.5"
      >
        {maps.map((b) => (
          <button
            key={b.id}
            type="button"
            role="radio"
            aria-checked={state.basemap === b.id}
            onClick={() => setBasemap(b.id)}
            className={`rounded-lg border px-2 py-1.5 text-xs transition-colors ${
              state.basemap === b.id
                ? "border-accent bg-accent font-medium text-on-accent"
                : "border-border hover:border-accent hover:bg-accent-soft"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>
    </section>
  );
}
