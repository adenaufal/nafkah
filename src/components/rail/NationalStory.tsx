"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, PencilSimple, X } from "@phosphor-icons/react";
import { useApp } from "@/state/AppContext";
import {
  useAssumptionActions,
  useBelowWith,
  useRanking,
} from "@/state/derived";
import { BAND_ORDER, bandTheme } from "@/lib/bands";
import { activePartnerIncome, VALUE_RAMP } from "@/lib/calculations";
import { pct, rpShort } from "@/lib/format";
import { provinceSummaries, valueStops } from "@/lib/insights";
import { regionLabel } from "@/lib/names";
import { householdNoun, profileSummary } from "@/lib/profile";
import type { ColorMode } from "@/lib/types";
import { wageKind } from "@/lib/wages";
import { useSettled } from "@/components/hooks";
import { Kicker, Seg, SectionTitle } from "@/components/ui";
import { DotStrip } from "./DotStrip";
import { IncomeControl } from "./IncomeControl";

const MODES: { value: ColorMode; label: string; hint: string }[] = [
  { value: "coverage", label: "Cakupan", hint: "Upah ÷ estimasi biaya hidup" },
  { value: "cost", label: "Biaya hidup", hint: "Estimasi rupiah per bulan" },
  { value: "wage", label: "Upah", hint: "UMK/UMP per bulan" },
];

