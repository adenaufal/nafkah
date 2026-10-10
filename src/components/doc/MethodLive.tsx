"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { AppProvider, useApp } from "@/state/AppContext";
import { useRanking, wageLabel } from "@/state/derived";
import { BAND_ORDER, bandTheme } from "@/lib/bands";
import { pct, rp, rpSigned } from "@/lib/format";
import { profileSummary } from "@/lib/profile";
import { DocHeader } from "./DocHeader";
import { Toc, type TocItem } from "./Toc";

/**
 * Client frame for the Metode page: the same AppProvider as the map (minus
 * the boundary file), so the live examples use the visitor's own profile and
 * selected region. The prose around it is server-rendered.
 */
export function MethodShell({
  toc,
  children,
}: {
  toc: TocItem[];
  children: ReactNode;
}) {
  return (
    <AppProvider withGeometry={false}>
      <Frame toc={toc}>{children}</Frame>
    </AppProvider>
  );
}

function Frame({ toc, children }: { toc: TocItem[]; children: ReactNode }) {
  const { state, setDarkMode } = useApp();
  // Persisted state only exists in the browser; match the static HTML first.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && state.darkMode;
  return (
    <div className="doc-page min-h-dvh">
      <DocHeader
        current="metode"
        dark={dark}
        onToggleTheme={() => setDarkMode(!dark)}
      />
      <div className="mx-auto max-w-6xl px-5 lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14 lg:px-8">
        <Toc items={toc} />
        {children}
      </div>
    </div>
  );
}

type Pick = "mine" | "top" | "middle" | "bottom";

