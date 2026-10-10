"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowClockwise,
  ArrowsIn,
  Check,
  Crosshair,
  Info,
  Minus,
  Plus,
  SpinnerGap,
  Stack,
} from "@phosphor-icons/react";
import { useApp } from "@/state/AppContext";
import { useRanking } from "@/state/derived";
import { BAND_ORDER, bandTheme } from "@/lib/bands";
import { VALUE_RAMP } from "@/lib/calculations";
import { pct, rpShort, rpSigned } from "@/lib/format";
import { valueStops } from "@/lib/insights";
import { regionLabel } from "@/lib/names";
import type { BasemapId } from "@/lib/types";
import { wageKind } from "@/lib/wages";
import { useLocateRegion } from "@/components/search/useLocateRegion";
import type { MapApi } from "./AtlasMap";

/** Hover card that follows the pointer over the map (pointer devices). */
export function MapTooltip({
  hover,
}: {
  hover: { code: string; x: number; y: number };
}) {
  const { state, metrics, metricsReady, regionByCode } = useApp();
  const region = regionByCode.get(hover.code);
  const feature = region
    ? undefined
    : state.geometry?.features.find((f) => f.properties.kode === hover.code);
  const m = metricsReady ? metrics.get(hover.code) : undefined;
  const theme = bandTheme(state.darkMode);
  const flipX =
    typeof window !== "undefined" && hover.x > window.innerWidth - 760;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-20 w-[248px] rounded-[12px] border border-rule bg-paper p-3 shadow-[var(--shadow)]"
      style={{
        left: hover.x,
        top: hover.y,
        transform: `translate(${flipX ? "calc(-100% - 14px)" : "14px"}, ${hover.y > 260 ? "calc(-100% - 10px)" : "14px"})`,
      }}
    >
      <p className="truncate text-[14px] font-bold leading-tight">
        {region
          ? regionLabel(region)
          : (feature?.properties.name ?? hover.code)}
      </p>
      <p className="truncate text-[12px] text-muted">
        {region?.province ?? feature?.properties.province}
      </p>
      {m ? (
        <>
          <div className="mt-2 flex items-end justify-between gap-2">
            <div>
              <span
                className="f-display tnum text-[26px] font-[560] leading-none"
                style={{ color: theme[m.band].ink }}
              >
                {pct(m.coveragePercent)}
              </span>
              <span className="ml-1.5 text-[12px] text-muted">tertutup</span>
            </div>
            <span
              className={`tnum text-[12.5px] font-semibold ${m.surplusOrDeficit >= 0 ? "text-ok" : "text-danger"}`}
            >
              {rpSigned(m.surplusOrDeficit)}/bln
            </span>
          </div>
          {state.colorMode !== "coverage" && (
            <p className="tnum mt-1.5 text-[12px] text-ink-2">
              {state.colorMode === "cost"
                ? `Biaya hidup ${rpShort(m.totalMonthlyCost)}`
                : `${wageKind(state.wages.get(hover.code))} ${rpShort(m.regionalWageAmount)}`}
            </p>
          )}
        </>
      ) : (
        <p className="mt-2 text-[12.5px] text-muted">
          {metricsReady ? "Belum ada data" : "Memuat data…"}
        </p>
      )}
    </div>
  );
}