export function NationalStory({
  hoverCode,
  onHover,
  onEditProfile,
  onProvinceHover,
  onProvinceZoom,
}: {
  hoverCode: string | null;
  onHover: (code: string | null) => void;
  onEditProfile: () => void;
  onProvinceHover: (codes: string[] | null) => void;
  onProvinceZoom: (codes: string[]) => void;
}) {
  const {
    state,
    metrics,
    regionByCode,
    select,
    setLegendFilter,
    setColorMode,
    retryData,
  } = useApp();
  const ranking = useRanking();
  const theme = bandTheme(state.darkMode);
  const a = state.assumptions;
  const origin = state.originCode
    ? regionByCode.get(state.originCode)
    : undefined;
  const dual = a.dualIncome && a.householdType !== "single";
  const custom = (a.customIncome ?? 0) > 0;
  const partnerPay = activePartnerIncome(a);
  const net = a.wageBasis === "takeHome" ? " setelah potongan (estimasi)" : "";
  const originKind = wageKind(
    state.originCode ? state.wages.get(state.originCode) : undefined,
  );
  const wageName = origin
    ? `${originKind} ${regionLabel(origin)}`
    : "upah minimum";
  const own = custom
    ? `gajimu ${rpShort(a.customIncome ?? 0)}`
    : `${wageName}${net}`;
  const subject =
    partnerPay != null
      ? `${own} ditambah gaji pasangan ${rpShort(partnerPay)}`
      : !dual
        ? own
        : custom
          ? `${own} ditambah upah pasangan`
          : `dua ${wageName}${net}`;
  const noun = householdNoun(a);
  // The default profile sets aside ±10% savings; say so, with the count
  // without it, instead of folding it silently into "biaya hidup".
  const { set } = useAssumptionActions();
  const belowNoSavings = useBelowWith({ includeSavings: false });
  // Screen readers hear the new count once the slider settles, not per step.
  const announce = useSettled(
    ranking.ready
      ? `${ranking.below} dari ${ranking.total} daerah di bawah 100 persen.`
      : "",
    700,
  );

  return (
    <div className="anim-rise space-y-10">
      <header>
        <Kicker>
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-[2px] bg-accent"
          />
          UMK 2026 × estimasi biaya hidup
        </Kicker>
        {ranking.ready ? (
          <h1
            tabIndex={-1}
            className="f-display text-balance mt-4 text-[clamp(28px,2.6vw,36px)] font-[560] leading-[1.1] tracking-[-0.012em] outline-none"
          >
            {ranking.below === 0 ? (
              <>
                Dengan profil ini, {subject} menutup biaya hidup {noun} di{" "}
                <span className="text-accent">seluruh {ranking.total}</span>{" "}
                daerah.
              </>
            ) : (
              <>
                Di <span className="tnum text-accent">{ranking.below}</span>{" "}
                dari <span className="tnum">{ranking.total}</span> daerah,{" "}
                {subject} belum menutup biaya hidup {noun}.
              </>
            )}
          </h1>
        ) : state.dataStatus === "error" ? (
          <div role="alert" className="mt-4">
            <h1
              tabIndex={-1}
              className="f-display text-[30px] font-[560] leading-[1.12] tracking-[-0.012em] outline-none"
            >
              Data upah &amp; biaya belum bisa dimuat.
            </h1>
            <p className="mt-3 text-[14.5px] leading-[1.6] text-ink-2">
              Batas wilayah tetap tampil berarsir. Periksa koneksi, lalu coba
              lagi — setelah kunjungan pertama yang berhasil, data tersimpan di
              browser untuk dipakai offline.
            </p>
            <button
              type="button"
              onClick={retryData}
              className="mt-4 h-10 rounded-[10px] bg-ink px-4 text-[13.5px] font-semibold text-paper"
            >
              Coba lagi
            </button>
          </div>
        ) : (
          <div
            className="mt-4 space-y-2.5"
            role="status"
            aria-label="Memuat ringkasan"
          >
            <div className="skel h-8 w-[92%]" />
            <div className="skel h-8 w-[80%]" />
            <div className="skel h-8 w-[55%]" />
          </div>
        )}
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
        {ranking.ready && a.includeSavings && belowNoSavings !== null && (
          <p className="tnum mt-3 text-[13px] leading-[1.55] text-ink-2">
            Biaya hidup di sini sudah termasuk tabungan ±10%. Tanpa tabungan:{" "}
            <b className="font-semibold text-ink">{belowNoSavings}</b> daerah.{" "}
            <button
              type="button"
              onClick={() => set("includeSavings", false)}
              className="font-semibold text-accent-ink underline decoration-rule-2 underline-offset-2 hover:decoration-accent"
            >
              Hitung tanpa tabungan
            </button>
          </p>
        )}
        <p className="text-pretty mt-4 text-[15px] leading-[1.6] text-ink-2">
          Warna peta menunjukkan berapa persen biaya hidup bulanan yang tertutup
          pendapatan. Pilih daerah mana pun untuk membaca struk bulanannya.
        </p>
      </header>

      {state.onboardCardOpen && ranking.ready && <IntroCard />}

      {state.dataStatus !== "error" && (
        <>
          <section
            aria-labelledby="calc-title"
            className="rounded-[16px] border border-rule bg-paper-2/50 p-4"
          >
            <h2
              id="calc-title"
              className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.12em] text-muted"
            >
              Hitung dengan
            </h2>
            <IncomeControl />
            <div className="mt-4 flex items-start justify-between gap-3 border-t border-rule pt-3">
              <p className="min-w-0 text-[13px] leading-[1.5] text-ink-2">
                <span className="font-semibold text-ink">Untuk:</span>{" "}
                {profileSummary(a)}
              </p>
              <button
                type="button"
                onClick={onEditProfile}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-[8px] px-2 py-1 text-[13px] font-semibold text-accent-ink hover:bg-accent-soft"
              >
                <PencilSimple size={14} weight="bold" aria-hidden="true" />
                Ubah profil
              </button>
            </div>
          </section>

          <section aria-labelledby="dist-title">
            <SectionTitle
              id="dist-title"
              aside={
                state.colorMode === "coverage" ? (
                  <span className="text-[12px] text-muted">
                    pilih kelompok untuk menyaring
                  </span>
                ) : null
              }
            >
              Sebaran {ranking.total || 514} daerah
            </SectionTitle>
            <div className="mb-4">
              <Seg
                label="Warnai peta menurut"
                value={state.colorMode}
                options={MODES}
                onChange={setColorMode}
                hideLabel
              />
            </div>

            {state.colorMode === "coverage" ? (
              <>
                <div
                  className="flex h-3.5 gap-[2px] overflow-hidden rounded-[3px]"
                  aria-hidden="true"
                >
                  {BAND_ORDER.map((band) => (
                    <span
                      key={band}
                      className="h-full transition-[flex-grow,opacity] duration-300"
                      style={{
                        flexGrow: ranking.ready ? ranking.counts[band] : 1,
                        background: ranking.ready
                          ? theme[band].fill
                          : "var(--paper-3)",
                        opacity:
                          state.legendFilter && state.legendFilter !== band
                            ? 0.25
                            : 1,
                      }}
                    />
                  ))}
                </div>
                <ul
                  className="mt-3 grid grid-cols-4 gap-1"
                  role="group"
                  aria-label="Saring peta menurut kelompok"
                >
                  {BAND_ORDER.map((band) => {
                    const on = state.legendFilter === band;
                    const off = state.legendFilter && !on;
                    return (
                      <li key={band}>
                        <button
                          type="button"
                          aria-pressed={on}
                          onClick={() => setLegendFilter(on ? null : band)}
                          className={`w-full rounded-[10px] px-2 py-2 text-left transition-[background,opacity] ${
                            on
                              ? "bg-paper-2 ring-1 ring-rule-2"
                              : "hover:bg-paper-2"
                          }`}
                        >
                          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-ink-2">
                            <span
                              aria-hidden="true"
                              className="h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{
                                background: theme[band].fill,
                                // Filtered-out bands dim the swatch only; the
                                // text stays readable.
                                opacity: off ? 0.35 : 1,
                              }}
                            />
                            <span className="leading-tight">
                              {theme[band].label}
                            </span>
                          </span>
                          <span
                            className={`f-display tnum mt-1 block text-[26px] font-[520] leading-none ${off ? "text-muted" : ""}`}
                          >
                            {ranking.ready ? ranking.counts[band] : "–"}
                          </span>
                          <span className="tnum mt-1 block text-[11.5px] text-muted">
                            {theme[band].range}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {state.legendFilter && (
                  <p className="mt-2 text-[12.5px] text-muted">
                    Peta hanya menonjolkan daerah{" "}
                    {theme[state.legendFilter].label}.{" "}
                    <button
                      type="button"
                      onClick={() => setLegendFilter(null)}
                      className="font-semibold text-accent-ink underline underline-offset-2"
                    >
                      Tampilkan semua
                    </button>
                  </p>
                )}
              </>
            ) : (
              <ValueLegend
                mode={state.colorMode}
                values={[...metrics.values()].map((m) =>
                  state.colorMode === "cost"
                    ? m.totalMonthlyCost
                    : m.regionalWageAmount,
                )}
                dark={state.darkMode}
              />
            )}
          </section>

          <section aria-labelledby="strip-title">
            <SectionTitle
              id="strip-title"
              aside={
                ranking.ready ? (
                  <span className="tnum text-[12px] text-muted">
                    ▼ median {pct(ranking.medianCoverage, 1)}
                  </span>
                ) : null
              }
            >
              Setiap titik satu daerah
            </SectionTitle>
            {ranking.ready ? (
              <DotStrip
                ranked={ranking.ranked}
                dark={state.darkMode}
                median={ranking.medianCoverage}
                hoverCode={hoverCode}
                onHover={onHover}
                onSelect={select}
              />
            ) : (
              <div className="skel h-24 w-full" aria-hidden="true" />
            )}
            <p className="mt-2 text-[12.5px] leading-[1.5] text-muted">
              Garis tegas = 100%, titik ketika pendapatan pas menutup biaya
              hidup. Pilih titik untuk membuka daerahnya; arahkan kursor untuk
              menemukannya di peta.
            </p>
          </section>

          <section
            aria-labelledby="rank-title"
            className="grid grid-cols-2 gap-x-6 max-[360px]:grid-cols-1 max-[360px]:gap-y-6"
          >
            <h2 id="rank-title" className="sr-only">
              Daerah dengan cakupan tertinggi dan terendah
            </h2>
            {(["top", "bottom"] as const).map((side) => {
              const list =
                side === "top"
                  ? ranking.ranked.slice(0, 5)
                  : ranking.ranked.slice(-5).reverse();
              return (
                <div key={side}>
                  <p className="mb-2 border-b border-rule pb-2 text-[13px] font-bold">
                    {side === "top" ? "Paling lega" : "Paling berat"}
                  </p>
                  <ol className="space-y-0.5">
                    {list.map((r) => (
                      <li key={r.code}>
                        <button
                          type="button"
                          onClick={() => select(r.code)}
                          onMouseEnter={() => onHover(r.code)}
                          onMouseLeave={() => onHover(null)}
                          onFocus={() => onHover(r.code)}
                          onBlur={() => onHover(null)}
                          className="flex w-full items-baseline gap-2 rounded-[6px] py-1.5 text-left hover:bg-paper-2"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13.5px] font-medium">
                              {r.label}
                            </span>
                            <span className="block truncate text-[11.5px] text-muted">
                              {r.province}
                            </span>
                          </span>
                          <span
                            className="tnum text-[13.5px] font-semibold"
                            style={{ color: theme[r.metric.band].ink }}
                          >
                            {pct(r.metric.coveragePercent)}
                          </span>
                        </button>
                      </li>
                    ))}
                    {!ranking.ready &&
                      [0, 1, 2, 3, 4].map((i) => (
                        <li
                          key={i}
                          className="skel my-2 h-7"
                          aria-hidden="true"
                        />
                      ))}
                  </ol>
                </div>
              );
            })}
          </section>

          {ranking.ready && (
            <Provinces
              ranked={ranking.ranked}
              dark={state.darkMode}
              onHover={onProvinceHover}
              onZoom={onProvinceZoom}
            />
          )}
        </>
      )}

      <footer className="border-t border-rule pt-4 text-[12.5px] leading-[1.6] text-muted">
        Biaya hidup adalah{" "}
        <b className="font-semibold text-ink-2">estimasi model</b> dari agregat
        Susenas, IHK BPS, dan benchmark harga lokal — bukan survei per
        kabupaten. UMK adalah lantai upah resmi, bukan gaji rata-rata. Bukan
        nasihat keuangan.{" "}
        <Link
          href="/metode"
          className="font-semibold text-accent-ink underline decoration-rule-2 underline-offset-2 hover:decoration-accent"
        >
          Baca metodenya
        </Link>
      </footer>
    </div>
  );
}

