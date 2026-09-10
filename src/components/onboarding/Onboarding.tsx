"use client";

import { useLayoutEffect, useState } from "react";
import { useApp } from "@/state/AppContext";
import {
  AFFORDABILITY_BANDS,
  BAND_LABEL,
  bandColors,
} from "@/lib/calculations";
import type { AffordabilityBand } from "@/lib/types";
import { compactOverlayWidth } from "@/lib/responsive";
import { useDialogFocus } from "@/lib/useDialogFocus";
import {
  TOUR_BROAD,
  TOUR_NARROW,
  placeTooltip,
  type SpotRect,
  type TourStep,
} from "./tour";
import { AppIcon } from "../icons";

const BAND_ORDER: AffordabilityBand[] = [
  "comfortable",
  "manageable",
  "tight",
  "insufficient",
];

function bandRange(band: AffordabilityBand): string {
  const b = AFFORDABILITY_BANDS;
  if (band === "comfortable") return `≥ ${b.comfortableAt}%`;
  if (band === "manageable") return `${b.manageableAt}–${b.comfortableAt - 1}%`;
  if (band === "tight") return `${b.tightAt}–${b.manageableAt - 1}%`;
  return `< ${b.tightAt}%`;
}

/**
 * Guided onboarding overlay. Renders the intro card, the spotlight steps that
 * point at real elements (via `data-tour` anchors), or the closing card,
 * depending on `tourIdx`. Nothing here mutates app state beyond the tour.
 */
export function Onboarding({ narrow }: { narrow: boolean }) {
  const { state } = useApp();
  const idx = state.tourIdx;
  if (idx === null) return null;

  const steps = narrow ? TOUR_NARROW : TOUR_BROAD;
  if (idx === -1) return <IntroCard narrow={narrow} />;
  if (idx >= steps.length) return <ClosingCard narrow={narrow} />;
  return <SpotlightStep steps={steps} idx={idx} narrow={narrow} />;
}

function MiniLegend({ dark }: { dark: boolean }) {
  const palette = bandColors(dark);
  return (
    <ul className="mt-2 space-y-1">
      {BAND_ORDER.map((band) => (
        <li key={band} className="flex items-center gap-2 text-[11.5px]">
          <span
            aria-hidden="true"
            className="h-3 w-5 shrink-0 rounded-sm"
            style={{ backgroundColor: palette[band] }}
          />
          <span className="font-medium">{BAND_LABEL[band]}</span>
          <span className="tabular-nums text-muted">{bandRange(band)}</span>
        </li>
      ))}
    </ul>
  );
}

function IntroCard({ narrow }: { narrow: boolean }) {
  const { state, beginTourSteps, setTourIdx, setOnboardCard } = useApp();
  const dismiss = () => {
    setTourIdx(null);
    setOnboardCard(true);
  };
  const dialogRef = useDialogFocus<HTMLDivElement>(true, dismiss);
  return (
    <div
      className="fixed inset-0 z-[60] flex justify-center bg-black/55"
      role="dialog"
      aria-modal="true"
      aria-label="Panduan Nafkah"
    >
      <div
        ref={dialogRef}
        className="absolute top-[10%] max-h-[80%] overflow-y-auto rounded-2xl border border-border bg-card p-[17px_19px] shadow-[0_20px_54px_rgba(0,0,0,0.34)]"
        style={{
          width: narrow ? "min(424px, calc(100vw - 24px))" : 424,
        }}
      >
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-accent">
          Panduan · sekitar 1 menit
        </p>
        <h2 className="mt-1 text-[20px] font-bold tracking-[-0.02em]">
          Apa yang dijawab peta ini?
        </h2>
        <p className="mt-2 text-[13px] leading-[1.6] text-muted">
          Gaji yang sama terasa berbeda di tiap kota. Nafkah menyandingkan upah
          minimum 514 kabupaten/kota dengan estimasi biaya hidup bulanannya,
          lalu mewarnai peta dari hasil bagi keduanya — kami sebut{" "}
          <strong className="text-ink">cakupan</strong>.
        </p>
        <div className="mt-3 rounded-xl bg-surface p-3">
          <p className="text-[13px] font-semibold">Cara membaca angkanya</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
            Cakupan <strong className="text-ink">92%</strong> berarti upah
            minimum menutup 92% biaya hidup — kurang sekitar Rp 400 rb tiap
            bulan.
          </p>
          <MiniLegend dark={state.darkMode} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={beginTourSteps}
            className="inline-flex h-11 min-w-[170px] flex-1 items-center justify-center gap-1.5 rounded-[11px] bg-accent px-4 text-sm font-bold text-on-accent hover:bg-accent-strong"
          >
            Tunjukkan caranya
            <AppIcon name="arrowRight" size={16} weight="bold" />
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="h-11 rounded-[11px] border border-border px-4 text-sm font-semibold text-muted hover:border-accent"
          >
            Nanti saja
          </button>
        </div>
      </div>
    </div>
  );
}

