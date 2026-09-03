"use client";

import { useApp } from "@/state/AppContext";

const STEPS = [
  {
    t: "Cari wilayah",
    d: "atau ketuk langsung di peta untuk melihat rincian 10 kategori biaya.",
  },
  {
    t: "Sematkan sampai 5",
    d: "wilayah untuk membandingkan cakupan dan saldo bulanannya.",
  },
  {
    t: "Ubah asumsi",
    d: "rumah tangga, hunian, atau pendapatan sendiri — peta mewarnai ulang seketika.",
  },
];

/**
 * Persistent "three steps to start" card. Shown while the tour is off and the
 * data is ready; dismissable, and re-openable from the About drawer.
 */
export function ThreeStepCard({ className = "" }: { className?: string }) {
  const { state, setOnboardCard, beginTourSteps } = useApp();

  const ready =
    state.geometryStatus === "ready" && state.dataStatus === "ready";
  if (!state.onboardCardOpen || state.tourIdx !== null || !ready) return null;

  return (
    <section
      aria-label="Tiga langkah untuk mulai"
      className={`rounded-2xl border border-accent bg-card p-3.5 shadow-[0_8px_26px_rgba(0,0,0,0.12)] ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-[13.5px] font-bold">Tiga langkah untuk mulai</h2>
        <button
          type="button"
          onClick={() => setOnboardCard(false)}
          aria-label="Tutup kartu tiga langkah"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted hover:bg-accent-soft hover:text-ink"
        >
          ✕
        </button>
      </div>
      <ol className="mt-2 space-y-2">
        {STEPS.map((s, i) => (
          <li key={s.t} className="flex gap-2.5">
            <span
              aria-hidden="true"
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[11px] font-extrabold text-accent"
            >
              {i + 1}
            </span>
            <p className="text-[12.5px] leading-snug">
              <strong>{s.t}</strong> <span className="text-muted">{s.d}</span>
            </p>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={beginTourSteps}
        className="mt-3 h-10 w-full rounded-[10px] border border-accent bg-accent-soft text-[12.5px] font-bold text-accent hover:brightness-95"
      >
        Tunjukkan langsung di layar →
      </button>
    </section>
  );
}
