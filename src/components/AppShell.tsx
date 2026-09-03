"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AppProvider, useApp } from "@/state/AppContext";
import { SearchBox } from "./SearchBox";
import { InsightCard, RankCard } from "./RightPanels";
import { AssumptionsDrawer } from "./AssumptionsPanel";
import { PinnedTray, ComparisonPanel } from "./Comparison";
import { DetailModal } from "./DetailModal";
import { MobileDock } from "./MobileDock";
import { StatusChips } from "./StatusChips";
import { AboutDrawer } from "./AboutPanel";
import { Onboarding } from "./onboarding/Onboarding";
import { ThreeStepCard } from "./onboarding/ThreeStepCard";

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
  const {
    state,
    setDarkMode,
    resetView,
    openGuide,
    setAboutOpen,
    setAsumsiOpen,
  } = useApp();
  return (
    <header className="relative z-30 flex h-14 items-center gap-3 border-b border-border bg-card px-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-[17px] font-extrabold text-on-accent"
        >
          N
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-base font-bold tracking-tight">Nafkah</p>
          <p className="hidden text-[11.5px] text-muted sm:block">
            Seberapa cukup gajimu untuk hidup di kota ini?
          </p>
        </div>
      </div>

      <span className="hidden items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-700 lg:inline-flex dark:text-amber-400">
        <span aria-hidden="true">⚠</span> Estimasi sampel
      </span>

      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={openGuide}
          aria-label="Buka panduan"
          className="inline-flex h-9 items-center rounded-[9px] border border-accent bg-accent-soft px-2.5 text-[12.5px] font-bold text-accent transition-colors hover:brightness-95 sm:px-3"
        >
          <span aria-hidden="true" className="sm:mr-1.5">
            ?
          </span>
          <span className="hidden sm:inline">Panduan</span>
        </button>
        <button
          type="button"
          onClick={() => setAboutOpen(true)}
          aria-haspopup="dialog"
          className="inline-flex h-9 items-center rounded-[9px] border border-border px-2.5 text-[12.5px] font-medium text-muted transition-colors hover:bg-accent-soft hover:text-ink sm:px-3"
        >
          <span aria-hidden="true" className="sm:mr-1.5">
            ⓘ
          </span>
          <span className="hidden sm:inline">Tentang</span>
          <span className="sr-only sm:hidden">Tentang Nafkah</span>
        </button>
        <button
          type="button"
          onClick={resetView}
          aria-label="Atur ulang tampilan peta ke Indonesia"
          className="hidden h-9 items-center rounded-[9px] border border-border px-2.5 text-[12.5px] font-medium text-muted transition-colors hover:bg-accent-soft hover:text-ink sm:inline-flex sm:px-3"
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
          className="inline-flex h-9 w-9 items-center justify-center rounded-[9px] border border-border text-[12.5px] font-medium text-muted transition-colors hover:bg-accent-soft hover:text-ink"
        >
          <span aria-hidden="true">{state.darkMode ? "☀" : "☾"}</span>
        </button>
        <button
          type="button"
          data-tour="asumsi"
          onClick={() => setAsumsiOpen(true)}
          aria-haspopup="dialog"
          className="inline-flex h-9 items-center rounded-[9px] bg-accent px-3 text-[12.5px] font-bold text-on-accent transition-colors hover:bg-accent-strong"
        >
          <span aria-hidden="true" className="mr-1.5">
            ⚙
          </span>
          Asumsi
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
      <main data-tour="map" className="relative flex-1 overflow-hidden">
        <MapCanvas />

        {desktop ? (
          <div className="pointer-events-none absolute inset-0">
            <div className="pointer-events-auto absolute left-4 top-4 grid w-[296px] gap-3 min-[1800px]:w-[340px]">
              <div data-tour="search">
                <SearchBox />
              </div>
              <PinnedTray />
              <ThreeStepCard />
            </div>
            <div className="pointer-events-auto absolute right-4 top-4 grid max-h-[calc(100%-2rem)] w-[296px] gap-3 overflow-y-auto min-[1800px]:w-[360px]">
              <InsightCard />
              <div className="hidden min-[1800px]:block">
                <RankCard />
              </div>
            </div>
            <div className="pointer-events-auto absolute bottom-4 left-1/2 w-[min(calc(100%-680px),1180px)] -translate-x-1/2 min-[1800px]:w-[min(calc(100%-780px),1600px)]">
              <ComparisonPanel />
            </div>
          </div>
        ) : (
          <>
            <ThreeStepCard className="pointer-events-auto absolute inset-x-3 top-3 z-20" />
            <MobileDock />
          </>
        )}

        <StatusChips />
        <DetailModal />
      </main>

      {/* Overlays live at the shell root so their fixed positioning and z-index
          stack cleanly above the whole app, header included. */}
      <AssumptionsDrawer />
      <AboutDrawer />
      <Onboarding narrow={!desktop} />
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
