"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AppProvider, useApp } from "@/state/AppContext";
import { SearchBox } from "./SearchBox";
import { LegendDock } from "./LegendDock";
import { LayerPanel } from "./LayerPanel";
import { AssumptionsPanel } from "./AssumptionsPanel";
import { PinnedTray, ComparisonPanel } from "./Comparison";
import { DetailModal } from "./DetailModal";
import { BottomSheet } from "./BottomSheet";
import { StatusChips } from "./StatusChips";
import { AboutPanel } from "./AboutPanel";

// MapLibre must never run during SSR.
const MapCanvas = dynamic(() => import("./map/MapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-surface text-sm text-muted">
      Memuat peta…
    </div>
  ),
});

function TopBar() {
  const { state, setDarkMode, resetView } = useApp();
  return (
    <header className="relative z-30 flex h-14 items-center gap-3 border-b border-border bg-card px-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent font-bold text-on-accent shadow-sm"
        >
          N
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-bold tracking-tight sm:text-base">
            Nafkah
          </p>
          <p className="hidden text-[11px] text-muted sm:block">
            Seberapa cukup gajimu untuk hidup di kota ini?
          </p>
        </div>
      </div>

      <span className="hidden items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-700 lg:inline-flex dark:text-amber-400">
        <span aria-hidden="true">⚠</span> Estimasi sampel
      </span>

      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <AboutPanel />
        <AssumptionsPanel desktop />
        <button
          type="button"
          onClick={resetView}
          className="inline-flex h-9 items-center rounded-lg border border-border px-2.5 text-xs font-medium text-muted transition-colors hover:bg-accent-soft hover:text-ink sm:px-3"
          aria-label="Atur ulang tampilan peta ke Indonesia"
        >
          <span aria-hidden="true" className="sm:mr-1.5">
            ↻
          </span>
          <span className="hidden sm:inline">Atur ulang</span>
        </button>
        <button
          type="button"
          onClick={() => setDarkMode(!state.darkMode)}
          aria-pressed={state.darkMode}
          aria-label={
            state.darkMode ? "Ganti ke mode terang" : "Ganti ke mode gelap"
          }
          className="inline-flex h-9 items-center rounded-lg border border-border px-2.5 text-xs font-medium text-muted transition-colors hover:bg-accent-soft hover:text-ink sm:px-3"
        >
          <span aria-hidden="true" className="sm:mr-1.5">
            {state.darkMode ? "☀" : "☾"}
          </span>
          <span className="hidden sm:inline">
            {state.darkMode ? "Terang" : "Gelap"}
          </span>
        </button>
      </div>
    </header>
  );
}

function Shell() {
  const [desktop, setDesktop] = useState(false);

  // Render only the active responsive chrome. Keeping both versions mounted
  // duplicates form IDs and makes hidden responsive charts measure at 0×0.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const sync = () => setDesktop(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <div className="flex h-dvh flex-col overscroll-none">
      <TopBar />

      {/* Map canvas is the product: it fills everything below the top bar. */}
      <main className="relative flex-1 overflow-hidden">
        <MapCanvas />

        {/* Desktop overlays use two stable side rails, leaving the bottom clear
            for comparison. This prevents controls from competing for space. */}
        {desktop ? (
          <div className="pointer-events-none absolute inset-0">
            <div className="pointer-events-auto absolute left-4 top-4 w-72 space-y-3">
              <SearchBox />
              <PinnedTray />
            </div>
            <div className="pointer-events-auto absolute right-4 top-4 w-72 space-y-3">
              <LayerPanel />
              <LegendDock />
            </div>
            <div className="pointer-events-auto absolute bottom-2 left-1/2 w-[min(calc(100%-2rem),1280px)] -translate-x-1/2">
              <ComparisonPanel />
            </div>
          </div>
        ) : (
          <BottomSheet />
        )}

        <StatusChips />
        <DetailModal />
      </main>
    </div>
  );
}

export default function AppShell() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