/** First visit only: how to read the map, dismissable. */
function IntroCard() {
  const { setOnboardCard } = useApp();
  const steps = [
    {
      t: "Warna = cakupan.",
      d: "Pendapatan dibagi estimasi biaya hidup bulanan. Nyaman (hijau) berarti lega, Tak Cukup (merah) berarti kurang.",
    },
    {
      t: "Pilih daerah",
      d: "di peta, daftar, atau pencarian untuk membaca struk bulanannya.",
    },
    {
      t: "Pakai angkamu.",
      d: "Pilih Gajiku lalu geser — peta menghitung ulang 514 daerah seketika.",
    },
  ];
  return (
    <section
      aria-labelledby="intro-title"
      className="anim-fade relative rounded-[16px] border border-rule bg-paper-2/60 p-4 pr-11 shadow-[inset_3px_0_0_var(--accent)]"
    >
      <h2 id="intro-title" className="text-[14px] font-bold">
        Baru pertama kali? Begini membacanya
      </h2>
      <ol className="mt-2.5 space-y-2">
        {steps.map((s, i) => (
          <li key={s.t} className="flex gap-2.5 text-[13px] leading-[1.5]">
            <span
              aria-hidden="true"
              className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-paper text-[11px] font-bold text-accent-ink"
            >
              {i + 1}
            </span>
            <span>
              <b className="font-semibold">{s.t}</b>{" "}
              <span className="text-ink-2">{s.d}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={() => setOnboardCard(false)}
          className="h-9 rounded-[10px] bg-ink px-3.5 text-[13px] font-semibold text-paper"
        >
          Mengerti
        </button>
        <Link
          href="/metode"
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-accent-ink hover:underline"
        >
          Cara angkanya dihitung
          <ArrowRight size={13} weight="bold" aria-hidden="true" />
        </Link>
      </div>
      <button
        type="button"
        onClick={() => setOnboardCard(false)}
        aria-label="Tutup panduan singkat"
        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full text-ink-2 hover:bg-paper/70"
      >
        <X size={14} weight="bold" aria-hidden="true" />
      </button>
    </section>
  );
}

function ValueLegend({
  mode,
  values,
  dark,
}: {
  mode: ColorMode;
  values: number[];
  dark: boolean;
}) {
  const stops = useMemo(() => valueStops(values), [values]);
  const ramp = dark ? VALUE_RAMP.dark : VALUE_RAMP.light;
  return (
    <div>
      <div
        aria-hidden="true"
        className="h-3.5 rounded-[3px]"
        style={{ background: `linear-gradient(to right, ${ramp.join(", ")})` }}
      />
      <div className="tnum mt-2 flex justify-between text-[12px] text-muted">
        {stops.map((s, i) => (
          <span key={i}>
            {i === 0 ? "≤ " : i === 2 ? "≥ " : ""}
            {rpShort(s)}
          </span>
        ))}
      </div>
      <p className="mt-2 text-[12.5px] leading-[1.5] text-muted">
        {mode === "cost"
          ? "Estimasi biaya hidup bulanan untuk profil aktif. Skala mengikuti persentil ke-10, 50, dan 90 dari 514 daerah."
          : "UMK/UMP 2026 per bulan (resmi). Skala mengikuti persentil ke-10, 50, dan 90 dari 514 daerah."}
      </p>
    </div>
  );
}

function Provinces({
  ranked,
  dark,
  onHover,
  onZoom,
}: {
  ranked: Parameters<typeof provinceSummaries>[0];
  dark: boolean;
  onHover: (codes: string[] | null) => void;
  onZoom: (codes: string[]) => void;
}) {
  const [all, setAll] = useState(false);
  const theme = bandTheme(dark);
  const list = useMemo(() => provinceSummaries(ranked), [ranked]);
  const shown = all ? list : list.slice(0, 6);
  return (
    <section aria-labelledby="prov-title">
      <SectionTitle
        id="prov-title"
        aside={
          <span className="text-[12px] text-muted">
            pilih untuk memperbesar
          </span>
        }
      >
        Provinsi paling berat
      </SectionTitle>
      <ol className="space-y-0.5" onMouseLeave={() => onHover(null)}>
        {shown.map((p) => (
          <li key={p.provinceCode}>
            <button
              type="button"
              onClick={() => onZoom(p.codes)}
              onMouseEnter={() => onHover(p.codes)}
              onFocus={() => onHover(p.codes)}
              onBlur={() => onHover(null)}
              className="grid w-full grid-cols-[minmax(0,1fr)_96px] items-center gap-3 rounded-[8px] px-1.5 py-1.5 text-left hover:bg-paper-2"
            >
              <span className="min-w-0">
                <span className="block truncate text-[13.5px] font-medium">
                  {p.province}
                </span>
                <span className="tnum block text-[11.5px] text-muted">
                  {p.below} dari {p.total} daerah di bawah 100%
                </span>
              </span>
              <span
                className="flex h-2 overflow-hidden rounded-full bg-paper-3"
                aria-hidden="true"
              >
                {BAND_ORDER.map((b) => (
                  <span
                    key={b}
                    style={{
                      flexGrow: p.counts[b],
                      background: theme[b].fill,
                    }}
                  />
                ))}
              </span>
            </button>
          </li>
        ))}
      </ol>
      {list.length > 6 && (
        <button
          type="button"
          onClick={() => setAll((v) => !v)}
          aria-expanded={all}
          className="mt-2 text-[12.5px] font-semibold text-accent-ink underline decoration-rule-2 underline-offset-2 hover:decoration-accent"
        >
          {all ? "Ringkas daftar" : `Lihat semua ${list.length} provinsi`}
        </button>
      )}
    </section>
  );
}
