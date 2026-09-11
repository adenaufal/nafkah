"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AppProvider, useApp } from "@/state/AppContext";
import { DESKTOP_BREAKPOINT, getShellMode } from "@/lib/responsive";
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
import { ShareButton } from "./ShareButton";
import { AppIcon } from "./icons";

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
    resetView,
    openGuide,
    setAboutOpen,
    setAsumsiOpen,
  } = useApp();
  return (
    <header className="relative z-30 flex h-14 items-center gap-3 border-b border-border bg-card px-3 sm:px-4 min-[1400px]:h-16 min-[1800px]:h-[68px] min-[1400px]:px-6">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-[17px] font-extrabold text-on-accent min-[1400px]:h-10 min-[1400px]:w-10 min-[1400px]:text-[18px] min-[1800px]:h-11 min-[1800px]:w-11 min-[1800px]:text-[20px]"
        >
          N
        </span>
        <div className="min-w-0 leading-tight">
          <div className="flex items-center gap-2">
            <p className="shrink-0 text-base font-bold tracking-tight min-[1400px]:text-[17px] min-[1800px]:text-lg">
              Nafkah
            </p>
            <span className="hidden items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10.5px] font-semibold text-amber-700 whitespace-nowrap md:inline-flex dark:text-amber-400 min-[1400px]:px-2.5 min-[1400px]:py-0.5 min-[1400px]:text-[11.5px] min-[1800px]:px-3 min-[1800px]:text-xs">
              <AppIcon name="warning" size={12} weight="bold" /> Estimasi sampel
            </span>
          </div>
          <p className="hidden text-[11.5px] text-muted sm:block min-[1400px]:text-xs min-[1800px]:text-[13px]">
            Seberapa cukup gajimu untuk hidup di kota ini?
          </p>
        </div>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2 min-[1400px]:gap-2.5 min-[1800px]:gap-3">
        <button
          type="button"
          onClick={openGuide}
          aria-label="Buka panduan"
          className="inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-accent bg-accent-soft px-2.5 text-[12.5px] font-bold text-accent transition-colors hover:brightness-95 sm:px-3 min-[1400px]:h-10 min-[1400px]:px-3.5 min-[1400px]:text-[13.5px] min-[1400px]:rounded-[10px] min-[1800px]:h-11 min-[1800px]:px-4 min-[1800px]:text-sm"
        >
          <AppIcon name="question" size={16} weight="bold" />
          <span className="hidden sm:inline">Panduan</span>
        </button>
        <button
          type="button"
          onClick={() => setAboutOpen(true)}
          aria-haspopup="dialog"
          className="inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-border px-2.5 text-[12.5px] font-medium text-muted transition-colors hover:bg-accent-soft hover:text-ink sm:px-3 min-[1400px]:h-10 min-[1400px]:px-3.5 min-[1400px]:text-[13.5px] min-[1400px]:rounded-[10px] min-[1800px]:h-11 min-[1800px]:px-4 min-[1800px]:text-sm"
        >
          <AppIcon name="info" size={16} />
          <span className="hidden sm:inline">Tentang</span>
          <span className="sr-only sm:hidden">Tentang Nafkah</span>
        </button>
        <ShareButton />
        <button
          type="button"
          onClick={resetView}
          aria-label="Atur ulang tampilan peta ke Indonesia"
          className="hidden h-9 items-center gap-1.5 rounded-[9px] border border-border px-2.5 text-[12.5px] font-medium text-muted transition-colors hover:bg-accent-soft hover:text-ink md:inline-flex lg:px-3 min-[1400px]:h-10 min-[1400px]:px-3.5 min-[1400px]:text-[13.5px] min-[1400px]:rounded-[10px] min-[1800px]:h-11 min-[1800px]:px-4 min-[1800px]:text-sm"
        >
          <AppIcon name="arrowCounterClockwise" size={16} />
          <span className="hidden lg:inline">Atur ulang</span>
        </button>
        <button
          type="button"
          data-tour="asumsi"
          onClick={() => setAsumsiOpen(true)}
          aria-haspopup="dialog"
          className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-accent px-3 text-[12.5px] font-bold text-on-accent transition-colors hover:bg-accent-strong min-[1400px]:h-10 min-[1400px]:px-4 min-[1400px]:text-[13.5px] min-[1400px]:rounded-[10px] min-[1800px]:h-11 min-[1800px]:px-5 min-[1800px]:text-sm"
        >
          <AppIcon name="gear" size={16} weight="bold" />
          Asumsi
        </button>
      </div>
    </header>
  );
}

function Shell() {
  const [desktop, setDesktop] = useState(
    () =>
      typeof window !== "undefined" &&
      getShellMode(window.innerWidth) === "desktop",
  );

  // Render only the active responsive chrome. Keeping both versions mounted
  // duplicates form IDs and makes hidden responsive charts measure at 0×0.
  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const sync = () =>
      setDesktop(getShellMode(window.innerWidth) === "desktop");
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
            <div className="pointer-events-auto absolute left-4 top-4 grid max-h-[calc(100%-2rem)] w-[296px] gap-3 overflow-y-auto min-[1800px]:w-[340px]">
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
            <ThreeStepCard className="pointer-events-auto absolute left-3 right-auto top-3 z-20 w-[min(calc(100%-1.5rem),26rem)]" />
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
