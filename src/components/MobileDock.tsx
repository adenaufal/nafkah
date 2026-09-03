"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/state/AppContext";
import { SearchBox } from "./SearchBox";
import { PinnedTray, ComparisonPanel } from "./Comparison";
import { ColorModeControls, BandLegend, BasemapControls } from "./RightPanels";

type SheetTab = "search" | "legend" | "layers";

const TABS: { id: SheetTab | "assumptions"; label: string; tour?: string }[] = [
  { id: "search", label: "Cari", tour: "tab-search" },
  { id: "legend", label: "Legenda", tour: "tab-legend" },
  { id: "layers", label: "Lapisan" },
  { id: "assumptions", label: "Asumsi" },
];

const TITLES: Record<SheetTab, string> = {
  search: "Cari & bandingkan",
  legend: "Legenda",
  layers: "Lapisan peta",
};

/**
 * Mobile (<768px): a fixed four-column tab bar plus one single-height sheet.
 * Tap a tab to open, tap the same tab (or the scrim) to close — no hidden drag
 * gestures. The Asumsi tab opens the assumptions drawer instead of the sheet.
 */
export function MobileDock() {
  const { state, setAsumsiOpen } = useApp();
  const [tab, setTab] = useState<SheetTab | null>(null);

  // Opening the assumptions drawer (from here or the tour) closes the sheet.
  useEffect(() => {
    if (state.asumsiOpen) setTab(null);
  }, [state.asumsiOpen]);

  const onTab = (id: SheetTab | "assumptions") => {
    if (id === "assumptions") {
      setTab(null);
      setAsumsiOpen(true);
      return;
    }
    setAsumsiOpen(false);
    setTab((cur) => (cur === id ? null : id));
  };

  const open = tab !== null;

  return (
    <>
      {state.pinned.length === 0 && state.pinMessage && (
        <p
          role="alert"
          className="absolute bottom-[80px] left-1/2 z-30 w-[92vw] max-w-sm -translate-x-1/2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-400"
        >
          {state.pinMessage}
        </p>
      )}

      {open && (
        <>
          <div
            className="absolute inset-0 bottom-[68px] z-30 bg-black/32"
            aria-hidden="true"
            onClick={() => setTab(null)}
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-label={TITLES[tab]}
            className="absolute inset-x-0 bottom-[68px] z-40 flex h-[64%] flex-col rounded-t-[18px] border-t border-border bg-card shadow-[0_-8px_34px_rgba(0,0,0,0.24)]"
          >
            <header className="flex shrink-0 items-center justify-between border-b border-border px-3.5 py-3">
              <h2 className="text-[15px] font-bold">{TITLES[tab]}</h2>
              <button
                type="button"
                onClick={() => setTab(null)}
                aria-label="Tutup panel"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm hover:border-accent"
              >
                ✕
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-3.5">
              {tab === "search" && (
                <div className="space-y-3">
                  <SearchBox />
                  <PinnedTray />
                  <ComparisonPanel />
                </div>
              )}
              {tab === "legend" && (
                <div className="space-y-4">
                  <ColorModeControls />
                  <BandLegend />
                </div>
              )}
              {tab === "layers" && <BasemapControls />}
            </div>
          </section>
        </>
      )}

      <nav
        aria-label="Panel navigasi"
        className="absolute inset-x-0 bottom-0 z-40 grid h-[68px] grid-cols-4 gap-1 border-t border-border bg-card px-2 pb-2.5 pt-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.12)]"
      >
        {TABS.map((t) => {
          const active =
            t.id === "assumptions" ? state.asumsiOpen : tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              data-tour={t.tour}
              aria-pressed={active}
              onClick={() => onTab(t.id)}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-xl text-[11.5px] transition-colors ${
                active
                  ? "bg-accent-soft font-bold text-accent"
                  : "font-medium text-muted"
              }`}
            >
              <span
                aria-hidden="true"
                className="h-[3px] w-[18px] rounded-full"
                style={{
                  background: active ? "var(--accent)" : "var(--border)",
                }}
              />
              {t.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}