/** Compact legend on the map while the rail shows a region or the profile. */
export function MapKey() {
  const { state, metrics, metricsReady } = useApp();
  const ranking = useRanking();
  const theme = bandTheme(state.darkMode);
  const stops = useMemo(
    () =>
      metricsReady
        ? valueStops(
            [...metrics.values()].map((m) =>
              state.colorMode === "cost"
                ? m.totalMonthlyCost
                : m.regionalWageAmount,
            ),
          )
        : null,
    [metrics, metricsReady, state.colorMode],
  );
  const box =
    "pointer-events-none absolute left-4 top-4 z-10 rounded-[10px] border border-rule bg-paper/92 px-3 py-2 text-[12px] shadow-[0_1px_2px_rgb(0_0_0/0.06)] backdrop-blur max-md:hidden";
  if (state.colorMode !== "coverage") {
    const ramp = state.darkMode ? VALUE_RAMP.dark : VALUE_RAMP.light;
    return (
      <div className={`${box} w-56`}>
        <p className="font-semibold">
          {state.colorMode === "cost"
            ? "Biaya hidup / bulan"
            : "Upah minimum / bulan"}
        </p>
        <div
          className="mt-1.5 h-2 rounded-full"
          style={{
            background: `linear-gradient(to right, ${ramp.join(", ")})`,
          }}
        />
        {stops && (
          <div className="tnum mt-1 flex justify-between text-[11px] text-muted">
            <span>{rpShort(stops[0])}</span>
            <span>{rpShort(stops[2])}</span>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className={`${box} flex gap-3`}>
      {BAND_ORDER.map((b) => (
        <span key={b} className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: theme[b].fill }}
          />
          <span className="font-medium">{theme[b].label}</span>
          <span className="tnum text-muted">{ranking.counts[b]}</span>
        </span>
      ))}
    </div>
  );
}

const LAYERS: { id: BasemapId; label: string }[] = [
  { id: "light", label: "Kertas" },
  { id: "satellite", label: "Satelit" },
  { id: "offline", label: "Tanpa peta dasar" },
];

/** Zoom, fit-to-Indonesia, locate and basemap picker. */
export function MapControls({
  api,
  className = "",
  showZoom = true,
}: {
  api: MapApi | null;
  className?: string;
  showZoom?: boolean;
}) {
  const { state, setBasemap, select } = useApp();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const locator = useLocateRegion(select);
  const current = state.basemap === "dark" ? "light" : state.basemap;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const btn =
    "grid h-9 w-9 place-items-center text-ink-2 hover:bg-paper-2 hover:text-ink disabled:opacity-40 pointer-coarse:h-11 pointer-coarse:w-11";
  const sep = <span className="mx-2 h-px bg-rule" aria-hidden="true" />;
  return (
    // Buttons come first in the DOM (tab order: toggle, then its options);
    // column-reverse still stacks the options and messages above them.
    <div
      ref={wrap}
      className={`absolute z-10 flex flex-col-reverse items-end gap-2 ${className}`}
    >
      <div className="flex flex-col overflow-hidden rounded-[12px] border border-rule bg-paper shadow-[0_1px_2px_rgb(0_0_0/0.06),0_4px_14px_rgb(0_0_0/0.08)]">
        {showZoom && (
          <>
            <button
              type="button"
              className={btn}
              aria-label="Perbesar peta"
              onClick={() => api?.zoomIn()}
              disabled={!api}
            >
              <Plus size={15} weight="bold" aria-hidden="true" />
            </button>
            {sep}
            <button
              type="button"
              className={btn}
              aria-label="Perkecil peta"
              onClick={() => api?.zoomOut()}
              disabled={!api}
            >
              <Minus size={15} weight="bold" aria-hidden="true" />
            </button>
            {sep}
          </>
        )}
        <button
          type="button"
          className={btn}
          aria-label="Tampilkan seluruh Indonesia"
          title="Seluruh Indonesia"
          onClick={() => api?.fitIndonesia()}
          disabled={!api}
        >
          <ArrowsIn size={15} weight="bold" aria-hidden="true" />
        </button>
        {sep}
        <button
          type="button"
          className={btn}
          aria-label="Pilih daerah di lokasiku"
          title="Daerah di lokasiku"
          onClick={locator.locate}
          disabled={
            state.geometryStatus !== "ready" || locator.status === "locating"
          }
        >
          {locator.status === "locating" ? (
            <SpinnerGap size={16} className="animate-spin" aria-hidden="true" />
          ) : (
            <Crosshair size={16} weight="bold" aria-hidden="true" />
          )}
        </button>
        {sep}
        <button
          ref={toggle}
          type="button"
          className={btn}
          aria-label="Peta dasar"
          title="Peta dasar"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          <Stack size={16} aria-hidden="true" />
        </button>
      </div>
      {open && (
        <div
          id={menuId}
          role="group"
          aria-label="Peta dasar"
          className="anim-fade w-48 rounded-[12px] border border-rule bg-paper p-1 shadow-[var(--shadow)]"
        >
          {LAYERS.map((l) => (
            <button
              key={l.id}
              type="button"
              aria-pressed={current === l.id}
              onClick={() => {
                setBasemap(
                  l.id === "light" ? (state.darkMode ? "dark" : "light") : l.id,
                );
                setOpen(false);
                toggle.current?.focus();
              }}
              className="flex h-9 w-full items-center justify-between rounded-[8px] px-3 text-[13px] font-medium hover:bg-paper-2 pointer-coarse:h-11"
            >
              {l.label}
              {current === l.id && (
                <Check size={14} weight="bold" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      )}
      {locator.message && (
        <p
          role="alert"
          className="anim-fade max-w-[260px] rounded-[10px] border border-rule bg-paper px-3 py-2 text-[12.5px] leading-[1.45] shadow-[var(--shadow)]"
        >
          {locator.message}{" "}
          <button
            type="button"
            onClick={locator.clear}
            className="font-semibold text-accent-ink underline underline-offset-2"
          >
            Tutup
          </button>
        </p>
      )}
    </div>
  );
}

/** Loading and failure chips for geometry and data, each with a retry. */
export function MapStatus() {
  const { state, retryData, retryGeometry } = useApp();
  const items: {
    key: string;
    text: string;
    error?: boolean;
    retry?: () => void;
  }[] = [];
  if (state.geometryStatus === "loading")
    items.push({ key: "g", text: "Memuat batas wilayah…" });
  if (state.geometryStatus === "error")
    items.push({
      key: "g",
      text: "Batas wilayah gagal dimuat.",
      error: true,
      retry: retryGeometry,
    });
  if (state.dataStatus === "loading")
    items.push({ key: "d", text: "Memuat data upah & biaya…" });
  if (state.dataStatus === "error")
    items.push({
      key: "d",
      text: "Data upah & biaya gagal dimuat.",
      error: true,
      retry: retryData,
    });
  if (!items.length) return null;
  return (
    <div className="absolute left-1/2 top-4 z-30 flex -translate-x-1/2 flex-col items-center gap-2">
      {items.map((it) => (
        <div
          key={it.key}
          role={it.error ? "alert" : "status"}
          className={`flex items-center gap-2.5 whitespace-nowrap rounded-full border px-4 py-2 text-[13px] font-medium shadow-[var(--shadow)] ${
            it.error
              ? "border-danger/40 bg-paper text-danger"
              : "border-rule bg-paper text-ink-2"
          }`}
        >
          {!it.error && (
            <span
              aria-hidden="true"
              className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
          )}
          {it.text}
          {it.retry && (
            <button
              type="button"
              onClick={it.retry}
              className="inline-flex items-center gap-1 rounded-full bg-danger px-2.5 py-0.5 text-[12px] font-semibold text-paper"
            >
              <ArrowClockwise size={12} weight="bold" aria-hidden="true" />
              Coba lagi
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

/** The method is always one click from the map (estimates, not survey data). */
export function MethodChip({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/metode#rumus"
      className={`absolute z-10 inline-flex items-center gap-1.5 rounded-full border border-rule bg-paper/92 px-3 py-1.5 text-[12px] font-medium text-ink-2 shadow-[0_1px_2px_rgb(0_0_0/0.06)] backdrop-blur hover:border-rule-2 hover:text-ink ${className}`}
    >
      <Info size={14} aria-hidden="true" />
      Biaya hidup = estimasi model · cara hitung
    </Link>
  );
}