/** The formula, run on a real region with the visitor's current profile. */
export function WorkedExample() {
  const { state, metricsReady } = useApp();
  const ranking = useRanking();
  const [pick, setPick] = useState<Pick>("mine");
  const theme = bandTheme(state.darkMode);

  const options = useMemo(() => {
    if (!ranking.ready) return [];
    const r = ranking.ranked;
    const mine = state.selectedCode
      ? r.find((x) => x.code === state.selectedCode)
      : undefined;
    return [
      ...(mine
        ? [{ id: "mine" as const, label: "Daerah pilihanmu", region: mine }]
        : []),
      { id: "top" as const, label: "Paling lega", region: r[0] },
      {
        id: "middle" as const,
        label: "Di tengah",
        region: r[Math.floor(r.length / 2)],
      },
      { id: "bottom" as const, label: "Paling berat", region: r[r.length - 1] },
    ];
  }, [ranking, state.selectedCode]);

  if (!metricsReady || !options.length) {
    return (
      <div
        className="my-6 h-[264px] rounded-[16px] border border-rule bg-paper-2/60"
        role="status"
        aria-label="Memuat contoh perhitungan"
      >
        <div className="skel m-5 h-5 w-1/2" />
        <div className="skel mx-5 mt-6 h-4 w-3/4" />
        <div className="skel mx-5 mt-3 h-4 w-2/3" />
      </div>
    );
  }

  const current = options.find((o) => o.id === pick) ?? options[0];
  const r = current.region;
  const m = r.metric;
  const a = state.assumptions;

  return (
    <figure className="my-6 rounded-[16px] border border-rule bg-paper-2/60 p-5 max-sm:p-4">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">
          Contoh dengan profilmu
        </span>
        <span className="text-[12px] text-muted">{profileSummary(a)}</span>
      </figcaption>
      <div
        role="group"
        aria-label="Pilih contoh daerah"
        className="mt-3 flex flex-wrap gap-1.5"
      >
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={o.id === current.id}
            onClick={() => setPick(o.id)}
            className={`h-8 rounded-full px-3 text-[12.5px] font-semibold transition-colors ${
              o.id === current.id
                ? "bg-ink text-paper"
                : "border border-rule-2 text-ink-2 hover:border-ink-2"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <p className="mt-4 text-[17px] font-bold leading-tight">
        {r.label}
        <span className="ml-2 text-[13px] font-normal text-muted">
          {r.province}
        </span>
      </p>
      <dl className="mt-3 text-[14px]">
        <Row
          label={`Pendapatan (${wageLabel(m, a)})`}
          value={rp(m.wageAmount)}
        />
        <Row
          label="Biaya hidup bulanan (10 kategori)"
          value={rp(m.totalMonthlyCost)}
          op="÷"
        />
        <div className="my-2 border-t border-rule-2" aria-hidden="true" />
        <div className="flex items-baseline justify-between gap-3 py-1">
          <dt className="font-semibold">
            <span
              className="mr-2 inline-block w-3 text-muted"
              aria-hidden="true"
            >
              =
            </span>
            Cakupan
          </dt>
          <dd className="flex items-baseline gap-2">
            <span
              className="f-display tnum text-[28px] font-[560] leading-none"
              style={{ color: theme[m.band].ink }}
            >
              {pct(m.coveragePercent, 1)}
            </span>
            <span className="text-[13px] font-semibold text-ink-2">
              {theme[m.band].label}
            </span>
          </dd>
        </div>
        <Row
          label={
            m.surplusOrDeficit >= 0 ? "Sisa per bulan" : "Kurang per bulan"
          }
          value={rpSigned(m.surplusOrDeficit, false)}
          tone={m.surplusOrDeficit >= 0 ? "ok" : "danger"}
        />
      </dl>
      <p className="mt-4 text-[12.5px] leading-[1.55] text-muted">
        {pct(m.coveragePercent, 1)} = {rp(m.wageAmount)} ÷{" "}
        {rp(m.totalMonthlyCost)} × 100%. Angka mengikuti profil yang sedang kamu
        pakai di peta.{" "}
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-semibold text-accent-ink hover:underline"
        >
          Ubah profil di peta
          <ArrowRight size={12} weight="bold" aria-hidden="true" />
        </Link>
      </p>
    </figure>
  );
}

function Row({
  label,
  value,
  op,
  tone,
}: {
  label: string;
  value: string;
  op?: string;
  tone?: "ok" | "danger";
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <dt className="text-ink-2">
        <span className="mr-2 inline-block w-3 text-muted" aria-hidden="true">
          {op}
        </span>
        {label}
      </dt>
      <dd
        className={`tnum font-semibold ${tone === "ok" ? "text-ok" : tone === "danger" ? "text-danger" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

/** Band counts for the visitor's profile, next to the static thresholds. */
export function ProfileBands() {
  const { state } = useApp();
  const ranking = useRanking();
  const theme = bandTheme(state.darkMode);
  if (!ranking.ready) {
    return <div className="skel mt-4 h-10 w-full" aria-hidden="true" />;
  }
  return (
    <div className="mt-4 rounded-[12px] border border-rule p-3.5">
      <p className="text-[13px] text-ink-2">
        Dengan profilmu ({profileSummary(state.assumptions)}), sebaran{" "}
        {ranking.total} daerah saat ini:
      </p>
      <div
        className="mt-2.5 flex h-2.5 gap-[2px] overflow-hidden rounded-full"
        aria-hidden="true"
      >
        {BAND_ORDER.map((b) => (
          <span
            key={b}
            style={{ flexGrow: ranking.counts[b], background: theme[b].fill }}
          />
        ))}
      </div>
      <ul className="tnum mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-ink-2">
        {BAND_ORDER.map((b) => (
          <li key={b}>
            <b className="font-semibold text-ink">{ranking.counts[b]}</b>{" "}
            {theme[b].label}
          </li>
        ))}
        <li className="text-muted">median {pct(ranking.medianCoverage, 1)}</li>
      </ul>
      {state.selectedCode && (
        <p className="mt-2 text-[12px] text-muted">
          Daerah pilihanmu:{" "}
          {(() => {
            const r = ranking.ranked.find((x) => x.code === state.selectedCode);
            return r ? `${r.label} — ${pct(r.metric.coveragePercent)}` : "—";
          })()}
        </p>
      )}
    </div>
  );
}
