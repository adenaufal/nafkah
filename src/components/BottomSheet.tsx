"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "@/state/AppContext";
import { LegendDock } from "./LegendDock";
import { LayerPanel } from "./LayerPanel";
import { SearchBox } from "./SearchBox";
import { AssumptionsControls } from "./AssumptionsPanel";
import { PinnedTray, ComparisonPanel } from "./Comparison";

/**
 * Mobile bottom sheet (<768px): draggable with three snap points —
 * peek (handle only), half, and full. Search, legend, layers, assumptions,
 * pinned tray and comparison all live inside. No horizontal scroll: all
 * inner grids wrap, tables scroll inside bounded containers.
 */

const SNAP_PEEK = 76; // tinggi cukup untuk pegangan besar + baris tab
const snapHalf = () => Math.round(window.innerHeight * 0.45);
const snapFull = () => Math.round(window.innerHeight * 0.85);

type SheetTab = "search" | "legend" | "layers" | "assumptions";

export function BottomSheet() {
  const { state } = useApp();
  const [height, setHeight] = useState(SNAP_PEEK);
  const [dragging, setDragging] = useState(false);
  const [tab, setTab] = useState<SheetTab>("search");
  const dragRef = useRef<{
    startY: number;
    startHeight: number;
    moved: boolean;
  } | null>(null);
  // Mirror of height for pointer handlers (avoids stale closure on pointerup).
  const heightRef = useRef(SNAP_PEEK);

  const applyHeight = useCallback((h: number) => {
    heightRef.current = h;
    setHeight(h);
  }, []);

  const snapNearest = useCallback(
    (h: number) => {
      const snaps = [SNAP_PEEK, snapHalf(), snapFull()];
      const nearest = snaps.reduce((a, b) =>
        Math.abs(b - h) < Math.abs(a - h) ? b : a,
      );
      applyHeight(nearest);
    },
    [applyHeight],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = {
      startY: e.clientY,
      startHeight: heightRef.current,
      moved: false,
    };
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dy = d.startY - e.clientY;
    if (Math.abs(dy) > 6) d.moved = true;
    applyHeight(Math.min(snapFull(), Math.max(36, d.startHeight + dy)));
  };

  const onPointerUp = () => {
    const d = dragRef.current;
    if (!d) return;
    dragRef.current = null;
    setDragging(false);
    if (!d.moved) {
      // Tap (bukan geser): toggle peek ↔ half supaya jempol tidak perlu
      // menargetkan strip kecil untuk membuka sheet.
      snapTo(heightRef.current > SNAP_PEEK + 4 ? "peek" : "half");
    } else {
      snapNearest(heightRef.current);
    }
  };

  // Keyboard fallback for operating the sheet.
  const snapTo = (which: "peek" | "half" | "full") =>
    applyHeight(
      which === "peek" ? SNAP_PEEK : which === "half" ? snapHalf() : snapFull(),
    );

  // Expand sheet automatically when 2+ regions are pinned (comparison appears).
  const pinnedCount = state.pinned.length;
  useEffect(() => {
    if (pinnedCount >= 2) applyHeight(Math.max(heightRef.current, snapHalf()));
  }, [pinnedCount, applyHeight]);

  const expanded = height > SNAP_PEEK + 4;

  return (
    <>
      {/* Quick pin / compare bar sits above the sheet */}
      {state.pinned.length === 0 && state.pinMessage && (
        <p
          role="alert"
          className="absolute bottom-[88px] left-1/2 z-30 w-[92vw] max-w-sm -translate-x-1/2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-400"
        >
          {state.pinMessage}
        </p>
      )}

      <section
        aria-label="Bottom sheet: pencarian, legenda, lapisan, asumsi"
        className="absolute bottom-0 left-0 right-0 z-40 flex flex-col rounded-t-2xl border-t border-border bg-card shadow-[0_-4px_24px_rgb(0_0_0/0.18)]"
        style={{
          height,
          transition: dragging
            ? "none"
            : "height 220ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {/* Pegangan geser */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Geser untuk mengatur tinggi panel"
          aria-valuenow={height}
          aria-valuemin={SNAP_PEEK}
          aria-valuemax={snapFull()}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") snapTo("full");
            if (e.key === "ArrowDown") snapTo("peek");
            if (e.key === "Enter" || e.key === " ")
              snapTo(expanded ? "peek" : "half");
          }}
          className="flex shrink-0 cursor-grab touch-none flex-col items-center justify-center py-4 active:cursor-grabbing"
        >
          <span
            aria-hidden="true"
            className="h-2 w-12 rounded-full bg-border"
          />
        </div>

        {/* Tabs */}
        <nav
          aria-label="Panel tabs"
          className="flex shrink-0 gap-1 overflow-x-auto border-b border-border px-3 pb-2"
        >
          {(
            [
              ["search", "Cari"],
              ["legend", "Legenda"],
              ["layers", "Lapisan"],
              ["assumptions", "Asumsi"],
            ] as [SheetTab, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={tab === id}
              onClick={() => {
                setTab(id);
                if (!expanded) snapTo("half");
              }}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === id && expanded
                  ? "bg-accent text-on-accent"
                  : "border border-border text-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Content */}
        {expanded && (
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {tab === "search" && (
              <div className="space-y-3">
                <SearchBox />
                <PinnedTray />
                <ComparisonPanel />
              </div>
            )}
            {tab === "legend" && <LegendDock />}
            {tab === "layers" && <LayerPanel />}
            {tab === "assumptions" && <AssumptionsControls />}
          </div>
        )}
      </section>
    </>
  );
}