function ClosingCard({ narrow }: { narrow: boolean }) {
  const { setTourIdx } = useApp();
  const recap = [
    { t: "Cari wilayah", d: "atau klik langsung di peta." },
    { t: "Sematkan sampai 5", d: "untuk membandingkan cakupan & saldonya." },
    {
      t: "Ubah asumsi",
      d: "rumah tangga, hunian, pendapatan sendiri, atau gaji asal relokasi.",
    },
  ];
  const close = () => setTourIdx(null);
  const dialogRef = useDialogFocus<HTMLDivElement>(true, close);
  return (
    <div
      className="fixed inset-0 z-[60] flex justify-center bg-black/55"
      role="dialog"
      aria-modal="true"
      aria-label="Panduan selesai"
    >
      <div
        ref={dialogRef}
        className="absolute top-[10%] max-h-[80%] overflow-y-auto rounded-2xl border border-border bg-card p-[17px_19px] shadow-[0_20px_54px_rgba(0,0,0,0.34)]"
        style={{
          width: narrow ? "min(424px, calc(100vw - 24px))" : 424,
        }}
      >
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-accent">
          Selesai
        </p>
        <h2 className="mt-1 text-[19px] font-bold tracking-[-0.015em]">
          Itu saja alurnya
        </h2>
        <ol className="mt-3 space-y-2">
          {recap.map((r, i) => (
            <li key={r.t} className="flex gap-2.5">
              <span
                aria-hidden="true"
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[11px] font-extrabold text-accent"
              >
                {i + 1}
              </span>
              <p className="text-[13px] leading-snug">
                <strong>{r.t}</strong> <span className="text-muted">{r.d}</span>
              </p>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={close}
          className="mt-4 h-11 w-full rounded-[11px] bg-accent px-4 text-sm font-bold text-on-accent hover:bg-accent-strong"
        >
          Mulai jelajahi peta
        </button>
        <p className="mt-2.5 text-[11.5px] leading-relaxed text-muted">
          Panduan ini bisa dibuka lagi kapan saja dari tombol{" "}
          <strong className="text-ink">Panduan</strong> di kanan atas.
        </p>
      </div>
    </div>
  );
}

function SpotlightStep({
  steps,
  idx,
  narrow,
}: {
  steps: TourStep[];
  idx: number;
  narrow: boolean;
}) {
  const { setTourIdx, setOnboardCard } = useApp();
  const step = steps[idx];
  const [spot, setSpot] = useState<SpotRect | null>(null);

  // Measure the anchor each time the step changes and whenever the viewport
  // moves. Anchors are read from the live DOM, never hardcoded.
  useLayoutEffect(() => {
    let raf = 0;
    const measure = () => {
      const el = document.querySelector<HTMLElement>(
        `[data-tour="${step.key}"]`,
      );
      if (!el) {
        setSpot(null);
        return;
      }
      const r = el.getBoundingClientRect();
      setSpot({ key: step.key, x: r.left, y: r.top, w: r.width, h: r.height });
    };
    measure();
    raf = requestAnimationFrame(measure);
    const t = setTimeout(measure, 140);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [step.key]);

  const fw = typeof window === "undefined" ? 1440 : window.innerWidth;
  const fh = typeof window === "undefined" ? 900 : window.innerHeight;
  const tw = narrow ? compactOverlayWidth(fw) : 344;
  const compactBottomSafeArea = narrow ? 68 + 140 + 16 : 0;
  const controlSafeLeft = !narrow ? (fw < 1800 ? 380 : 423) : 0;
  const railSafeRight = !narrow ? (fw < 1800 ? 326 : 390) : 0;
  const comparison =
    !narrow && typeof document !== "undefined"
      ? document.querySelector<HTMLElement>('[data-tour="compare"]')
      : null;
  const comparisonBottomInset = comparison
    ? Math.max(0, fh - comparison.getBoundingClientRect().top + 14)
    : 0;
  const bottomSafeArea = Math.max(compactBottomSafeArea, comparisonBottomInset);
  const pos = placeTooltip(
    spot,
    tw,
    fw,
    fh,
    bottomSafeArea,
    controlSafeLeft,
    railSafeRight,
  );

  const skip = () => {
    setTourIdx(null);
    setOnboardCard(true);
  };
  const last = idx === steps.length - 1;
  const dialogRef = useDialogFocus<HTMLDivElement>(true, skip);

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-label={step.title}
    >
      {/* Scrim: transparent when a spotlight is up (dim comes from its ring). */}
      <div
        className="absolute inset-0"
        style={{ background: spot ? "transparent" : "rgba(0,0,0,0.55)" }}
      />
      {spot && (
        <div
          aria-hidden="true"
          className="absolute rounded-2xl"
          style={{
            left: spot.x - 6,
            top: spot.y - 6,
            width: spot.w + 12,
            height: spot.h + 12,
            boxShadow: "0 0 0 2px var(--accent), 0 0 0 9999px rgba(0,0,0,0.55)",
            pointerEvents: "none",
            transition:
              "left .22s ease, top .22s ease, width .22s ease, height .22s ease",
          }}
        />
      )}
      <div
        ref={dialogRef}
        className="absolute overflow-y-auto rounded-2xl border border-border bg-card shadow-[0_20px_54px_rgba(0,0,0,0.34)]"
        style={{
          left: pos.left,
          top: pos.top,
          bottom: pos.bottom,
          width: tw,
          maxHeight: fh - 32,
          padding: narrow ? "15px 16px" : "17px 19px",
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-accent">
            Langkah {idx + 1} dari {steps.length}
          </p>
          <div className="flex items-center gap-1" aria-hidden="true">
            {steps.map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-[width] duration-200"
                style={{
                  width: i === idx ? 16 : 6,
                  background: i === idx ? "var(--accent)" : "var(--border)",
                }}
              />
            ))}
          </div>
        </div>
        <h2 className="mt-2 text-[16.5px] font-bold">{step.title}</h2>
        <p className="mt-1.5 text-[13px] leading-[1.6] text-muted">
          {step.body}
        </p>
        {step.tip && (
          <p className="mt-3 rounded-[10px] bg-surface p-3 text-[12.5px] leading-relaxed text-muted">
            {step.tip}
          </p>
        )}
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={skip}
            className="text-xs font-semibold text-muted hover:text-ink"
          >
            Lewati
          </button>
          {idx > 0 && (
            <button
              type="button"
              onClick={() => setTourIdx(idx - 1)}
              className="ml-auto inline-flex h-10 items-center gap-1.5 rounded-[10px] border border-border px-3.5 text-xs font-semibold text-muted hover:border-accent"
            >
              <AppIcon name="arrowLeft" size={14} />
              Kembali
            </button>
          )}
          <button
            type="button"
            onClick={() => setTourIdx(idx + 1)}
            className={`inline-flex h-10 items-center gap-1.5 rounded-[10px] bg-accent px-4 text-[12.5px] font-bold text-on-accent hover:bg-accent-strong ${
              idx > 0 ? "" : "ml-auto"
            }`}
          >
            {last ? "Selesai" : "Lanjut"}
            <AppIcon name={last ? "check" : "arrowRight"} size={15} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
